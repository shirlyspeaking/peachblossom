/**
 * 「摸魚」俱樂部文章來源。
 * 瀏覽器不能穩定直連各站 RSS（公開 CORS 代理會失效），改由 Pages Function 在伺服器抓取，
 * 只保留最近 7 天、並依來源輪流挑選，避免同一媒體佔滿列表。
 */

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const FUTURE_SLACK_MS = 6 * 60 * 60 * 1000;
const CACHE_SECONDS = 20 * 60;
const EMPTY_CACHE_SECONDS = 60;
const PER_SOURCE = 6;
const FEED_LIMIT = 36;
const SUMMARY_LENGTH = 150;
const FETCH_TIMEOUT_MS = 8000;

const RSS_SOURCES = [
  { name: "泛科學", url: "https://pansci.asia/feed/" },
  { name: "科技新報", url: "https://technews.tw/feed" },
  { name: "運動視界", url: "https://www.sportsv.net/feed" },
  { name: "台視娛樂", url: "https://www.ttv.com.tw/rss/RSSHandler.ashx?d=news&t=F" },
  { name: "公視新聞", url: "https://news.pts.org.tw/xml/newsfeed.xml" },
  { name: "中央社文化", url: "https://feeds.feedburner.com/rsscna/culture" },
  { name: "中央社科技", url: "https://feeds.feedburner.com/rsscna/technology" },
  { name: "中央社體育", url: "https://feeds.feedburner.com/rsscna/sport" },
  { name: "BBC 中文", url: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml" },
  { name: "自由時報生活", url: "https://news.ltn.com.tw/rss/life.xml" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function decodeBasicEntities(raw) {
  let s = String(raw || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let i = 0; i < 2; i++) {
    s = s
      .replace(/&#(\d+);/g, (_, n) => {
        const code = Number(n);
        return Number.isFinite(code) ? String.fromCodePoint(code) : _;
      })
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
        const code = parseInt(h, 16);
        return Number.isFinite(code) ? String.fromCodePoint(code) : _;
      })
      .replace(/&nbsp;/gi, " ")
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&");
  }
  return s;
}

function stripTags(html) {
  return decodeBasicEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createSummary(text, maxLen) {
  const clean = stripTags(text);
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  let cut = clean.slice(0, maxLen);
  const lastPunct = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
  if (lastPunct >= maxLen * 0.55) return cut.slice(0, lastPunct + 1);
  const lastComma = cut.lastIndexOf("，");
  if (lastComma > maxLen * 0.5) return cut.slice(0, lastComma + 1);
  return cut + "…";
}

function tagInner(block, names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)</${escaped}>`, "i");
    const m = block.match(re);
    if (m && m[1] && m[1].trim()) return m[1].trim();
  }
  return "";
}

function itemLink(block) {
  const textLink = stripTags(tagInner(block, ["link"]));
  if (/^https?:\/\//i.test(textLink)) return textLink;
  let fallback = "";
  const hrefs = block.matchAll(/<link\b([^>]*?)\/?>/gi);
  for (const m of hrefs) {
    const attrs = m[1] || "";
    const href = (attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
    if (!/^https?:\/\//i.test(href)) continue;
    const rel = ((attrs.match(/\brel\s*=\s*["']([^"']+)["']/i) || [])[1] || "").toLowerCase();
    if (rel === "self" || rel === "enclosure" || rel === "replies") continue;
    if (!fallback) fallback = href;
    if (rel === "alternate" || rel === "") return href;
  }
  const guid = stripTags(tagInner(block, ["guid"]));
  if (/^https?:\/\//i.test(guid)) return guid;
  return fallback;
}

function extractBlocks(xml) {
  const items = [...xml.matchAll(/<item\b[^>]*>[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  if (items.length) return items;
  return [...xml.matchAll(/<entry\b[^>]*>[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
}

export function parseFeedXml(xmlText, sourceName, nowMs) {
  const xml = String(xmlText || "").replace(/^\uFEFF/, "");
  if (!/<(rss|feed|rdf)\b/i.test(xml.slice(0, 800))) return [];
  const startMs = nowMs - WINDOW_MS;
  const upperMs = nowMs + FUTURE_SLACK_MS;
  const articles = [];
  for (const block of extractBlocks(xml)) {
    const title = stripTags(tagInner(block, ["title"]));
    const link = itemLink(block);
    const dateRaw = stripTags(
      tagInner(block, ["pubDate", "published", "updated", "dc:date", "date"])
    );
    const dateMs = Date.parse(dateRaw);
    if (!title || !/^https?:\/\//i.test(link)) continue;
    if (!Number.isFinite(dateMs) || dateMs < startMs || dateMs > upperMs) continue;
    const summary = createSummary(
      tagInner(block, ["description", "summary", "content:encoded", "content"]) || title,
      SUMMARY_LENGTH
    );
    articles.push({
      title,
      link,
      summary: summary || title,
      date: new Date(dateMs).toISOString(),
      dateMs,
      source: sourceName,
    });
  }
  articles.sort((a, b) => b.dateMs - a.dateMs);
  return articles;
}

function diversify(groups, limit) {
  const queues = groups.map((items) => items.slice(0, PER_SOURCE));
  const out = [];
  while (out.length < limit) {
    let added = false;
    for (const queue of queues) {
      if (!queue.length) continue;
      out.push(queue.shift());
      added = true;
      if (out.length >= limit) break;
    }
    if (!added) break;
  }
  return out;
}

async function fetchSource(source) {
  const res = await fetch(source.url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${source.name} HTTP ${res.status}`);
  return res.text();
}

export async function buildFeed(nowMs = Date.now()) {
  const settled = await Promise.allSettled(RSS_SOURCES.map((source) => fetchSource(source)));
  const groups = [];
  const failed = [];
  const seen = new Set();
  settled.forEach((result, index) => {
    const source = RSS_SOURCES[index];
    if (result.status !== "fulfilled") {
      failed.push(source.name);
      return;
    }
    const parsed = parseFeedXml(result.value, source.name, nowMs).filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });
    if (!parsed.length) {
      failed.push(source.name);
      return;
    }
    groups.push(parsed);
  });
  return {
    fetchedAt: new Date(nowMs).toISOString(),
    windowDays: 7,
    articles: diversify(groups, FEED_LIMIT),
    sourceCount: groups.length,
    failed,
  };
}

function jsonResponse(body, status, cacheSeconds) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=60, s-maxage=${cacheSeconds}`,
    },
  });
}

export async function onRequestGet({ request }) {
  const cache = caches.default;
  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    const payload = await buildFeed();
    console.log(
      JSON.stringify({
        enjoyreadFeed: true,
        articles: payload.articles.length,
        sourceCount: payload.sourceCount,
        failed: payload.failed,
      })
    );
    const ok = payload.articles.length > 0;
    const response = jsonResponse(payload, ok ? 200 : 503, ok ? CACHE_SECONDS : EMPTY_CACHE_SECONDS);
    if (ok) await cache.put(cacheKey, response.clone());
    return response;
  } catch (err) {
    console.error("enjoyread feed failed", err);
    return jsonResponse(
      { fetchedAt: new Date().toISOString(), windowDays: 7, articles: [], sourceCount: 0, failed: ["all"] },
      503,
      EMPTY_CACHE_SECONDS
    );
  }
}

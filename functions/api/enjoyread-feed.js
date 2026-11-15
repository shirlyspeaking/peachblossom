/**
 * 「摸魚」俱樂部文章來源。
 * 瀏覽器不能穩定直連各站 RSS（公開 CORS 代理會失效），改由 Pages Function 在伺服器抓取，
 * 只保留最近 7 天，每個來源最多取幾篇，前端再依分類輪流挑選。
 * 快取過期時先回上一份、背景重抓，避免「換一批」要等全部來源回應。
 */

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const FUTURE_SLACK_MS = 6 * 60 * 60 * 1000;
const FRESH_MS = 15 * 60 * 1000;
const STALE_KEEP_SECONDS = 24 * 60 * 60;
const PER_SOURCE = 8;
const FETCH_TIMEOUT_MS = 7000;
const SUMMARY_TARGET = { zh: 120, en: 240 };
/** 列表節選約三行；太短的（只有一句話）不列入 */
const SUMMARY_MIN = { zh: 60, en: 120 };
const CACHE_VERSION = "v4";

const RSS_SOURCES = [
  { name: "泛科學", url: "https://pansci.asia/feed/", category: "科學", lang: "zh", region: "台灣" },
  { name: "科技新報", url: "https://technews.tw/feed", category: "科技", lang: "zh", region: "台灣" },
  { name: "中央社科技", url: "https://feeds.feedburner.com/rsscna/technology", category: "科技", lang: "zh", region: "台灣" },
  { name: "中央社文化", url: "https://feeds.feedburner.com/rsscna/culture", category: "文化", lang: "zh", region: "台灣" },
  { name: "中央社體育", url: "https://feeds.feedburner.com/rsscna/sport", category: "運動", lang: "zh", region: "台灣" },
  { name: "運動視界", url: "https://www.sportsv.net/feed", category: "運動", lang: "zh", region: "台灣" },
  { name: "自由時報生活", url: "https://news.ltn.com.tw/rss/life.xml", category: "生活", lang: "zh", region: "台灣" },
  { name: "Yahoo 旅遊", url: "https://tw.news.yahoo.com/rss/travel", category: "旅遊", lang: "zh", region: "台灣" },
  { name: "Yahoo 健康", url: "https://tw.news.yahoo.com/rss/health", category: "生活", lang: "zh", region: "台灣" },
  { name: "Vogue 台灣", url: "https://www.vogue.com.tw/feed/rss", category: "時尚", lang: "zh", region: "台灣" },
  { name: "Hypebeast 中文", url: "https://hypebeast.com/zh/feed", category: "時尚", lang: "zh", region: "國際" },
  { name: "換日線", url: "https://crossing.cw.com.tw/rss", category: "國際", lang: "zh", region: "國際" },
  { name: "紐約時報中文網", url: "https://cn.nytimes.com/rss/", category: "國際", lang: "zh", region: "美國" },
  { name: "法廣 RFI", url: "https://www.rfi.fr/tw/rss", category: "國際", lang: "zh", region: "法國" },
  { name: "BBC 中文", url: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml", category: "國際", lang: "zh", region: "英國" },
  { name: "CNA Lifestyle", url: "https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511", category: "生活", lang: "en", region: "新加坡" },
  { name: "CNA Singapore", url: "https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=10416", category: "國際", lang: "en", region: "新加坡" },
  { name: "The Straits Times Life", url: "https://www.straitstimes.com/news/life/rss.xml", category: "生活", lang: "en", region: "新加坡" },
  { name: "Harper's Bazaar SG", url: "https://www.harpersbazaar.com.sg/feed/", category: "時尚", lang: "en", region: "新加坡" },
  { name: "Mothership", url: "https://mothership.sg/feed/", category: "生活", lang: "en", region: "新加坡" },
  { name: "Vogue", url: "https://www.vogue.com/feed/rss", category: "時尚", lang: "en", region: "美國" },
  { name: "WWD", url: "https://wwd.com/feed/", category: "時尚", lang: "en", region: "美國" },
  { name: "Smithsonian", url: "https://www.smithsonianmag.com/rss/latest_articles/", category: "科學", lang: "en", region: "美國" },
  { name: "BBC Science", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", category: "科學", lang: "en", region: "英國" },
];

/** 中學生閱讀平台：標題含這些字的暴力、犯罪、色情新聞不列入 */
const BLOCKED_TITLE =
  /性侵|性騷|強暴|猥褻|殺人|殺害|兇殺|槍殺|槍擊|命案|屍|自殺|輕生|毒品|毒駕|吸毒|販毒|砍人|虐|色情|裸照|賭博|\b(murder|murdered|rape|sexual assault|suicide|shooting|stabbing|porn|corpse)\b/i;

const BOILERPLATE = [
  /The post .*? appeared first on .*$/i,
  /Continue reading.*$/i,
  /Read more.*$/i,
  /閱讀全文.*$/,
  /繼續閱讀.*$/,
  /\[(…|\.\.\.|&#8230;)\]\s*$/,
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function decodeBasicEntities(raw) {
  let s = String(raw || "").replace(/<!\[CDATA\[([\s\S]*?)(\]\]>|$)/g, "$1");
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
      .replace(/&hellip;/gi, "…")
      .replace(/&[lr]squo;/gi, "'")
      .replace(/&[lr]dquo;/gi, '"')
      .replace(/&mdash;/gi, "—")
      .replace(/&ndash;/gi, "–")
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
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(text) {
  let s = stripTags(text).replace(/https?:\/\/\S+/g, " ").replace(/\s+/g, " ").trim();
  for (const re of BOILERPLATE) s = s.replace(re, "").trim();
  return s
    .replace(/^【[^】]{0,40}】\s*/, "")
    .replace(/^（中央社[^）]{0,40}）/, "")
    .replace(/^\(?(中央社|CNA)[^)）]{0,30}[)）]\s*/, "")
    .replace(/^(摘要|導讀|前言)\s*[:：]?\s*/, "")
    .trim();
}

function createSummary(text, lang) {
  const maxLen = SUMMARY_TARGET[lang] || SUMMARY_TARGET.zh;
  const clean = cleanText(text);
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const enders = lang === "en" ? [". ", "! ", "? "] : ["。", "！", "？"];
  const lastEnd = Math.max(...enders.map((p) => cut.lastIndexOf(p)));
  if (lastEnd >= maxLen * 0.6) return cut.slice(0, lastEnd + 1).trim();
  const soft = lang === "en" ? cut.lastIndexOf(" ") : Math.max(cut.lastIndexOf("，"), cut.lastIndexOf("、"));
  if (soft > maxLen * 0.6) return cut.slice(0, soft).trim() + "…";
  return cut + "…";
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tagInner(block, names) {
  for (const name of names) {
    const re = new RegExp(`<${escapeRe(name)}\\b[^>]*>([\\s\\S]*?)</${escapeRe(name)}>`, "i");
    const m = block.match(re);
    if (m && m[1] && m[1].trim()) return m[1].trim();
  }
  return "";
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${escapeRe(name)}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? decodeBasicEntities(m[1]).trim() : "";
}

function itemLink(block) {
  const textLink = stripTags(tagInner(block, ["link"]));
  if (/^https?:\/\//i.test(textLink)) return textLink;
  let fallback = "";
  for (const m of block.matchAll(/<link\b[^>]*>/gi)) {
    const href = attr(m[0], "href");
    if (!/^https?:\/\//i.test(href)) continue;
    const rel = attr(m[0], "rel").toLowerCase();
    if (rel === "self" || rel === "enclosure" || rel === "replies") continue;
    if (!fallback) fallback = href;
    if (rel === "alternate" || rel === "") return href;
  }
  const guid = stripTags(tagInner(block, ["guid"]));
  if (/^https?:\/\//i.test(guid)) return guid;
  return fallback;
}

function normalizeImage(url) {
  let u = String(url || "").trim();
  if (!u) return "";
  if (u.startsWith("//")) u = "https:" + u;
  if (u.startsWith("http://")) u = "https://" + u.slice(7);
  if (!/^https:\/\//i.test(u)) return "";
  if (/\.(gif|svg)(\?|$)/i.test(u)) return "";
  if (/(pixel|tracking|feedburner|spacer|1x1|emoji|gravatar)/i.test(u)) return "";
  return u;
}

function itemImage(block) {
  const tags = [
    ...block.matchAll(/<media:content\b[^>]*>/gi),
    ...block.matchAll(/<media:thumbnail\b[^>]*>/gi),
    ...block.matchAll(/<enclosure\b[^>]*>/gi),
  ];
  for (const m of tags) {
    const t = m[0];
    const type = attr(t, "type") || attr(t, "medium");
    if (type && !/image/i.test(type)) continue;
    const u = normalizeImage(attr(t, "url"));
    if (u) return u;
  }
  const html = decodeBasicEntities(
    tagInner(block, ["content:encoded", "description", "content", "summary"])
  );
  const bare = html.trim();
  if (/^https?:\/\/\S+\.(jpe?g|png|webp)(\?\S*)?$/i.test(bare)) return normalizeImage(bare);
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const u = normalizeImage(attr(m[0], "src") || attr(m[0], "data-src"));
    if (u) return u;
  }
  return "";
}

function extractBlocks(xml) {
  const items = [...xml.matchAll(/<item\b[^>]*>[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  if (items.length) return items;
  return [...xml.matchAll(/<entry\b[^>]*>[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
}

function pickSummary(block, title, lang) {
  const target = SUMMARY_TARGET[lang] || SUMMARY_TARGET.zh;
  const candidates = ["description", "summary", "content:encoded", "content"]
    .map((n) => cleanText(tagInner(block, [n])))
    .filter((t) => t && t !== title);
  const enough = candidates.find((t) => t.length >= target * 0.8);
  const best = enough || candidates.sort((a, b) => b.length - a.length)[0] || "";
  return createSummary(best, lang);
}

export function parseFeedXml(xmlText, source, nowMs) {
  const xml = String(xmlText || "").replace(/^\uFEFF/, "");
  if (!/<(rss|feed|rdf)\b/i.test(xml.slice(0, 1500))) return [];
  const startMs = nowMs - WINDOW_MS;
  const upperMs = nowMs + FUTURE_SLACK_MS;
  const articles = [];
  for (const block of extractBlocks(xml)) {
    const title = cleanText(tagInner(block, ["title"]));
    const link = itemLink(block);
    const dateRaw = stripTags(
      tagInner(block, ["pubDate", "published", "updated", "dc:date", "date"])
    );
    const dateMs = Date.parse(dateRaw);
    if (!title || !/^https?:\/\//i.test(link)) continue;
    if (!Number.isFinite(dateMs) || dateMs < startMs || dateMs > upperMs) continue;
    if (BLOCKED_TITLE.test(title)) continue;
    const summary = pickSummary(block, title, source.lang);
    if (!summary || summary.length < (SUMMARY_MIN[source.lang] || SUMMARY_MIN.zh)) continue;
    articles.push({
      title,
      link,
      summary,
      image: itemImage(block),
      date: new Date(dateMs).toISOString(),
      dateMs,
      source: source.name,
      category: source.category,
      lang: source.lang,
      region: source.region,
    });
  }
  articles.sort((a, b) => b.dateMs - a.dateMs);
  return articles.slice(0, PER_SOURCE);
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
  const articles = [];
  const failed = [];
  const seen = new Set();
  let sourceCount = 0;
  settled.forEach((result, index) => {
    const source = RSS_SOURCES[index];
    if (result.status !== "fulfilled") {
      failed.push(source.name);
      return;
    }
    const parsed = parseFeedXml(result.value, source, nowMs).filter((item) => {
      const key = item.link.replace(/[?#].*$/, "");
      if (seen.has(key) || seen.has(item.title)) return false;
      seen.add(key);
      seen.add(item.title);
      return true;
    });
    if (!parsed.length) {
      failed.push(source.name);
      return;
    }
    sourceCount += 1;
    articles.push(...parsed);
  });
  articles.sort((a, b) => b.dateMs - a.dateMs);
  return {
    fetchedAt: new Date(nowMs).toISOString(),
    windowDays: 7,
    articles,
    sourceCount,
    failed,
  };
}

function jsonResponse(body, status) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function cacheKeyFor(request) {
  const u = new URL(request.url);
  u.pathname = `/__cache/enjoyread-feed-${CACHE_VERSION}`;
  u.search = "";
  return new Request(u.toString(), { method: "GET" });
}

async function rebuildAndStore(cache, key) {
  const payload = await buildFeed();
  console.log(
    JSON.stringify({
      enjoyreadFeed: true,
      articles: payload.articles.length,
      sourceCount: payload.sourceCount,
      failed: payload.failed,
    })
  );
  if (!payload.articles.length) return null;
  const body = JSON.stringify(payload);
  await cache.put(
    key,
    new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${STALE_KEEP_SECONDS}`,
      },
    })
  );
  return body;
}

export async function onRequestGet(context) {
  const { request } = context;
  const cache = caches.default;
  const key = cacheKeyFor(request);
  const hit = await cache.match(key);
  let cachedBody = "";
  if (hit) {
    cachedBody = await hit.text();
    let fetchedMs = NaN;
    try {
      fetchedMs = Date.parse(JSON.parse(cachedBody).fetchedAt);
    } catch (_) {
      cachedBody = "";
    }
    if (cachedBody) {
      if (!(Date.now() - fetchedMs < FRESH_MS)) {
        context.waitUntil(
          rebuildAndStore(cache, key).catch((err) => console.error("enjoyread feed refresh failed", err))
        );
      }
      return jsonResponse(cachedBody, 200);
    }
  }

  try {
    const body = await rebuildAndStore(cache, key);
    if (body) return jsonResponse(body, 200);
  } catch (err) {
    console.error("enjoyread feed failed", err);
  }
  return jsonResponse(
    { fetchedAt: new Date().toISOString(), windowDays: 7, articles: [], sourceCount: 0, failed: ["all"] },
    503
  );
}

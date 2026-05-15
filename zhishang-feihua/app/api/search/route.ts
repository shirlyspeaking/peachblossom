import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const EXCLUDE_KEYWORDS = ["成人", "賭博", "暴力", "色情"];

function isSuitableForStudents(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase();
  for (const kw of EXCLUDE_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "尚未設定 TAVILY_API_KEY，無法搜尋網路文章。", results: [] },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: q,
        search_depth: "basic",
        max_results: 12,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Tavily API error:", err);
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const results = (data.results || [])
      .filter(
        (r: { title?: string; content?: string }) =>
          r.title && r.content && isSuitableForStudents(r.title, r.content)
      )
      .slice(0, 12)
      .map((r: { title: string; content: string; url: string }, i: number) => ({
        id: `search-${i}-${Date.now()}`,
        title: r.title,
        summary: r.content?.slice(0, 150) + (r.content?.length > 150 ? "…" : ""),
        source: new URL(r.url).hostname.replace("www.", ""),
        url: r.url,
        readTime: Math.max(3, Math.ceil((r.content?.length || 0) / 400)),
      }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ results: [] });
  }
}

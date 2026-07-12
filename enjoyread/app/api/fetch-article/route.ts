import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const { url, title } = (await request.json()) as { url?: string; title?: string };
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    if (url.includes("example.com")) {
      const mockContent = `黑洞是宇宙中最神秘的天體之一。當一顆質量足夠大的恆星在生命末期耗盡核燃料後，核心會發生引力坍縮。如果恆星質量超過約 3 倍太陽質量，沒有任何力量能阻止坍縮，最終形成黑洞。

黑洞的邊界稱為「事件視界」，一旦物質或光線跨越這個邊界，就無法逃脫。黑洞會扭曲周圍的時空，產生強大的引力效應。科學家透過觀察黑洞對周圍恆星和氣體的影響，以及 2019 年公布的首張黑洞影像，逐步揭開黑洞的神秘面紗。`;
      return NextResponse.json({
        content: mockContent,
        title: title || "示範文章",
      });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LoafingClub/1.0; +https://peachblossom.edu)",
      },
    });
    const html = await res.text();

    const text = extractText(html);
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "無法擷取文章正文，可能該網站不支援", content: "" },
        { status: 422 }
      );
    }
    return NextResponse.json({ content: text, title: extractTitle(html) });
  } catch (err) {
    console.error("Fetch article error:", err);
    return NextResponse.json(
      { error: "Failed to fetch article", content: "" },
      { status: 500 }
    );
  }
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractText(html: string): string {
  const scriptStyleRegex = /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi;
  let text = html.replace(scriptStyleRegex, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text.slice(0, 15000);
}

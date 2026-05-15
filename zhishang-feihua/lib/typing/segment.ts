/** 以 grapheme 為單位切分，利於中文與 emoji 對齊。 */
export function segmentGraphemes(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const seg = new Intl.Segmenter("zh-Hant", { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    } catch {
      // ignore
    }
  }
  return Array.from(text);
}

export function sliceGraphemes(text: string, maxGraphemes: number): string {
  const g = segmentGraphemes(text);
  return g.slice(0, maxGraphemes).join("");
}

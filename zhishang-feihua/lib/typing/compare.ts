import { segmentGraphemes } from "./segment";

export function isStrictGraphemePrefix(target: string, typed: string): boolean {
  const t = segmentGraphemes(target);
  const u = segmentGraphemes(typed);
  if (u.length > t.length) return false;
  for (let i = 0; i < u.length; i++) {
    if (u[i] !== t[i]) return false;
  }
  return true;
}

export function graphemesEqual(a: string, b: string): boolean {
  const aa = segmentGraphemes(a);
  const bb = segmentGraphemes(b);
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) {
    if (aa[i] !== bb[i]) return false;
  }
  return true;
}

export type ParagraphCompare = {
  matchLen: number;
  hasError: boolean;
  errorIndex: number | null;
};

export function compareParagraph(expected: string, typed: string): ParagraphCompare {
  const ex = segmentGraphemes(expected);
  const ty = segmentGraphemes(typed);
  let i = 0;
  while (i < ex.length && i < ty.length && ex[i] === ty[i]) {
    i += 1;
  }
  const matchLen = i;
  if (ty.length === 0) {
    return { matchLen: 0, hasError: false, errorIndex: null };
  }
  if (i === ex.length && ty.length === ex.length) {
    return { matchLen, hasError: false, errorIndex: null };
  }
  if (i === ex.length && ty.length > ex.length) {
    return { matchLen: ex.length, hasError: true, errorIndex: ex.length };
  }
  if (i < ty.length && (i >= ex.length || ex[i] !== ty[i])) {
    return { matchLen, hasError: true, errorIndex: i };
  }
  return { matchLen, hasError: false, errorIndex: null };
}

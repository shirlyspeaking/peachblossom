export function parseCommaList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function corsAllowOrigin(request: Request, allowedOrigins: string[]): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  return allowedOrigins.includes(origin) ? origin : null;
}

/** 防止 open redirect：returnTo 必須以允許的前綴開頭 */
export function isAllowedReturnTo(returnTo: string, prefixes: string[]): boolean {
  if (!returnTo || prefixes.length === 0) return false;
  try {
    const u = new URL(returnTo);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    // 僅允許 http 於本機
    if (u.protocol === "http:" && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
      return false;
    }
    return prefixes.some((p) => returnTo.startsWith(p));
  } catch {
    return false;
  }
}

export function sessionDaysFromEnv(sessionDays: string | undefined): number {
  const n = Number.parseInt(sessionDays || "14", 10);
  return Number.isFinite(n) && n > 0 && n <= 365 ? n : 14;
}

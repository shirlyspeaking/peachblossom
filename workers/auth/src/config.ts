export function parseCommaList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 允許 https 下 peachspring.cc 及其任意子網域（含 Pages 自訂網域） */
export function isPeachspringHttpsOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") return false;
    const h = u.hostname;
    return h === "peachspring.cc" || h.endsWith(".peachspring.cc");
  } catch {
    return false;
  }
}

/**
 * CORS：先比對 ALLOWED_ORIGINS 明確清單，再允許 *.peachspring.cc（https）。
 * 避免僅列 apex/www 時，子網域或自訂主機無法帶 Cookie 呼叫 /auth/session。
 */
/** Cloudflare Pages 預覽網址（*.pages.dev），方便未綁自訂網域時測試 */
export function isHttpsPagesDevOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    return u.protocol === "https:" && u.hostname.endsWith(".pages.dev");
  } catch {
    return false;
  }
}

export function corsAllowOrigin(request: Request, allowedOrigins: string[]): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  if (allowedOrigins.includes(origin)) return origin;
  if (isPeachspringHttpsOrigin(origin)) return origin;
  if (isHttpsPagesDevOrigin(origin)) return origin;
  return null;
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

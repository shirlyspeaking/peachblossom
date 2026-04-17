export const SESSION_COOKIE_NAME = "pb_session";

export function readSessionCookie(request: Request): string | null {
  const raw = request.headers.get("Cookie");
  if (!raw) return null;
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return decodeURIComponent(p.slice(SESSION_COOKIE_NAME.length + 1));
    }
  }
  return null;
}

/** 本機 `localhost` 不設定 Domain，避免瀏覽器拒絕 */
export function buildSetSessionCookie(
  sessionId: string,
  domain: string,
  maxAgeSec: number,
  secure: boolean
): string {
  const attrs = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    `Max-Age=${maxAgeSec}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) attrs.push("Secure");
  if (domain && domain !== "localhost") attrs.push(`Domain=${domain}`);
  return attrs.join("; ");
}

export function buildClearSessionCookie(domain: string, secure: boolean): string {
  const attrs = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) attrs.push("Secure");
  if (domain && domain !== "localhost") attrs.push(`Domain=${domain}`);
  return attrs.join("; ");
}

export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

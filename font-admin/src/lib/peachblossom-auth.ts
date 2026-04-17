/**
 * 桃花源中央 Auth Worker（PEACHBLOSSOM_AUTH_URL）— font-admin 伺服端驗證
 */

export async function fetchFontAdminAccess(request: Request): Promise<{ allowed: boolean }> {
  const base = process.env.PEACHBLOSSOM_AUTH_URL?.trim();
  if (!base) return { allowed: false };

  const cookie = request.headers.get("cookie") ?? "";
  const url = `${base.replace(/\/$/, "")}/auth/apps/font-admin/access`;

  const res = await fetch(url, {
    method: "GET",
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return { allowed: false };
  const data = (await res.json()) as { allowed?: boolean };
  return { allowed: Boolean(data.allowed) };
}

export async function isFontAdminAuthorized(request: Request): Promise<boolean> {
  const adminKey = process.env.FONT_ADMIN_KEY;
  const provided = request.headers.get("x-font-admin-key");
  if (adminKey && provided === adminKey) return true;

  return (await fetchFontAdminAccess(request)).allowed;
}

import { corsAllowOrigin, isAllowedReturnTo, parseCommaList, sessionDaysFromEnv } from "./config";
import { randomBytesUrlSafe, sha256Base64Url } from "./crypto";
import {
  buildClearSessionCookie,
  buildSetSessionCookie,
  isSecureRequest,
  readSessionCookie,
} from "./cookies";
import {
  createSession,
  deleteSession,
  findSessionWithUser,
  hasFontAdminAccess,
  upsertUserAndLinkGoogle,
} from "./db";
import { exchangeAuthorizationCode, fetchGoogleUserInfo } from "./google";
import type { Env, OAuthStatePayload } from "./types";

const APP_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const OAUTH_KV_PREFIX = "oauth:";
const OAUTH_TTL_SEC = 600;

function adminEmails(env: Env): string[] {
  return parseCommaList(env.AUTH_ADMIN_EMAILS).map((e) => e.toLowerCase());
}

function json(
  data: unknown,
  status = 200,
  corsOrigin: string | null = null
): Response {
  const headers = new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");
  if (corsOrigin) {
    headers.set("Access-Control-Allow-Origin", corsOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function redirect(url: string, headers?: HeadersInit): Response {
  return new Response(null, { status: 302, headers: { Location: url, ...headers } });
}

function denyInlineJson(error: string, status = 403, corsOrigin: string | null = null): Response {
  return json({ ok: false, error }, status, corsOrigin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "internal_error";
      return json({ ok: false, error: msg }, 500, null);
    }
  },
};

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method;

  if (method === "OPTIONS") {
    const origin = corsAllowOrigin(request, parseCommaList(env.ALLOWED_ORIGINS));
    if (!origin) return new Response(null, { status: 403 });
    const allowHeaders =
      request.headers.get("Access-Control-Request-Headers") || "Content-Type, Cookie";
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": allowHeaders,
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }

  if (path === "/auth/health" && method === "GET") {
    return json({ ok: true, service: "peachblossom-auth" });
  }

  const allowedOrigins = parseCommaList(env.ALLOWED_ORIGINS);
  const corsOrigin = corsAllowOrigin(request, allowedOrigins);

  if (path === "/auth/session" && method === "GET") {
    return handleSession(request, env, corsOrigin);
  }

  if (path === "/auth/me" && method === "GET") {
    return handleSession(request, env, corsOrigin);
  }

  const accessMatch = path.match(/^\/auth\/apps\/([^/]+)\/access$/);
  if (accessMatch && method === "GET") {
    return handleAppAccess(request, env, accessMatch[1]!, corsOrigin);
  }

  const loginMatch = path.match(/^\/auth\/apps\/([^/]+)\/login$/);
  if (loginMatch && method === "GET") {
    return handleLogin(request, env, loginMatch[1]!);
  }

  if (path === "/auth/google/callback" && method === "GET") {
    return handleCallback(request, env);
  }

  const logoutMatch = path.match(/^\/auth\/apps\/([^/]+)\/logout$/);
  if (logoutMatch && (method === "GET" || method === "POST")) {
    return handleLogout(request, env, logoutMatch[1]!, method);
  }

  return json({ ok: false, error: "not_found" }, 404, corsOrigin);
}

async function handleSession(
  request: Request,
  env: Env,
  corsOrigin: string | null
): Promise<Response> {
  const sid = readSessionCookie(request);
  if (!sid) {
    return json({ authenticated: false, user: null, roles: [] }, 200, corsOrigin);
  }
  const now = Math.floor(Date.now() / 1000);
  const row = await findSessionWithUser(env.DB, sid, now);
  if (!row) {
    return json({ authenticated: false, user: null, roles: [] }, 200, corsOrigin);
  }
  const admins = adminEmails(env);
  return json(
    {
      authenticated: true,
      user: {
        id: row.user.id,
        email: row.user.email,
        name: row.user.name,
        picture: row.user.picture,
      },
      roles: row.roles,
      appAccess: {
        "font-admin": hasFontAdminAccess(row.user.email, row.roles, admins),
      },
    },
    200,
    corsOrigin
  );
}

async function handleAppAccess(
  request: Request,
  env: Env,
  appId: string,
  corsOrigin: string | null
): Promise<Response> {
  if (appId === "peachspring-home") {
    const sid = readSessionCookie(request);
    if (!sid) {
      return json({ allowed: false, reason: "no_session" }, 200, corsOrigin);
    }
    const now = Math.floor(Date.now() / 1000);
    const row = await findSessionWithUser(env.DB, sid, now);
    if (!row) {
      return json({ allowed: false, reason: "invalid_session" }, 200, corsOrigin);
    }
    return json({ allowed: true, appId }, 200, corsOrigin);
  }

  const sid = readSessionCookie(request);
  if (!sid) {
    return json({ allowed: false, reason: "no_session" }, 200, corsOrigin);
  }
  const now = Math.floor(Date.now() / 1000);
  const row = await findSessionWithUser(env.DB, sid, now);
  if (!row) {
    return json({ allowed: false, reason: "invalid_session" }, 200, corsOrigin);
  }
  const admins = adminEmails(env);

  if (appId === "font-admin") {
    const allowed = hasFontAdminAccess(row.user.email, row.roles, admins);
    return json({ allowed, appId }, 200, corsOrigin);
  }

  return json({ allowed: false, reason: "unknown_app", appId }, 200, corsOrigin);
}

async function handleLogin(request: Request, env: Env, appId: string): Promise<Response> {
  if (!APP_ID_RE.test(appId)) {
    return json({ ok: false, error: "invalid_app_id" }, 400, null);
  }
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return json({ ok: false, error: "missing_oauth_config" }, 500, null);
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") || "";
  const prefixes = parseCommaList(env.ALLOWED_RETURN_PREFIXES);
  if (!isAllowedReturnTo(returnTo, prefixes)) {
    return json({ ok: false, error: "invalid_return_to" }, 400, null);
  }

  // 僅允許已知 appId 走中央登入，避免任意字串濫用 auth 端點。
  if (appId !== "font-admin" && appId !== "peachspring-home") {
    return json({ ok: false, error: "unknown_app_id" }, 404, null);
  }

  const codeVerifier = randomBytesUrlSafe(32);
  const codeChallenge = await sha256Base64Url(codeVerifier);
  const state = randomBytesUrlSafe(24);

  const payload: OAuthStatePayload = {
    v: 1,
    code_verifier: codeVerifier,
    appId,
    returnTo,
    created_at: Date.now(),
  };

  await env.OAUTH_KV.put(`${OAUTH_KV_PREFIX}${state}`, JSON.stringify(payload), {
    expirationTtl: OAUTH_TTL_SEC,
  });

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return redirect(authUrl.toString());
}

async function handleCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (err) {
    return json(
      { ok: false, error: "oauth_error", detail: err, description: errDesc },
      400,
      null
    );
  }
  if (!code || !state) {
    return json({ ok: false, error: "missing_code_or_state" }, 400, null);
  }

  const raw = await env.OAUTH_KV.get(`${OAUTH_KV_PREFIX}${state}`);
  if (!raw) {
    return json({ ok: false, error: "invalid_or_expired_state" }, 400, null);
  }
  await env.OAUTH_KV.delete(`${OAUTH_KV_PREFIX}${state}`);

  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(raw) as OAuthStatePayload;
  } catch {
    return json({ ok: false, error: "bad_state_payload" }, 400, null);
  }
  if (payload.v !== 1 || !payload.code_verifier || !payload.returnTo) {
    return json({ ok: false, error: "bad_state_payload" }, 400, null);
  }

  const prefixes = parseCommaList(env.ALLOWED_RETURN_PREFIXES);
  if (!isAllowedReturnTo(payload.returnTo, prefixes)) {
    return json({ ok: false, error: "invalid_return_to_in_state" }, 400, null);
  }

  if (!env.GOOGLE_CLIENT_SECRET) {
    return json({ ok: false, error: "missing_client_secret" }, 500, null);
  }

  const token = await exchangeAuthorizationCode({
    code,
    redirectUri: env.GOOGLE_REDIRECT_URI,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    codeVerifier: payload.code_verifier,
  });

  const info = await fetchGoogleUserInfo(token.access_token);
  if (!info.email) {
    return json({ ok: false, error: "email_required" }, 400, null);
  }
  // 僅接受 Google 已驗證的信箱，避免未驗證郵箱進站。
  if ((info as { email_verified?: boolean }).email_verified === false) {
    return denyInlineJson("email_not_verified", 403, null);
  }

  const now = Math.floor(Date.now() / 1000);
  const user = await upsertUserAndLinkGoogle(
    env.DB,
    info.sub,
    info.email,
    info.name ?? null,
    info.picture ?? null,
    now
  );

  const sessionId = randomBytesUrlSafe(32);
  const days = sessionDaysFromEnv(env.SESSION_DAYS);
  const maxAge = days * 24 * 60 * 60;
  const expiresAt = now + maxAge;

  await createSession(env.DB, user.id, sessionId, expiresAt, now);

  const secure = isSecureRequest(request);
  const cookie = buildSetSessionCookie(sessionId, env.COOKIE_DOMAIN, maxAge, secure);

  return new Response(null, {
    status: 302,
    headers: {
      Location: payload.returnTo,
      "Set-Cookie": cookie,
    },
  });
}

async function handleLogout(
  request: Request,
  env: Env,
  appId: string,
  method: string
): Promise<Response> {
  if (!APP_ID_RE.test(appId)) {
    return json({ ok: false, error: "invalid_app_id" }, 400, null);
  }

  const url = new URL(request.url);
  let returnTo = url.searchParams.get("returnTo") || "";
  if (method === "POST") {
    try {
      const ct = request.headers.get("Content-Type") || "";
      if (ct.includes("application/json")) {
        const body = (await request.json()) as { returnTo?: string };
        if (body.returnTo) returnTo = body.returnTo;
      } else if (ct.includes("application/x-www-form-urlencoded")) {
        const text = await request.text();
        const p = new URLSearchParams(text);
        const r = p.get("returnTo");
        if (r) returnTo = r;
      }
    } catch {
      /* ignore */
    }
  }

  const prefixes = parseCommaList(env.ALLOWED_RETURN_PREFIXES);
  if (returnTo && !isAllowedReturnTo(returnTo, prefixes)) {
    return json({ ok: false, error: "invalid_return_to" }, 400, null);
  }

  const sid = readSessionCookie(request);
  if (sid) await deleteSession(env.DB, sid);

  const secure = isSecureRequest(request);
  const clear = buildClearSessionCookie(env.COOKIE_DOMAIN, secure);

  if (returnTo) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: returnTo,
        "Set-Cookie": clear,
      },
    });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", clear);
  return new Response(JSON.stringify({ ok: true, logged_out: true }), { status: 200, headers });
}

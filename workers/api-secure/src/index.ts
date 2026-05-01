interface Env {
  ALLOWED_ORIGINS?: string;
  AUTH_VERIFY_URL?: string;
  UPSTREAM_BASE_URL?: string;
  UPSTREAM_API_KEY: string;
}

interface VerifySessionResponse {
  authenticated?: boolean;
  user?: {
    id?: number | string;
    email?: string;
    name?: string;
  } | null;
}

interface ProxyRequestBody {
  path: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      return json(
        {
          ok: false,
          error: "internal_error",
          detail: error instanceof Error ? error.message : "unknown_error",
        },
        500
      );
    }
  },
};

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = trimSlash(url.pathname);
  const method = request.method.toUpperCase();
  const allowOrigins = parseCommaList(env.ALLOWED_ORIGINS);
  const corsOrigin = corsAllowOrigin(request, allowOrigins);

  if (method === "OPTIONS") {
    if (!corsOrigin) return new Response(null, { status: 403 });
    return buildCorsPreflight(request, corsOrigin);
  }

  if (path === "/api/health" && method === "GET") {
    return json({ ok: true, service: "peachblossom-api-secure" }, 200, corsOrigin);
  }

  if (path !== "/api/proxy" || method !== "POST") {
    return json({ ok: false, error: "not_found" }, 404, corsOrigin);
  }

  if (!corsOrigin) {
    return json({ ok: false, error: "origin_not_allowed" }, 403);
  }

  if (!env.UPSTREAM_API_KEY) {
    return json({ ok: false, error: "missing_upstream_api_key" }, 500, corsOrigin);
  }
  if (!env.AUTH_VERIFY_URL || !env.UPSTREAM_BASE_URL) {
    return json({ ok: false, error: "missing_worker_config" }, 500, corsOrigin);
  }

  const session = await verifySession(request, env.AUTH_VERIFY_URL, corsOrigin);
  if (!session.authenticated) {
    return json({ ok: false, error: "unauthenticated" }, 401, corsOrigin);
  }

  const body = (await safeReadJson(request)) as ProxyRequestBody | null;
  if (!body || typeof body.path !== "string" || !isValidPath(body.path)) {
    return json({ ok: false, error: "invalid_path" }, 400, corsOrigin);
  }

  const targetMethod = (body.method || "POST").toUpperCase();
  if (!ALLOWED_METHODS.has(targetMethod)) {
    return json({ ok: false, error: "method_not_allowed" }, 405, corsOrigin);
  }

  const upstreamUrl = new URL(body.path, env.UPSTREAM_BASE_URL);
  const requestHeaders = sanitizeForwardHeaders(body.headers);
  requestHeaders.set("Authorization", `Bearer ${env.UPSTREAM_API_KEY}`);

  const requestInit: RequestInit = { method: targetMethod, headers: requestHeaders };
  if (body.body !== undefined && targetMethod !== "GET") {
    requestInit.body = JSON.stringify(body.body);
    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
  }

  const upstreamResp = await fetch(upstreamUrl.toString(), requestInit);
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", upstreamResp.headers.get("Content-Type") || "application/json");
  responseHeaders.set("Access-Control-Allow-Origin", corsOrigin);
  responseHeaders.set("Access-Control-Allow-Credentials", "true");
  responseHeaders.set("Vary", "Origin");

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    headers: responseHeaders,
  });
}

function parseCommaList(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function corsAllowOrigin(request: Request, allowedOrigins: string[]): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  return allowedOrigins.includes(origin) ? origin : null;
}

function buildCorsPreflight(request: Request, origin: string): Response {
  const allowHeaders =
    request.headers.get("Access-Control-Request-Headers") || "Content-Type, Cookie";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": allowHeaders,
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}

function json(data: unknown, status = 200, corsOrigin?: string | null): Response {
  const headers = new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");
  if (corsOrigin) {
    headers.set("Access-Control-Allow-Origin", corsOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function trimSlash(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

function isValidPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

function sanitizeForwardHeaders(input?: Record<string, string>): Headers {
  const headers = new Headers();
  if (!input) return headers;

  for (const [key, value] of Object.entries(input)) {
    const lower = key.toLowerCase();
    if (lower === "authorization" || lower === "cookie" || lower === "host") continue;
    headers.set(key, value);
  }
  return headers;
}

async function safeReadJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function verifySession(
  request: Request,
  verifyUrl: string,
  origin: string
): Promise<VerifySessionResponse> {
  const cookie = request.headers.get("Cookie") || "";
  if (!cookie) return { authenticated: false };

  const resp = await fetch(verifyUrl, {
    method: "GET",
    headers: {
      Cookie: cookie,
      Origin: origin,
      Accept: "application/json",
    },
  });

  if (!resp.ok) return { authenticated: false };
  try {
    return (await resp.json()) as VerifySessionResponse;
  } catch {
    return { authenticated: false };
  }
}

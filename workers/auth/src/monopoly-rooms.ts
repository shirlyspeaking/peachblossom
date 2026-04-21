import { corsAllowOrigin, parseCommaList } from "./config";
import { readSessionCookie } from "./cookies";
import { findSessionWithUser } from "./db";
import type { Env, UserRow } from "./types";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_PREFIX = "/auth/apps/shanhaijing-monopoly/rooms";

export type MonopolyMember = {
  userId: string;
  playerIndex: number;
  name: string | null;
  email: string;
  picture: string | null;
};

/** 與前端 state 對齊，並附加 hostUserId / members */
export type MonopolySnapshot = {
  hostUserId: string;
  members: MonopolyMember[];
  tiles: unknown[];
  chance: unknown[];
  fate: unknown[];
  rulesText: string;
  game: {
    playerCount: number;
    players: Array<{ id: number; money: number; position: number }>;
    currentPlayerIndex: number;
    turnLog: string[];
  };
};

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

function randomRoomCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return s;
}

async function requireUser(request: Request, env: Env): Promise<UserRow | null> {
  const sid = readSessionCookie(request);
  if (!sid) return null;
  const now = Math.floor(Date.now() / 1000);
  const row = await findSessionWithUser(env.DB, sid, now);
  return row?.user ?? null;
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function clampPlayerCount(n: number): number {
  if (Number.isNaN(n) || n < 2) return 2;
  if (n > 6) return 6;
  return Math.floor(n);
}

/**
 * 嘗試處理山海經大富翁房間 API。若不匹配則回傳 null。
 */
export async function tryMonopolyRooms(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response | null> {
  const allowedOrigins = parseCommaList(env.ALLOWED_ORIGINS);
  const corsOrigin = corsAllowOrigin(request, allowedOrigins);
  if (!path.startsWith(ROOM_PREFIX)) return null;

  if (method !== "GET" && method !== "POST" && method !== "PUT") {
    return json({ ok: false, error: "method_not_allowed" }, 405, corsOrigin);
  }

  if (path === `${ROOM_PREFIX}/join` && method === "POST") {
    return handleJoin(request, env, corsOrigin);
  }

  if (path === ROOM_PREFIX && method === "POST") {
    return handleCreate(request, env, corsOrigin);
  }

  /** 避免瀏覽器或開發者工具對根路徑發 GET 時出現易誤解的 404 */
  if (path === ROOM_PREFIX && method === "GET") {
    return json(
      {
        ok: true,
        app: "shanhaijing-monopoly",
        endpoints: {
          createRoom: { method: "POST", path: ROOM_PREFIX },
          joinRoom: { method: "POST", path: `${ROOM_PREFIX}/join` },
          getOrUpdateRoom: { method: "GET | PUT", path: `${ROOM_PREFIX}/:roomCode` },
        },
      },
      200,
      corsOrigin
    );
  }

  const m = path.match(new RegExp(`^${escapeRegex(ROOM_PREFIX)}/([^/]+)$`));
  if (!m) return json({ ok: false, error: "not_found" }, 404, corsOrigin);
  const code = normalizeCode(m[1]!);
  if (code.length < 4) return json({ ok: false, error: "invalid_code" }, 400, corsOrigin);

  if (method === "GET") return handleGet(request, env, corsOrigin, code);
  if (method === "PUT") return handlePut(request, env, corsOrigin, code);

  return json({ ok: false, error: "not_found" }, 404, corsOrigin);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function handleCreate(
  request: Request,
  env: Env,
  corsOrigin: string | null
): Promise<Response> {
  const user = await requireUser(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401, corsOrigin);

  let body: { playerCount?: number; state?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, corsOrigin);
  }

  const playerCount = clampPlayerCount(Number(body.playerCount));
  const st = body.state && typeof body.state === "object" ? body.state : {};

  const snapshot = buildSnapshotFromClientState(user, playerCount, st);
  const now = Math.floor(Date.now() / 1000);

  for (let attempt = 0; attempt < 8; attempt++) {
    const id = crypto.randomUUID();
    const code = randomRoomCode();
    try {
      await env.DB.prepare(
        `INSERT INTO monopoly_rooms (id, code, host_user_id, version, snapshot_json, updated_at)
         VALUES (?, ?, ?, 0, ?, ?)`
      )
        .bind(id, code, user.id, JSON.stringify(snapshot), now)
        .run();
      return json(
        {
          ok: true,
          roomCode: code,
          version: 0,
          snapshot,
        },
        200,
        corsOrigin
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("UNIQUE") || msg.includes("unique")) continue;
      throw e;
    }
  }
  return json({ ok: false, error: "code_collision" }, 500, corsOrigin);
}

async function handleJoin(
  request: Request,
  env: Env,
  corsOrigin: string | null
): Promise<Response> {
  const user = await requireUser(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401, corsOrigin);

  let body: { code?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, corsOrigin);
  }
  const code = normalizeCode(String(body.code || ""));
  if (code.length < 4) return json({ ok: false, error: "invalid_code" }, 400, corsOrigin);

  const row = await env.DB.prepare(
    `SELECT id, host_user_id, version, snapshot_json FROM monopoly_rooms WHERE code = ?`
  )
    .bind(code)
    .first<{
      id: string;
      host_user_id: string;
      version: number;
      snapshot_json: string;
    }>();

  if (!row) return json({ ok: false, error: "room_not_found" }, 404, corsOrigin);

  let snapshot: MonopolySnapshot;
  try {
    snapshot = JSON.parse(row.snapshot_json) as MonopolySnapshot;
  } catch {
    return json({ ok: false, error: "bad_snapshot" }, 500, corsOrigin);
  }

  const pc = snapshot.game?.playerCount;
  if (typeof pc !== "number" || pc < 2 || pc > 6) {
    return json({ ok: false, error: "bad_snapshot" }, 500, corsOrigin);
  }

  const members = Array.isArray(snapshot.members) ? snapshot.members : [];
  if (members.some((m) => m.userId === user.id)) {
    return json(
      { ok: true, roomCode: code, version: row.version, snapshot },
      200,
      corsOrigin
    );
  }

  if (members.length >= pc) {
    return json({ ok: false, error: "room_full" }, 409, corsOrigin);
  }

  const nextIndex = members.length;
  const member: MonopolyMember = {
    userId: user.id,
    playerIndex: nextIndex,
    name: user.name,
    email: user.email,
    picture: user.picture,
  };
  snapshot.members = [...members, member];

  const newVersion = row.version + 1;
  const updatedAt = Math.floor(Date.now() / 1000);

  const res = await env.DB.prepare(
    `UPDATE monopoly_rooms SET snapshot_json = ?, version = ?, updated_at = ? WHERE id = ? AND version = ?`
  )
    .bind(JSON.stringify(snapshot), newVersion, updatedAt, row.id, row.version)
    .run();

  if (!res.success || (res.meta?.changes ?? 0) === 0) {
    return json({ ok: false, error: "version_conflict_retry" }, 409, corsOrigin);
  }

  return json(
    { ok: true, roomCode: code, version: newVersion, snapshot },
    200,
    corsOrigin
  );
}

async function handleGet(
  request: Request,
  env: Env,
  corsOrigin: string | null,
  code: string
): Promise<Response> {
  const user = await requireUser(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401, corsOrigin);

  const row = await env.DB.prepare(
    `SELECT snapshot_json, version FROM monopoly_rooms WHERE code = ?`
  )
    .bind(code)
    .first<{ snapshot_json: string; version: number }>();

  if (!row) return json({ ok: false, error: "room_not_found" }, 404, corsOrigin);

  let snapshot: MonopolySnapshot;
  try {
    snapshot = JSON.parse(row.snapshot_json) as MonopolySnapshot;
  } catch {
    return json({ ok: false, error: "bad_snapshot" }, 500, corsOrigin);
  }

  const members = Array.isArray(snapshot.members) ? snapshot.members : [];
  if (!members.some((m) => m.userId === user.id)) {
    return json({ ok: false, error: "not_in_room" }, 403, corsOrigin);
  }

  return json(
    { ok: true, roomCode: code, version: row.version, snapshot },
    200,
    corsOrigin
  );
}

async function handlePut(
  request: Request,
  env: Env,
  corsOrigin: string | null,
  code: string
): Promise<Response> {
  const user = await requireUser(request, env);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401, corsOrigin);

  let body: { version?: number; snapshot?: MonopolySnapshot };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, corsOrigin);
  }

  const clientVersion = Number(body.version);
  if (!Number.isFinite(clientVersion)) {
    return json({ ok: false, error: "bad_version" }, 400, corsOrigin);
  }
  if (!body.snapshot || typeof body.snapshot !== "object") {
    return json({ ok: false, error: "missing_snapshot" }, 400, corsOrigin);
  }

  const row = await env.DB.prepare(
    `SELECT id, version, snapshot_json FROM monopoly_rooms WHERE code = ?`
  )
    .bind(code)
    .first<{ id: string; version: number; snapshot_json: string }>();

  if (!row) return json({ ok: false, error: "room_not_found" }, 404, corsOrigin);

  let prev: MonopolySnapshot;
  try {
    prev = JSON.parse(row.snapshot_json) as MonopolySnapshot;
  } catch {
    return json({ ok: false, error: "bad_snapshot" }, 500, corsOrigin);
  }

  const members = Array.isArray(prev.members) ? prev.members : [];
  if (!members.some((m) => m.userId === user.id)) {
    return json({ ok: false, error: "not_in_room" }, 403, corsOrigin);
  }

  if (row.version !== clientVersion) {
    return json(
      {
        ok: false,
        error: "version_conflict",
        serverVersion: row.version,
        snapshot: prev,
      },
      409,
      corsOrigin
    );
  }

  const incoming = body.snapshot;
  incoming.hostUserId = prev.hostUserId;
  if (!Array.isArray(incoming.members)) incoming.members = prev.members;
  else {
    const prevIds = new Set(members.map((m) => m.userId));
    incoming.members = incoming.members.filter((m) =>
      prevIds.has(m.userId)
    ) as MonopolyMember[];
  }

  const newVersion = row.version + 1;
  const updatedAt = Math.floor(Date.now() / 1000);

  const res = await env.DB.prepare(
    `UPDATE monopoly_rooms SET snapshot_json = ?, version = ?, updated_at = ? WHERE id = ? AND version = ?`
  )
    .bind(JSON.stringify(incoming), newVersion, updatedAt, row.id, row.version)
    .run();

  if (!res.success || (res.meta?.changes ?? 0) === 0) {
    const fresh = await env.DB.prepare(
      `SELECT snapshot_json, version FROM monopoly_rooms WHERE code = ?`
    )
      .bind(code)
      .first<{ snapshot_json: string; version: number }>();
    let snap: MonopolySnapshot | null = null;
    if (fresh) {
      try {
        snap = JSON.parse(fresh.snapshot_json) as MonopolySnapshot;
      } catch {
        snap = null;
      }
    }
    return json(
      {
        ok: false,
        error: "version_conflict",
        serverVersion: fresh?.version ?? row.version,
        snapshot: snap,
      },
      409,
      corsOrigin
    );
  }

  return json(
    { ok: true, roomCode: code, version: newVersion, snapshot: incoming },
    200,
    corsOrigin
  );
}

const NUM_TILES = 24;

function buildSnapshotFromClientState(
  host: UserRow,
  playerCount: number,
  raw: Record<string, unknown>
): MonopolySnapshot {
  const tiles = cloneTiles(raw.tiles);
  const chance = cloneCardDeck(raw.chance, defaultChance());
  const fate = cloneCardDeck(raw.fate, defaultFate());
  const rulesText =
    typeof raw.rulesText === "string" ? raw.rulesText : defaultRulesText();

  const gameRaw = raw.game && typeof raw.game === "object" ? (raw.game as Record<string, unknown>) : {};
  const game = buildGame(playerCount, gameRaw);

  return {
    hostUserId: host.id,
    members: [
      {
        userId: host.id,
        playerIndex: 0,
        name: host.name,
        email: host.email,
        picture: host.picture,
      },
    ],
    tiles,
    chance,
    fate,
    rulesText,
    game,
  };
}

function defaultRulesText(): string {
  return (
    "玩家輪流擲骰前進，經過起點可領取獎勵金幣。\n" +
    "線上房間：人數固定為房主建立時設定；待所有玩家加入後即可輪流擲骰。"
  );
}

function cloneTiles(raw: unknown): unknown[] {
  if (!Array.isArray(raw) || raw.length !== NUM_TILES) {
    return defaultTiles();
  }
  return raw.map((t) => (t && typeof t === "object" ? { ...(t as object) } : t));
}

function defaultTiles(): unknown[] {
  const base = [
    { type: "tile-start", label: "起點", effect: "經過 +200 金幣" },
    { type: "tile-land", label: "崑崙墟", effect: "可購買地塊" },
    { type: "tile-event", label: "機會", effect: "抽機會卡" },
    { type: "tile-land", label: "青丘", effect: "支付過路費" },
    { type: "tile-land", label: "玄圃", effect: "可購買地塊" },
    { type: "tile-land", label: "扶桑木", effect: "可升級領地" },
    { type: "tile-jail", label: "幽都監", effect: "休息一回合" },
    { type: "tile-land", label: "流沙國", effect: "支付過路費" },
    { type: "tile-event", label: "命運", effect: "抽命運卡" },
    { type: "tile-land", label: "無啟國", effect: "可購買地塊" },
    { type: "tile-land", label: "羽民國", effect: "支付過路費" },
    { type: "tile-tax", label: "祭典費", effect: "支付 150 金幣" },
    { type: "tile-land", label: "北冥", effect: "可升級領地" },
    { type: "tile-free", label: "神獸集市", effect: "安全休息格" },
    { type: "tile-land", label: "不周山", effect: "支付過路費" },
    { type: "tile-event", label: "機會", effect: "抽機會卡" },
    { type: "tile-land", label: "塗山", effect: "可購買地塊" },
    { type: "tile-land", label: "丹穴山", effect: "支付過路費" },
    { type: "tile-tax", label: "修繕費", effect: "支付 180 金幣" },
    { type: "tile-land", label: "西王母池", effect: "可升級領地" },
    { type: "tile-go-jail", label: "誤入禁地", effect: "直接前往幽都監" },
    { type: "tile-land", label: "鐘山", effect: "支付過路費" },
    { type: "tile-event", label: "命運", effect: "抽命運卡" },
    { type: "tile-land", label: "東海", effect: "可購買地塊" },
  ];
  return base.slice(0, NUM_TILES);
}

function cloneCardDeck(raw: unknown, fallback: unknown[]): unknown[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return fallback.map((c) => (c && typeof c === "object" ? { ...(c as object) } : c));
  }
  return raw.map((c) => (c && typeof c === "object" ? { ...(c as object) } : c));
}

function defaultChance(): unknown[] {
  return [
    { title: "白澤指路", content: "前進到最近的機會格並再抽一張。" },
    { title: "獲得靈草", content: "領取 150 金幣。" },
    { title: "畢方來襲", content: "支付 100 金幣修復領地。" },
    { title: "玄龜庇佑", content: "本回合免租一次。" },
    { title: "夸父助跑", content: "再前進 3 格。" },
    { title: "青鳥傳信", content: "指定一位玩家與你交換位置。" },
  ];
}

function defaultFate(): unknown[] {
  return [
    { title: "天命加持", content: "所有玩家各支付你 50 金幣。" },
    { title: "迷霧封路", content: "後退 2 格。" },
    { title: "共工怒觸", content: "立刻前往起點，不領獎勵。" },
    { title: "女媧補天", content: "支付 120 金幣，下一輪可擲兩次。" },
    { title: "燭龍睜眼", content: "可任選前進 1~6 格。" },
    { title: "饕餮盛宴", content: "支付 200 金幣給銀行。" },
  ];
}

function buildGame(
  playerCount: number,
  gameRaw: Record<string, unknown>
): MonopolySnapshot["game"] {
  const players: MonopolySnapshot["game"]["players"] = [];
  for (let i = 0; i < playerCount; i++) {
    const pr = Array.isArray(gameRaw.players) ? (gameRaw.players as unknown[])[i] : null;
    const p =
      pr && typeof pr === "object"
        ? (pr as { money?: unknown; position?: unknown })
        : {};
    const money =
      typeof p.money === "number" && Number.isFinite(p.money) && p.money >= 0
        ? Math.floor(p.money)
        : 1500;
    const position =
      typeof p.position === "number" && Number.isFinite(p.position)
        ? ((((p.position as number) % NUM_TILES) + NUM_TILES) % NUM_TILES)
        : 0;
    players.push({ id: i, money, position });
  }

  let cpi = parseInt(String(gameRaw.currentPlayerIndex), 10);
  if (Number.isNaN(cpi)) cpi = 0;
  cpi = ((cpi % playerCount) + playerCount) % playerCount;

  let turnLog: string[] = [];
  if (Array.isArray(gameRaw.turnLog)) {
    turnLog = gameRaw.turnLog.map((x) => String(x));
  }
  if (turnLog.length === 0) {
    turnLog = [
      "線上房間已建立。待所有玩家加入後即可開始輪流擲骰。",
    ];
  }

  return {
    playerCount,
    players,
    currentPlayerIndex: cpi,
    turnLog,
  };
}

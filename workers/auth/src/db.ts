import type { RoleRow, UserRow } from "./types";

export async function findSessionWithUser(
  db: D1Database,
  sessionId: string,
  nowSec: number
): Promise<{ user: UserRow; roles: RoleRow[] } | null> {
  const row = await db
    .prepare(
      `SELECT u.id as uid, u.email, u.name, u.picture, u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`
    )
    .bind(sessionId, nowSec)
    .first<{
      uid: string;
      email: string;
      name: string | null;
      picture: string | null;
      created_at: number;
    }>();

  if (!row) return null;

  const user: UserRow = {
    id: row.uid,
    email: row.email,
    name: row.name,
    picture: row.picture,
    created_at: row.created_at,
  };

  const rolesRes = await db
    .prepare(`SELECT role, app_id FROM user_roles WHERE user_id = ?`)
    .bind(user.id)
    .all<RoleRow>();

  return { user, roles: rolesRes.results || [] };
}

export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sessionId).run();
}

export async function upsertUserAndLinkGoogle(
  db: D1Database,
  googleSub: string,
  email: string,
  name: string | null,
  picture: string | null,
  nowSec: number
): Promise<UserRow> {
  const linked = await db
    .prepare(
      `SELECT u.id, u.email, u.name, u.picture, u.created_at
       FROM google_identities g
       JOIN users u ON u.id = g.user_id
       WHERE g.google_sub = ?`
    )
    .bind(googleSub)
    .first<UserRow>();

  if (linked) {
    await db
      .prepare(`UPDATE users SET name = ?, picture = ? WHERE id = ?`)
      .bind(name, picture, linked.id)
      .run();
    return { ...linked, name, picture };
  }

  const byEmail = await db
    .prepare(`SELECT id, email, name, picture, created_at FROM users WHERE email = ?`)
    .bind(email)
    .first<UserRow>();

  let userId: string;
  if (byEmail) {
    userId = byEmail.id;
    await db
      .prepare(`UPDATE users SET name = ?, picture = ? WHERE id = ?`)
      .bind(name, picture, userId)
      .run();
  } else {
    userId = crypto.randomUUID();
    await db
      .prepare(`INSERT INTO users (id, email, name, picture, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(userId, email, name, picture, nowSec)
      .run();
  }

  await db
    .prepare(
      `INSERT INTO google_identities (google_sub, user_id) VALUES (?, ?)
       ON CONFLICT(google_sub) DO UPDATE SET user_id = excluded.user_id`
    )
    .bind(googleSub, userId)
    .run();

  const u = await db
    .prepare(`SELECT id, email, name, picture, created_at FROM users WHERE id = ?`)
    .bind(userId)
    .first<UserRow>();

  if (!u) throw new Error("user_missing_after_upsert");
  return u;
}

export async function createSession(
  db: D1Database,
  userId: string,
  sessionId: string,
  expiresAtSec: number,
  nowSec: number
): Promise<void> {
  await db
    .prepare(`INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`)
    .bind(sessionId, userId, expiresAtSec, nowSec)
    .run();
}

export function hasFontAdminAccess(
  email: string,
  roles: RoleRow[],
  adminEmails: string[]
): boolean {
  const em = email.toLowerCase();
  if (adminEmails.some((e) => e.toLowerCase() === em)) return true;
  return roles.some(
    (r) =>
      (r.role === "global_admin" && r.app_id === "") ||
      (r.role === "font_admin" && (r.app_id === "" || r.app_id === "font-admin"))
  );
}

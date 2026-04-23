export interface Env {
  DB: D1Database;
  OAUTH_KV: KVNamespace;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  /** 例：`.peachspring.cc`；本機可填 `localhost`（不寫 Domain 屬性） */
  COOKIE_DOMAIN: string;
  SESSION_DAYS?: string;
  ALLOWED_ORIGINS: string;
  ALLOWED_RETURN_PREFIXES: string;
  /** 逗號分隔；可存取 font-admin 的 Google 信箱 */
  AUTH_ADMIN_EMAILS?: string;
}

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  created_at: number;
};

export type RoleRow = {
  role: string;
  app_id: string;
};

export type OAuthStatePayload = {
  v: 1;
  code_verifier: string;
  appId: string;
  returnTo: string;
  created_at: number;
};

export type AppRoomMember = {
  userId: string;
  playerIndex: number;
  email: string;
  name: string | null;
  picture: string | null;
  joinedAt: number;
};

export type AppRoomRow = {
  app_id: string;
  room_code: string;
  host_user_id: string;
  player_count: number;
  version: number;
  snapshot_json: string;
  created_at: number;
  updated_at: number;
  last_active_at: number;
};

export type AppRoomSnapshot = Record<string, unknown> & {
  hostUserId: string;
  members: AppRoomMember[];
};

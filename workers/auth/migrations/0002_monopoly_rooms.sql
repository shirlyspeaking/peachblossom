-- 山海經大富翁：線上房間（快照 + 樂觀鎖版本號）

CREATE TABLE IF NOT EXISTS monopoly_rooms (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT NOT NULL UNIQUE,
  host_user_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  snapshot_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_monopoly_rooms_updated ON monopoly_rooms(updated_at);

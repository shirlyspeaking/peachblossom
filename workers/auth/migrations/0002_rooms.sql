-- 山海經大富翁多人房間

CREATE TABLE IF NOT EXISTS app_rooms (
  app_id TEXT NOT NULL,
  room_code TEXT NOT NULL,
  host_user_id TEXT NOT NULL,
  player_count INTEGER NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  snapshot_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  PRIMARY KEY (app_id, room_code),
  FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_rooms_updated_at ON app_rooms(app_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_app_rooms_last_active_at ON app_rooms(app_id, last_active_at);

CREATE TABLE IF NOT EXISTS app_room_members (
  app_id TEXT NOT NULL,
  room_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  player_index INTEGER NOT NULL,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (app_id, room_code, user_id),
  UNIQUE (app_id, room_code, player_index),
  FOREIGN KEY (app_id, room_code) REFERENCES app_rooms(app_id, room_code) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_room_members_lookup
  ON app_room_members(app_id, room_code, player_index);

#!/usr/bin/env bash
# 在 workers/auth 目錄執行：bash scripts/bootstrap.sh
# 需已安裝 Node.js / npm，並已登入 Cloudflare（npx wrangler login）

set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> npm install"
npm install

echo ""
echo "==> 建立 D1（若已存在會失敗，可忽略並手動從 Dashboard 複製 database_id）"
npx wrangler d1 create peachblossom-auth || true

echo ""
echo "==> 建立 KV namespace OAUTH_KV（若已存在請改用手動建立或換名）"
npx wrangler kv:namespace create OAUTH_KV || true

echo ""
echo "----------------------------------------------------------------"
echo "請將上方指令輸出中的 database_id 與 kv id 填入 wrangler.toml"
echo "接著："
echo "  npx wrangler d1 migrations apply peachblossom-auth --remote"
echo "  npx wrangler secret put GOOGLE_CLIENT_ID"
echo "  npx wrangler secret put GOOGLE_CLIENT_SECRET"
echo "並在 Dashboard 或使用 wrangler.toml [vars] 設定 GOOGLE_REDIRECT_URI、COOKIE_DOMAIN、ALLOWED_ORIGINS 等（見 docs/桃花源-Google-登入-Worker-部署.md）"
echo "----------------------------------------------------------------"

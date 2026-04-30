# 桃花源 API 安全調用 Worker 部署

此文件對應 `workers/api-secure`，目的是讓前端安全呼叫第三方 API，不在瀏覽器暴露 API Key。

## 1) 先決條件

- 已可登入 Cloudflare：`npx wrangler login`
- `auth.peachspring.cc` 已可回應 `/auth/session`
- 網域 `peachspring.cc` 由 Cloudflare 代管

## 2) 設定 Worker 變數

`workers/api-secure/wrangler.toml` 內已有：

- `ALLOWED_ORIGINS`：允許呼叫來源（前端站點）
- `AUTH_VERIFY_URL`：登入驗證網址（預設 `https://auth.peachspring.cc/auth/session`）
- `UPSTREAM_BASE_URL`：第三方 API 網域（預設 `https://api.openai.com`）

## 3) 設定 Secret（必要）

```bash
cd workers/api-secure
npx wrangler secret put UPSTREAM_API_KEY
```

## 4) 部署

```bash
cd workers/api-secure
npm install
npx wrangler deploy
```

部署成功後，測試：

```bash
curl https://api.peachspring.cc/api/health
```

預期回傳 `{"ok":true,...}`。

## 5) 前端整合重點

- 呼叫 `POST https://api.peachspring.cc/api/proxy`
- 請帶 `credentials: "include"`，讓 Session Cookie 能被帶上
- 前端不得傳 `Authorization`；Worker 會自動注入後端 Secret

## 6) 安全建議（強烈建議）

- 正式環境移除 localhost origin
- Cloudflare WAF 對 `/api/proxy` 啟用速率限制（例如每 IP 每分鐘上限）
- 依業務需求在 Worker 內限制可呼叫 path（白名單）

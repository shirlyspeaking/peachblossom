# peachblossom-api-secure（Cloudflare Worker）

桃花源「安全 API 調用」服務。  
用途是把第三方 API 金鑰留在 Cloudflare Worker 端，前端只打你自己的 `/api/proxy`，不直接暴露機密。

## 功能

- 僅允許白名單來源（`ALLOWED_ORIGINS`）呼叫
- 轉呼叫前先向 `AUTH_VERIFY_URL` 驗證登入 Session
- 只允許指定 HTTP method，並阻擋前端覆蓋 `Authorization`
- 第三方 API Key 以 `wrangler secret` 管理，不進版控

## 本機開發

```bash
cd workers/api-secure
npm install
cp .dev.vars.example .dev.vars
npx wrangler dev
```

## 部署

```bash
cd workers/api-secure
npx wrangler login
npx wrangler secret put UPSTREAM_API_KEY
npx wrangler deploy
```

> `UPSTREAM_API_KEY` 請填你的第三方 API 金鑰（例如 OpenAI）。

## 前端呼叫格式

```json
{
  "path": "/v1/chat/completions",
  "method": "POST",
  "body": {
    "model": "gpt-4o-mini",
    "messages": [{ "role": "user", "content": "你好" }]
  },
  "headers": {
    "Content-Type": "application/json"
  }
}
```

呼叫端點：`POST https://api.peachspring.cc/api/proxy`

## 建議

- 正式環境將 `ALLOWED_ORIGINS` 改成正式網域，不要保留 localhost
- 建議搭配 Cloudflare WAF Rate Limiting 對 `/api/proxy` 做速率限制
- 若要對不同上游服務分流，可在 body 增加 `provider` 並做白名單映射

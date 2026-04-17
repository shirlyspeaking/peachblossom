# peachblossom-auth（Cloudflare Worker）

桃花源中央 Google OAuth 服務。詳見上層文件：

- [docs/桃花源-Google-登入-Worker-部署.md](../../docs/桃花源-Google-登入-Worker-部署.md)

## 快速指令

```bash
npm install
bash scripts/bootstrap.sh   # 建立 D1 / KV（需 wrangler login），再將 id 填入 wrangler.toml
npx wrangler d1 migrations apply peachblossom-auth --local   # 本機
cp .dev.vars.example .dev.vars
npx wrangler dev
```

部署前請依 [docs/桃花源-Google-登入-Worker-部署.md](../../docs/桃花源-Google-登入-Worker-部署.md) 建立 Secrets / Vars，並將 `wrangler.toml` 內占位 `database_id` / KV `id` 換成真實值。

# 指上飛花（Zhishang Feihua）

獨立 Next.js 應用：詞語練習與段落練習，視覺風格對齊桃花源系。

## 桃花源首頁

根目錄 [index.html](../index.html) 的「指上飛花」卡片連到 **`zhishang-feihua/`**（本目錄下的靜態 [index.html](./index.html)）。該頁以**純 HTML 連結**指向線上版 **`https://zhishang-feihua.pages.dev/`**（不依賴內嵌 script，避免主站 CSP 導致按鈕失效）。

**為何曾出現 404／打不開：**`peachspring.cc` 主站是**純靜態檔**，無法執行 Next.js；線上版必須另外部署到 **Cloudflare Pages**（上列 `*.pages.dev`）。尚未執行過下方「部署」時，該網址會是空的專案或 404。

## 開發

```bash
cd zhishang-feihua
npm install
npm run dev
```

若 `npm install` 出現 **`SELF_SIGNED_CERT_IN_CHAIN`**，代表本機對 npm registry 的 HTTPS 被代理／憑證攔截；請向網路管理員取得企業根憑證並設定 `NODE_EXTRA_CA_CERTS`，或在其允許的網路下再安裝（不建議長期關閉 `strict-ssl`）。

預設埠：`3210`。

## 部署到 Cloudflare（路線 A：Git 連線，英文介面）

在 **Workers & Pages** → 你的專案 → **Settings** → **Build**（或 **Build configuration**）請設：

| English field | Value |
|---------------|--------|
| **Root directory** | `zhishang-feihua`（勿用 `/`） |
| **Build command** | `npm install && npm run pages:build` |
| **Deploy command** | `npx wrangler pages deploy .vercel/output/static --project-name=zhishang-feihua` |

勿使用單獨的 `npx wrangler deploy`（且 **Root** 為 `/` 會找不到 `package.json`，約 8 秒就失敗）。

**Environment variables**（Settings → Environment variables）：`NODE_VERSION` = `20`；選用 `TAVILY_API_KEY`、`DEEPSEEK_API_KEY`。

改完後 **Deployments** → **Retry deployment**。

## 部署到 Cloudflare Pages（本機 Wrangler，路線 B）

```bash
cd zhishang-feihua
npm install
npx wrangler login
npm run pages:deploy
```

- 第一次會建立專案 **`zhishang-feihua`**，完成後即可開啟 [https://zhishang-feihua.pages.dev/](https://zhishang-feihua.pages.dev/)。
- 建置使用 [`@cloudflare/next-on-pages`](https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/)，輸出目錄為 `.vercel/output/static`（見 [wrangler.toml](./wrangler.toml)）。
- 在 Cloudflare 後台為該專案設定 **Secrets**（與本機 `.env` 相同）：`TAVILY_API_KEY`、`DEEPSEEK_API_KEY` 等，段落搜尋與 AI 生成才會在線上環境生效。

## 環境變數（選用）

- `TAVILY_API_KEY`：段落練習「網路搜尋」載入文章。
- `DEEPSEEK_API_KEY`（可選 `DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`）：AI 生成短文。

未設定時，搜尋／生成會顯示友善提示，仍可用手動貼上或 .txt 上傳練習。

## 建置失敗（Last build failed）時

1. **Deployments** → 失敗那筆 → **Build log**，往下滑找到 **Error** / **npm ERR** 那段。
2. 確認 **Root directory** 為 **`zhishang-feihua`**（不可為 `/`）。
3. **Build command**：`npm install && npm run pages:build`  
   **Deploy command**：`npx wrangler pages deploy .vercel/output/static --project-name=zhishang-feihua`  
   （或使用不含 Deploy command 的傳統 Pages：**Output directory** = `.vercel/output/static`。）
4. 本專案使用 **Next 14.2** 以利 `@cloudflare/next-on-pages` 建置穩定；若錯誤仍提到 Next 15／相容性，請 **Retry deployment** 讓 Cloudflare 拉最新程式後再試。

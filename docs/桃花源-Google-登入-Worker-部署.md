# 桃花源中央 Google 登入（Cloudflare Worker）

## 0. 本機開發環境（已在本專案環境中安裝）

以下已由自動化設定完成（路徑以你的家目錄為準）：

| 項目 | 說明 |
|------|------|
| **Node.js** | 透過 **nvm** 安裝於 `~/.nvm`（目前預設 **Node 22**） |
| **npm** | 隨 Node 一併可用 |
| **npm SSL** | 若出現 `SELF_SIGNED_CERT_IN_CHAIN`，已於使用者層 `~/.npmrc` 與 [`workers/auth/.npmrc`](../workers/auth/.npmrc) 設定 `strict-ssl=false`（常見於公司網路／HTTPS 檢查） |
| **Wrangler** | 全域安裝：`wrangler --version` 約 **4.x** |
| **Shell** | 已建立 `~/.bashrc` / `~/.bash_profile`，新開終端機會自動載入 **nvm**（你的登入 shell 為 **bash**） |

**Cloudflare 登入**：請在本機終端機執行一次 `wrangler login`（會開啟瀏覽器完成 OAuth）。若不使用瀏覽器登入，可改在 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) 建立 **API Token**，並在終端機設定環境變數 `CLOUDFLARE_API_TOKEN`（Wrangler 會自動使用）。

---

本倉庫在 [`workers/auth/`](../workers/auth/) 提供**獨立 Auth Worker**：Google OAuth 2.0（Authorization Code + **PKCE**）、D1 使用者／Session、KV 儲存 OAuth `state`、**HttpOnly** Session Cookie（可設為父網域 `.peachspring.cc` 以全站共用）。

正式主站網域：**[https://peachspring.cc/](https://peachspring.cc/)**  
建議 Auth 子網域範例：**`https://auth.peachspring.cc`**（於 Cloudflare 將該主機名綁到此 Worker）。

## 1. Cloudflare 端

亦可先執行下方 **§3** 的 `bootstrap.sh`，再將輸出的 id 填入 `wrangler.toml`。

1. 建立 **D1** 資料庫（名稱可與 `wrangler.toml` 內 `database_name` 一致）：
   ```bash
   cd workers/auth
   npm install
   npx wrangler d1 create peachblossom-auth
   ```
   將回傳的 `database_id` 填入 `wrangler.toml` 的 `[[d1_databases]]`。

2. 建立 **KV** namespace（綁定名 `OAUTH_KV`）：
   ```bash
   npx wrangler kv:namespace create OAUTH_KV
   ```
   將 `id` 填入 `wrangler.toml` 的 `[[kv_namespaces]]`。

3. 套用 migration：
   ```bash
   npx wrangler d1 migrations apply peachblossom-auth --remote
   ```

4. 設定 **Secrets**（勿寫入 git）：
   ```bash
   npx wrangler secret put GOOGLE_CLIENT_ID
   npx wrangler secret put GOOGLE_CLIENT_SECRET
   ```
   其餘非機密變數可於 Dashboard **Workers** → 該 Worker → **Settings** → **Variables** 設定，或在本機 `wrangler.toml` 的 `[vars]`（僅限非機密）。

5. 建議的 **Vars**（非機密）：

   | 變數 | 說明 |
   |------|------|
   | `GOOGLE_REDIRECT_URI` | 與 Google Console 完全一致，例如 `https://auth.peachspring.cc/auth/google/callback` |
   | `COOKIE_DOMAIN` | `.peachspring.cc`（含前導點） |
   | `SESSION_DAYS` | `14`（可調） |
   | `ALLOWED_ORIGINS` | CORS，逗號分隔，須含所有會呼叫 `/auth/session` 的前端來源，例如 `https://peachspring.cc,https://www.peachspring.cc` |
   | `ALLOWED_RETURN_PREFIXES` | 防 open redirect；`returnTo` 必須以此開頭，例如 `https://peachspring.cc,https://www.peachspring.cc` |
   | `AUTH_ADMIN_EMAILS` | 可存取 **font-admin** 的 Google 信箱（逗號分隔）；進階可改為只依 D1 `user_roles` |

6. 將 **自訂網域**（如 `auth.peachspring.cc`）綁到該 Worker（**Workers & Pages** → 該 Worker → **Triggers** → **Custom Domains**）。

## 2. Google Cloud Console（詳細步驟）

以下在 [Google Cloud Console](https://console.cloud.google.com/) 操作（需 Google 帳號）。若你從未用過，會先建立一個 **專案（Project）**。

### 2.1 建立或選擇專案

1. 開啟 [Google Cloud Console](https://console.cloud.google.com/) → 左上角專案選擇器 → **新增專案**（例如名稱：`Peachblossom`）→ 建立。
2. 確認目前選中的就是你剛建立的專案。

### 2.2 OAuth 同意畫面（OAuth consent screen）

1. 左側選單 **APIs & Services**（API 和服務）→ **OAuth consent screen**（OAuth 同意畫面）。
2. **User Type**：一般公開網站選 **External**（外部）→ **建立**。
3. 必填欄位建議：
   - **App name**：例如 `桃花源 Peachblossom`
   - **User support email**：你的信箱
   - **Developer contact information**：你的信箱
4. **Scopes**（範圍）：可先 **Save and Continue** 跳過，稍後在建立憑證後由程式請求 `openid email profile` 即可；若精靈要求新增，可選：
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. **Test users**（測試使用者）：若應用程式狀態為 **Testing**（測試中），只有此處新增過的 Google 帳號可以登入。請把你的 Gmail 加進去 → **Save and Continue**。
6. 完成精靈。之後若要開放給所有 Google 使用者，在同意畫面將發布狀態改為 **In production**（正式版）；若僅限少數人，維持 Testing 並持續維護 Test users 即可。

### 2.3 建立 OAuth 2.0 用戶端（Web application）

1. **APIs & Services** → **Credentials**（憑證）→ **Create Credentials** → **OAuth client ID**。
2. **Application type**：**Web application**。
3. **Name**：例如 `Peachblossom Auth Worker`。
4. **Authorized JavaScript origins**（已授權的 JavaScript 來源）— 依 Google 要求填「網域根」，不要含路徑。建議至少新增：
   - `https://auth.peachspring.cc`（Auth Worker 子網域）
   - `https://peachspring.cc`（主站）
   - `https://www.peachspring.cc`（若你使用 www）
   - 本機開發：`http://localhost:8787`（對應 `wrangler dev` 預設埠）
5. **Authorized redirect URIs**（已授權的重新導向 URI）— **必須與 Worker 環境變數 `GOOGLE_REDIRECT_URI` 字元完全一致**，包含 `https`、路徑。請新增：
   - 正式：`https://auth.peachspring.cc/auth/google/callback`
   - 本機：`http://localhost:8787/auth/google/callback`
6. **建立** 後，畫面上會出現 **Client ID** 與 **Client secret**：
   - 複製到 Cloudflare Worker 的 Secrets：`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`（勿提交到 git）。
   - Client secret 只顯示一次，請當場保存；遺失則在該憑證頁面 **重設**。

### 2.4 與本倉庫 Worker 的對應關係

| Google Console | Worker / 設定 |
|----------------|----------------|
| Client ID | `GOOGLE_CLIENT_ID`（`wrangler secret`） |
| Client secret | `GOOGLE_CLIENT_SECRET`（`wrangler secret`） |
| Authorized redirect URIs | 須等於 `GOOGLE_REDIRECT_URI`（Vars） |
| Scopes（實際授權） | Worker 授權網址已帶 `openid email profile` |

### 2.5 常見錯誤

| 現象 | 可能原因 |
|------|----------|
| `redirect_uri_mismatch` | Google 後台的 Redirect URI 與 `GOOGLE_REDIRECT_URI` 不一致（多一個斜線、http/https 錯誤） |
| `access_denied` | 同意畫面為 Testing，但使用者未列入 Test users |
| 登入後前端顯示 CORS 錯誤 | Worker 的 `ALLOWED_ORIGINS` 未包含主站完整來源（例如 `https://peachspring.cc`） |

## 3. 一鍵建立 D1 / KV（本機需 Node）

在 [`workers/auth/`](../workers/auth/) 目錄：

```bash
bash scripts/bootstrap.sh
```

依終端機輸出把 **database_id**、**KV id** 填入 [`workers/auth/wrangler.toml`](../workers/auth/wrangler.toml)。若環境沒有 `npm`，請在本機安裝 Node 後再執行，或改在 Cloudflare Dashboard 手動建立 D1 與 KV 並複製 ID。

## 4. 本機開發

```bash
cd workers/auth
cp .dev.vars.example .dev.vars
# 編輯 .dev.vars 填入 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET 等

npx wrangler d1 migrations apply peachblossom-auth --local
npx wrangler dev
```

預設 `https://localhost:8787`。請在 Google Console 加入對應 redirect URI，並讓 `ALLOWED_ORIGINS` / `ALLOWED_RETURN_PREFIXES` 包含你的前端來源（例如 `http://localhost:3101`）。

## 5. 主站首頁登入（`index.html`）

根目錄 [`index.html`](../index.html) 已內嵌登入列，腳本為 [`js/peachblossom-auth.js`](../js/peachblossom-auth.js)：

- **生產環境**：預設 Auth 基底為 `https://auth.peachspring.cc`；首頁登入使用的 `appId` 為 `peachspring-home`（與 Worker 路由 `/auth/apps/:appId/login` 相容）。
- **本機**：若網址為 `localhost` / `127.0.0.1`，腳本會改連 `http://localhost:8787`（請先 `wrangler dev`）。
- **覆寫**：在載入 `peachblossom-auth.js` **之前** 可設定：  
  `window.PEACHBLOSSOM_AUTH_BASE = 'https://你的-auth-網域';`

請確認 Worker 的 `ALLOWED_ORIGINS` 含 `https://peachspring.cc`（及 `https://www.peachspring.cc` 若使用），`ALLOWED_RETURN_PREFIXES` 含主站網址前綴，否則登入後無法跳回首頁。

## 6. 對外 API（契約）

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/auth/health` | 健康檢查 |
| GET | `/auth/apps/:appId/login?returnTo=...` | 導向 Google；`appId` 僅允許 `[a-z0-9-]` |
| GET | `/auth/google/callback` | OAuth 回呼（僅 Google 與 Worker 互動） |
| GET/POST | `/auth/apps/:appId/logout?returnTo=...` | 全站登出並清除 Cookie |
| GET | `/auth/session` | 目前登入狀態（JSON）；跨網域需 CORS + `credentials` |
| GET | `/auth/me` | 同 `/auth/session` |
| GET | `/auth/apps/:appId/access` | 是否允許使用該 app（例如 `font-admin`） |

Cookie 名稱：`pb_session`（`HttpOnly`、`Secure`（HTTPS）、`SameSite=Lax`）。

## 7. 與 `font-admin` 整合

設定環境變數（見 [`font-admin/.env.example`](../font-admin/.env.example)）：

- `PEACHBLOSSOM_AUTH_URL`：伺服端呼叫 `/auth/apps/font-admin/access`
- `NEXT_PUBLIC_PEACHBLOSSOM_AUTH_URL`：瀏覽器同上基底網址

可選保留 `FONT_ADMIN_KEY` 作為後備驗證。

## 8. 參考

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1](https://developers.cloudflare.com/d1/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

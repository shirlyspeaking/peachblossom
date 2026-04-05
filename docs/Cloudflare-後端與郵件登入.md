# Cloudflare「後端」與郵件登入 — 桃花源實作清單

本文件對應倉庫內桃花源架構（根目錄靜態頁＋各 app 子資料夾，見 [專案架構說明.md](../專案架構說明.md)）。請依序完成；**粗體**為必做，其餘依需求。

---

## 名詞 30 秒版

| 名詞 | 白話 |
|------|------|
| **網域** | 使用者在瀏覽器打的網址，例如 `example.com`。 |
| **DNS / Nameserver** | 告訴全世界「這個網域要連到哪裡」；接到 Cloudflare 後，由 Cloudflare 代管。 |
| **Cloudflare Access** | 在訪客看到你的網頁**之前**先擋下來，要求用**郵件一次性驗證碼（OTP）**登入；**不必**在專案裡寫登入表單。 |
| **Workers** | 在 Cloudflare 邊緣跑的程式；只有當你要**自訂帳號／資料庫／API** 才需要（見本文第五節）。 |

---

## 一、網域接入 Cloudflare（DNS / Nameserver）

**目標：** 讓 Cloudflare 成為你網域的 DNS 管理者，之後才能用 Access 保護網站。

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)，點 **Add a Site**（或 **Websites** → **Add**）。
2. 輸入你的網域（已購買的網域），選免費方案（Free）即可開始 DNS 與多數功能。
3. Cloudflare 會掃描既有 DNS 記錄；檢查 **A / AAAA / CNAME** 是否與你現有主機一致，必要時手動新增或修正。
4. **最關鍵一步：** 到你的**網域註冊商**（買網域的地方），把 **Nameserver** 改成 Cloudflare 顯示的兩組（例如 `xxx.ns.cloudflare.com`）。儲存後，全球生效可能需要數分鐘至 48 小時。
5. 回到 Cloudflare，等狀態變成 **Active**（已啟用）。

**驗收：** `dig NS 你的網域` 或註冊商後台看到 Nameserver 已指向 Cloudflare。

---

## 二、託管選擇：Cloudflare Pages 或維持現有主機

**目標：** 網站檔案要有一個「公開網址」；Access 是加在**流量進入網站的那個網域**上，與檔案放在 GitHub Pages、VPS 或 Cloudflare Pages 皆可搭配。

### 選項 A：網站已經在別處（GitHub Pages、Netlify、自己的伺服器）

- 只要 **DNS 已接到 Cloudflare**（第一節），且 **A / CNAME 記錄** 指向現有主機即可。
- **不必**為了 Access 而搬主機；直接跳到第三節，把 Access 綁在對應的 **hostname**（例如 `www.example.com`）。

### 選項 B：用 Cloudflare Pages 部署本倉庫（靜態桃花源：根目錄 `index.html`、`about.html`、`huadian/` 等）

適合：**整站以倉庫根目錄為靜態輸出**（與 [專案架構說明.md](../專案架構說明.md) 一致）。

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 授權 GitHub 並選 **peachblossom** 倉庫。
3. **建置設定建議（靜態、無打包）：**

   | 欄位 | 建議值 |
   |------|--------|
   | Framework preset | `None` |
   | Build command | *留空*（或 `exit 0`） |
   | Build output directory | `/`（根目錄；若介面不允許單獨 `/`，可試 `.` 依官方說明為準） |
   | Root directory（進階） | `/`（倉庫根目錄） |

4. **Save and Deploy**。完成後 Pages 會給一個 `*.pages.dev` 網址。
5. **自訂網域：** Pages 專案 → **Custom domains** → 新增 `www.example.com` 或 `example.com`；依指示在 **DNS** 加 **CNAME**（通常指向 `你的專案.pages.dev`）。

**注意：** 本倉庫另有 **Next.js** 子專案（如 `lovereading/`、`enjoyread/`、`calligraphy-studio/`、`font-admin/`）。它們需要**各自的**建置指令與輸出目錄，通常做法是：

- **每個 app 一個 Cloudflare Pages 專案**（不同 root directory 或不同 branch），或  
- 部署到其他平台（例如 Vercel），DNS 用 **子網域** 指向（見第四節）。

---

## 三、Zero Trust → Access：建立 Application 與郵件 OTP（一次性驗證碼）

**目標：** 訪客開網站時，必須先輸入**允許清單內的電子郵件**，收信取得 **One-time PIN**，通過後才看得到頁面。

1. Cloudflare Dashboard 左上角搜尋或進入 **Zero Trust**（若首次使用會要求建立 **Team name**，依畫面完成即可）。
2. 左側 **Access** → **Applications** → **Add an application**。
3. 選 **Self-hosted**（自架應用）。
4. **Application name**：例如 `桃花源`（自訂，僅顯示用）。
5. **Session Duration**：可維持預設（例如 24 小時），依安全需求調整。
6. **Application domain**（下一屏或同一屏，依 UI）：
   - **Subdomain**：例如 `www`
   - **Domain**：選你在 Cloudflare 託管的網域 `example.com`
   - **Path**（選填）：若留空代表保護該主機下的**整站**；若只保護花店可填 `/huadian`（細節見第四節）。
7. **Identity providers**：至少啟用 **One-time PIN**（郵件驗證碼）。可依需求再加 Google 等。
8. **Policy**：
   - **Action**：`Allow`
   - **Include** → 新增規則：
     - **Emails**：逐一加入允許的信箱（例如 `you@gmail.com`），**或**
     - **Emails ending in**（Email domain）：例如只允許 `@yourcompany.com`（請勿用過寬的免費信箱網域，除非刻意開放）。
9. 儲存。若有多個 Application，注意 **順序與路徑** 不要互相重疊造成混淆。

**驗收：** 用**無痕視窗**開你的網址 → 應出現 Cloudflare Access 登入頁 → 輸入允許的郵件 → 收 OTP → 進站後可開啟 `index.html` 連結到的各頁。

---

## 四、保護範圍：整域、子路徑或子網域

依「桃花源」目錄，可這樣對應（請把 `example.com` 換成你的網域）：

| 需求 | Access Application 設定思路 |
|------|---------------------------|
| **整站都要登入** | Application domain 設 `www.example.com`（或主網域），**Path 留空**；Policy 只允許你的信箱。 |
| **只鎖「花店」app** | 新增一個 Application：**Path** 設 `/huadian` 或 `/huadian/*`（以當時 Cloudflare UI 為準）；只允許要試用的信箱。公開首頁 `index.html` 仍可走另一個「不設 Access」的 hostname 或路徑策略——若同一 hostname 要「首頁公開、子路徑要登入」，需拆成 **兩個 Application** 或 **一個 Application 多條 Policy**，實務上較常改用 **子網域**（下表）。 |
| **子網域分離** | 例如 `taohua.example.com` → 靜態全站；`huadian.example.com` → 只部署 `huadian` 或反向代理。Access 可只綁在 `huadian.example.com`，則主站入口可維持公開。 |

**實務建議：** 若 UI 對「同網域部分路徑公開、部分需登入」較難調，優先採 **子網域**（例如 `private.example.com`）專放需保護內容，Policy 最單純。

**與本倉庫路徑對照：**

- 桃花源首頁：`/` → `index.html`
- 關於作者：`/about.html`
- 花店入口：`/huadian/huadian.html`

---

## 五、（選用）Workers + 寄信與儲存 — 何時才需要

以下情況再考慮 **Cloudflare Workers**（必要時加 **KV / D1**）：

- 要在網頁裡顯示「歡迎，某某」且帳號資料存在自己的資料庫。
- 要自訂 **Magic link**、**JWT**、付費會員等流程。
- 要保護 **API**（例如 `POST /api/...`）並與前端 Session 整合。

此路線需：**Wrangler CLI**、**第三方寄信**（如 Resend、SendGrid）、以及自行處理安全（Cookie、CSRF、速率限制）。本倉庫未內建該後端；若未來新增，建議獨立 `workers/` 專案並另撰部署說明。

詳見同目錄 [workers-選用說明.md](./workers-選用說明.md)。

---

## 檢查清單（複製自用）

- [ ] 網域 Nameserver 已改為 Cloudflare 且狀態 Active  
- [ ] 網站可透過瀏覽器正常開啟（無論 Pages 或舊主機）  
- [ ] Zero Trust → Access → Application 已建立，One-time PIN 已啟用  
- [ ] Policy 已限制為你的郵件或網域  
- [ ] 無痕視窗驗證：未登入無法看、登入後可看  

---

## 官方參考（英文）

- [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)  
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)  
- [Add site to Cloudflare](https://developers.cloudflare.com/fundamentals/setup/account-setup/add-site/)  

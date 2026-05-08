# EnjoyRead TTS 方法與設定指南

這份文件整理 `enjoyread` 目前實作中的 TTS（語音朗讀）方法、呼叫流程，以及從 0 到可用的設定步驟。

---

## 1) 目前使用的 TTS 方法（雙軌）

EnjoyRead 在閱讀頁採用「**自然人聲優先 + 瀏覽器朗讀備援**」：

1. **自然人聲（伺服器端）**
   - 前端呼叫 `POST /api/tts`
   - 後端在 `app/api/tts/route.ts` 轉呼叫 FreeTTS API
   - 回傳 `audioUrl`，前端用 `new Audio(audioUrl)` 播放

2. **瀏覽器 Web Speech API（前端備援）**
   - 若 FreeTTS 不可用、播放失敗，或 API key 未設定
   - 前端改用 `window.speechSynthesis` + `SpeechSynthesisUtterance` 直接朗讀摘要

---

## 2) 關鍵檔案與職責

- `app/article/page.tsx`
  - TTS 控制邏輯（開始、停止、語速、狀態文字）
  - 自然人聲按鈕：`handleNaturalTtsToggle()`
  - 瀏覽器朗讀：`startBrowserTts()` / `handleTtsToggle()`
  - 句子高亮：`utterance.onboundary`

- `app/api/tts/route.ts`
  - 驗證輸入（`text`、`voice`、`speed`）
  - 限制可用聲線（白名單）
  - 呼叫 FreeTTS，解析 `audioUrl`，回傳給前端
  - 在 key 缺失或上游錯誤時回傳錯誤訊息

- `README.md`
  - 記錄 `FREETTS_API_KEY` 與 TTS 架構說明

---

## 3) 實際執行流程（Runtime Flow）

### A. 點擊「自然人聲」

1. 前端檢查是否已有摘要文字（`summary`）
2. 若瀏覽器朗讀正在播，先 `speechSynthesis.cancel()`
3. 呼叫 `/api/tts`，傳入：
   - `text`: 摘要內容（上限由後端切到 1000 字）
   - `voice`: 使用者選擇聲線（後端白名單驗證）
   - `speed`: 0.5~2 之間（後端夾值）
4. 後端向 FreeTTS 請求音檔
5. 前端取得 `audioUrl` 後播放 `Audio`
6. 播放結束更新狀態；播放失敗則切到瀏覽器朗讀

### B. 點擊「瀏覽器朗讀」

1. 呼叫 `startBrowserTts()`
2. 建立 `SpeechSynthesisUtterance(summary)`
3. 設定：
   - `utterance.lang = "zh-TW"`
   - `utterance.rate = ttsSpeed`
4. 用 `onboundary` 推進目前句子索引，讓摘要文字高亮
5. `onend` 後重置播放狀態與高亮

### C. 自然人聲失敗時的自動降級

下列任一情境會自動 fallback 到瀏覽器朗讀：
- `/api/tts` 回傳非 2xx
- 回傳缺少 `audioUrl`
- `Audio` 播放期間觸發 `onerror`
- `FREETTS_API_KEY` 未設定

---

## 4) 環境變數設定

在 `enjoyread/.env.local` 至少放入：

```env
FREETTS_API_KEY=...
```

可用 `enjoyread/.env.example` 當模板。

> 注意：就算沒有 `FREETTS_API_KEY`，功能仍可用，只是會以瀏覽器朗讀為主。

---

## 5) 從 0 到可用：完整設定步驟

1. 安裝依賴

```bash
cd enjoyread
npm install
```

2. 建立環境變數檔

```bash
cp .env.example .env.local
```

3. 填入 `FREETTS_API_KEY`

```env
FREETTS_API_KEY=...
```

4. 啟動專案

```bash
npm run dev
```

5. 打開文章閱讀頁測試
   - 先點「自然人聲」
   - 再斷網或移除 key 測試 fallback（應自動改成瀏覽器朗讀）

---

## 6) 參數規則（目前實作）

### Voice（聲線）

後端白名單：
- `zh-CN-XiaoxiaoNeural`
- `zh-CN-XiaoyiNeural`
- `zh-CN-YunxiNeural`
- `zh-CN-YunyangNeural`

若傳入不合法，後端會改用預設 `zh-CN-XiaoxiaoNeural`。

### Speed（語速）

- 前端傳 `speed`（通常 0.8 / 1 / 1.2）
- 後端夾值至 `0.5 ~ 2`
- 轉換為 FreeTTS rate 格式（例如 `+20%` / `-20%`）

### Text（朗讀內容）

- 後端會先 normalize 空白，並截斷至前 1000 字

---

## 7) 常見問題排查（Checklist）

1. 點「自然人聲」無聲音
   - 檢查 `.env.local` 是否有 `FREETTS_API_KEY`
   - 看 Network 的 `/api/tts` 回應是否含 `audioUrl`

2. `/api/tts` 失敗
   - 檢查 server log 的錯誤內容
   - 確認 key 是否有效、額度是否可用

3. 自然人聲失敗但應有備援
   - 檢查瀏覽器是否支援 `speechSynthesis`
   - 檢查是否被瀏覽器自動播放政策阻擋（通常需要使用者手勢觸發）

4. 高亮不同步
   - `onboundary` 行為在不同瀏覽器可能有差異，屬 Web Speech API 已知特性

---

## 8) 目前設計重點（為什麼這樣做）

- **穩定性**：外部 TTS 失敗時不讓功能中斷，直接本地 fallback。
- **成本可控**：只在需要時呼叫雲端 TTS，且限制文字長度。
- **體驗一致**：自然人聲與瀏覽器朗讀都共用同一組語速與播放控制。


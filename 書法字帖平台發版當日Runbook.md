# 書法字帖平台發版當日 Runbook

本文件給「發版當天」照單執行，依序完成即可。

---

## 0) 發版前 10 分鐘

- [ ] 通知相關人員進入發版時段
- [ ] 暫停非必要功能變更
- [ ] 確認使用最新版程式碼

```bash
cd "/Users/shirlyzhang/Documents/GitHub/peachblossom"
git status
```

---

## 1) 使用者端（calligraphy-studio）建置驗證

```bash
cd "/Users/shirlyzhang/Documents/GitHub/peachblossom/calligraphy-studio"
npm install
npm run lint
npm run build
```

### 驗收
- [ ] `lint` 通過
- [ ] `build` 通過
- [ ] 無 TypeScript 錯誤

---

## 2) 維運端（font-admin）建置驗證

```bash
cd "/Users/shirlyzhang/Documents/GitHub/peachblossom/font-admin"
npm install
npm run lint
npm run build
```

### 驗收
- [ ] `lint` 通過
- [ ] `build` 通過
- [ ] 管理 API 可啟動

---

## 3) 必備檔案與環境變數檢查

### 3.1 字型檔
- [ ] `calligraphy-studio/public/fonts/NotoSansTC-Regular.ttf`
- [ ] `calligraphy-studio/public/fonts/NotoSerifTC-Regular.otf`
- [ ] `calligraphy-studio/public/fonts/font-manifest.json`

### 3.2 環境變數
- [ ] `OCR_SPACE_API_KEY`（若要 OCR）
- [ ] `FONT_ADMIN_KEY`（管理端保護）

---

## 4) 本機 Smoke Test（最重要）

### 4.1 啟動服務

```bash
# Terminal A
cd "/Users/shirlyzhang/Documents/GitHub/peachblossom/calligraphy-studio"
npm run dev

# Terminal B
cd "/Users/shirlyzhang/Documents/GitHub/peachblossom/font-admin"
export FONT_ADMIN_KEY="your-secure-key"
npm run dev
```

### 4.2 使用者流程驗證（calligraphy-studio）
- [ ] 開啟 `http://localhost:3200/calligraphy`
- [ ] 一鍵帶入示例文本可用
- [ ] 生成預覽後會自動捲動到預覽區
- [ ] 下載 PDF 成功且中文正常顯示

### 4.3 上傳流程驗證
- [ ] 上傳 `.txt` 成功
- [ ] 上傳 `.docx` 成功
- [ ] 上傳圖片成功（有 OCR key）
- [ ] 上傳 PDF 成功（有 OCR key）

### 4.4 維運後台驗證（font-admin）
- [ ] 開啟 `http://localhost:3101`
- [ ] 錯誤金鑰無法通過
- [ ] 正確金鑰可載入資料
- [ ] JSON / CSV 匯出正常
- [ ] 授權狀態欄位顯示正常

---

## 5) 發版前最終確認

- [ ] 桃花源首頁字帖卡片連結正常：`calligraphy-studio/calligraphy`
- [ ] 首頁「管理員維運後台」連結正常：`font-admin/`
- [ ] 行動版（手機寬度）可操作
- [ ] 深色模式可閱讀

---

## 6) 發版後 30 分鐘觀察

- [ ] 抽樣下載 3 份 PDF，確認字型無方塊字
- [ ] 抽樣上傳 docx / txt 各 1 份
- [ ] 檢查維運後台無異常
- [ ] 記錄本次發版時間與結果

---

## 7) 快速故障回應（若出問題）

### 問題：PDF 出現亂碼/方塊字
1. 檢查字型檔是否存在於 `calligraphy-studio/public/fonts`
2. 檢查檔名是否與 `font-manifest.json`、程式設定一致
3. 重新 build 後重啟服務

### 問題：OCR 失效
1. 檢查 `OCR_SPACE_API_KEY` 是否正確
2. 確認上傳格式與檔案大小限制
3. 先改用 txt/docx 流程做臨時替代

### 問題：管理後台無法登入
1. 檢查 `FONT_ADMIN_KEY` 是否有注入
2. 確認前端輸入 key 與環境值一致
3. 重啟 `font-admin` 服務

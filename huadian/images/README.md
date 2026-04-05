# 唐風背景圖資料夾

此資料夾供 **唐風花鈿 AR 試妝** 的「換背景」功能使用，共 **18 張** 唐朝風格圖片。

## 建議主題與檔名

| 檔名 | 主題 |
|------|------|
| 01-longmen.jpg | 洛陽龍門石窟 |
| 02-peony.jpg | 牡丹花 |
| 03-tavern.jpg | 唐朝酒肆 |
| 04-changan.jpg | 長安城 |
| 05-daming.jpg | 大明宮 |
| 06-dunhuang.jpg | 敦煌石窟 |
| 07-jiangnan.jpg | 江南煙雨 |
| 08-garden.jpg | 御花園 |
| 09-changan-night.jpg | 月下長安 |
| 10-clouds.jpg | 仙境雲海 |
| 11-phoenix.jpg | 鳳凰台 |
| 12-palace.jpg | 唐風宮殿 |
| 13-dance.jpg | 唐裝樂舞 |
| 14-tea.jpg | 茶道 |
| 15-poetry.jpg | 唐詩意境 |
| 16-luoyang.jpg | 洛陽城 |
| 17-horse.jpg | 唐馬 |
| 18-street.jpg | 長安街市 |

將對應的圖片放入此資料夾並使用上列檔名，頁面會從中**隨機**選一張作為虛擬背景。若某檔名不存在，該格會略過，不影響其他張的隨機出現。

---

## 花鈿精靈圖（妝樣圖示）

- **檔案**：預設使用本資料夾內的 **`origin huadian.png`**（含空格之檔名亦可；若改名請同步修改 [`huadian-sprites.json`](huadian-sprites.json) 的 `sheet`）。
- **設定**：`huadian-sprites.json` 的 **`cols` / `rows`** 會將整張合圖均分為網格，順序為先左而右、再由上而下，與 [`huadian.html`](../huadian.html) 中 `huadianAssets` 八款一一對應。目前預設為 **4×2**（適用 1920×1080 常見排版）；若你的合圖是橫向一排 8 格，請改為 `"cols": 8, "rows": 1`。
- 若非均分排列，請在 JSON 中加入 **`frames`** 陣列，每項為 `{ "sx", "sy", "sw", "sh" }`（像素裁切區）。

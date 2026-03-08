export interface ArticleCard {
  id: string;
  title: string;
  source: string;
  summary: string;
  publishedAt?: string;
}

export const mockArticles: ArticleCard[] = [
  {
    id: "1",
    title: "氣候變遷下的極地生態：北極熊的生存挑戰",
    source: "科學人",
    summary:
      "隨著北極冰層逐年縮減，北極熊的棲地與獵食模式正在劇烈改變。科學家透過衛星追蹤與野外調查，記錄物種適應與遷徙的軌跡……",
    publishedAt: "2024-03-01",
  },
  {
    id: "2",
    title: "從零開始學程式：中學生也能懂的 Python 入門",
    source: "BBC 中文",
    summary:
      "程式設計不再是工程師的專利。本文以生活化的例子與互動式練習，帶領讀者認識變數、迴圈與函式，開啟邏輯思考的大門……",
    publishedAt: "2024-02-28",
  },
  {
    id: "3",
    title: "閱讀的技藝：如何從一本書裡讀出更多",
    source: "三聯生活週刊",
    summary:
      "閱讀不只是「看完」。從批註、提問到與他人討論，我們可以如何把一本書讀深、讀活？資深編輯與教師分享他們的閱讀方法……",
    publishedAt: "2024-02-25",
  },
];

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  readTime: number; // 分鐘
  category?: string;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "黑洞如何形成？從恆星死亡到時空扭曲",
    summary: "探索宇宙中最神秘的天體——黑洞。從恆星的生命週期到引力坍縮，了解黑洞形成的科學原理。",
    source: "科學人",
    url: "https://example.com/black-hole",
    readTime: 8,
    category: "科學",
  },
  {
    id: "2",
    title: "AI 如何改變我們的學習方式",
    summary: "人工智慧正在重塑教育領域。從個人化學習到智能輔助，看看 AI 如何幫助學生更有效學習。",
    source: "科技新報",
    url: "https://example.com/ai-education",
    readTime: 6,
    category: "科技",
  },
  {
    id: "3",
    title: "鄭和下西洋：明朝的海上絲路",
    summary: "十五世紀初，鄭和率領龐大船隊七次遠航，開創了人類航海史上的壯舉。回顧這段輝煌歷史。",
    source: "國家地理",
    url: "https://example.com/zheng-he",
    readTime: 10,
    category: "歷史",
  },
  {
    id: "4",
    title: "氣候變遷下的極地生態",
    summary: "北極熊、企鵝的棲息地正在消失。了解氣候變遷如何影響極地生態系統，以及我們能做些什麼。",
    source: "環境資訊中心",
    url: "https://example.com/polar-ecology",
    readTime: 7,
    category: "社會",
  },
  {
    id: "5",
    title: "量子電腦：下一代運算革命",
    summary: "量子位元、疊加態、糾纏——這些概念如何讓量子電腦在特定任務上超越傳統電腦？",
    source: "科學人",
    url: "https://example.com/quantum-computer",
    readTime: 9,
    category: "科技",
  },
  {
    id: "6",
    title: "民主制度的起源與演變",
    summary: "從古希臘雅典到現代代議民主，追溯民主思想的發展歷程與當代挑戰。",
    source: "天下雜誌",
    url: "https://example.com/democracy",
    readTime: 12,
    category: "社會",
  },
];

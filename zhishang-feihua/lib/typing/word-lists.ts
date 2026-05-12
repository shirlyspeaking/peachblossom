export type WordListId = "basic" | "idioms" | "nature";

export const WORD_LIST_META: { id: WordListId; label: string }[] = [
  { id: "basic", label: "常用詞" },
  { id: "idioms", label: "成語" },
  { id: "nature", label: "自然科學" },
];

const LISTS: Record<WordListId, string[]> = {
  basic: [
    "春天",
    "閱讀",
    "學習",
    "知識",
    "思考",
    "寫作",
    "朋友",
    "家人",
    "快樂",
    "努力",
    "專心",
    "練習",
    "進步",
    "學校",
    "老師",
    "同學",
    "課本",
    "筆記",
    "問題",
    "答案",
    "故事",
    "詩句",
    "歷史",
    "地理",
    "數學",
    "實驗",
    "觀察",
    "發現",
    "想像",
    "創造",
  ],
  idioms: [
    "溫故知新",
    "循序漸進",
    "專心致志",
    "持之以恆",
    "融會貫通",
    "舉一反三",
    "實事求是",
    "精益求精",
    "鍥而不捨",
    "厚積薄發",
    "開卷有益",
    "博覽群書",
    "學以致用",
    "教學相長",
    "勤能補拙",
    "笨鳥先飛",
    "日積月累",
    "百讀不厭",
    "手不釋卷",
    "廢寢忘食",
  ],
  nature: [
    "光合作用",
    "水循環",
    "地殼變動",
    "四季更迭",
    "生態平衡",
    "物種多樣",
    "氣候變遷",
    "再生能源",
    "大氣層",
    "海洋生態",
    "板塊運動",
    "流星雨",
    "日全食",
    "潮汐現象",
    "珊瑚礁",
    "熱帶雨林",
    "極地冰層",
    "風力發電",
    "太陽能板",
    "碳足跡",
  ],
};

export function getWordList(id: WordListId): string[] {
  return [...LISTS[id]];
}

export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

import type { CardItem, Tile, TileMeta } from '../types/game'

export const STORAGE_KEY = 'shanhaijing-monopoly-v1'
export const BOARD_PRESETS_KEY = 'shanhaijing-monopoly-board-presets-v1'
export const MAX_BOARD_PRESETS_PER_USER = 20
export const DEFAULT_START_MONEY = 1500
export const PASS_GO_BONUS = 200
export const LAND_PRICE = 300
export const APP_ID = 'shanhaijing-monopoly'

export const PLAYER_COLORS = ['#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#9b5de5', '#f57dbc']

export const TILE_META: Record<string, TileMeta> = {
  'tile-start': { icon: '🏁', legend: '起點' },
  'tile-land': { icon: '🏔️', legend: '地塊' },
  'tile-event': { icon: '🎴', legend: '機會/命運' },
  'tile-tax': { icon: '💰', legend: '稅金' },
  'tile-jail': { icon: '🔒', legend: '幽都監' },
  'tile-free': { icon: '🌿', legend: '安全休息' },
  'tile-go-jail': { icon: '⛓️', legend: '誤入禁地' },
}

export const DEFAULT_TILES: Tile[] = [
  { type: 'tile-start', label: '起點', effect: '經過 +200 金幣', owner: null },
  { type: 'tile-land', label: '崑崙墟', effect: '可購買地塊', owner: null },
  { type: 'tile-event', label: '機會', effect: '抽機會卡', owner: null },
  { type: 'tile-land', label: '青丘', effect: '支付過路費', owner: null },
  { type: 'tile-land', label: '玄圃', effect: '可購買地塊', owner: null },
  { type: 'tile-land', label: '扶桑木', effect: '可升級領地', owner: null },
  { type: 'tile-jail', label: '幽都監', effect: '休息一回合', owner: null },
  { type: 'tile-land', label: '流沙國', effect: '支付過路費', owner: null },
  { type: 'tile-event', label: '命運', effect: '抽命運卡', owner: null },
  { type: 'tile-land', label: '無啟國', effect: '可購買地塊', owner: null },
  { type: 'tile-land', label: '羽民國', effect: '支付過路費', owner: null },
  { type: 'tile-tax', label: '祭典費', effect: '支付 150 金幣', owner: null },
  { type: 'tile-land', label: '北冥', effect: '可升級領地', owner: null },
  { type: 'tile-free', label: '神獸集市', effect: '安全休息格', owner: null },
  { type: 'tile-land', label: '不周山', effect: '支付過路費', owner: null },
  { type: 'tile-event', label: '機會', effect: '抽機會卡', owner: null },
  { type: 'tile-land', label: '塗山', effect: '可購買地塊', owner: null },
  { type: 'tile-land', label: '丹穴山', effect: '支付過路費', owner: null },
  { type: 'tile-tax', label: '修繕費', effect: '支付 180 金幣', owner: null },
  { type: 'tile-land', label: '西王母池', effect: '可升級領地', owner: null },
  { type: 'tile-go-jail', label: '誤入禁地', effect: '直接前往幽都監', owner: null },
  { type: 'tile-land', label: '鐘山', effect: '支付過路費', owner: null },
  { type: 'tile-event', label: '命運', effect: '抽命運卡', owner: null },
  { type: 'tile-land', label: '東海', effect: '可購買地塊', owner: null },
]

export const DEFAULT_CHANCE: CardItem[] = [
  { title: '白澤指路', content: '前進到最近的機會格並再抽一張。' },
  { title: '獲得靈草', content: '領取 150 金幣。' },
  { title: '畢方來襲', content: '支付 100 金幣修復領地。' },
  { title: '玄龜庇佑', content: '本回合免租一次。' },
  { title: '夸父助跑', content: '再前進 3 格。' },
  { title: '青鳥傳信', content: '指定一位玩家與你交換位置。' },
]

export const DEFAULT_FATE: CardItem[] = [
  { title: '天命加持', content: '所有玩家各支付你 50 金幣。' },
  { title: '迷霧封路', content: '後退 2 格。' },
  { title: '共工怒觸', content: '立刻前往起點，不領獎勵。' },
  { title: '女媧補天', content: '支付 120 金幣，下一輪可擲兩次。' },
  { title: '燭龍睜眼', content: '可任選前進 1~6 格。' },
  { title: '饕餮盛宴', content: '支付 200 金幣給銀行。' },
]

export const POSITIONS = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  [7, 7],
  [7, 6],
  [7, 5],
  [7, 4],
  [7, 3],
  [7, 2],
  [7, 1],
  [6, 1],
  [5, 1],
  [4, 1],
  [3, 1],
  [2, 1],
] as const

export const DEFAULT_RULES_TEXT =
  '玩家輪流擲骰前進，經過起點可領取獎勵金幣。\n' +
  '停在地塊可依你自訂文本執行效果（買地、收租、事件等）。\n' +
  '停在「機會」或「命運」格時，抽對應卡片並執行卡面內容。\n' +
  '此版為可編輯雛形，可先設計內容與規則文本，所有改動自動儲存。'

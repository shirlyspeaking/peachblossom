import type { CardItem, Tile, TileMeta } from '../types/game'

export const STORAGE_KEY = 'shanhaijing-monopoly-3d-v1'
export const DEFAULT_START_MONEY = 1500
export const PASS_GO_BONUS = 200
export const LAND_PRICE = 300
export const DEFAULT_TOLL_FEE = 120

export const PLAYER_COLORS = ['#d94f68', '#4f83d9', '#2f9a7c', '#d8a33b', '#8f65d8', '#db79b6']
export const PLAYER_ANIMALS = ['虎', '狐', '熊', '蛙', '麟', '鵬']

export const TILE_META: Record<string, TileMeta> = {
  'tile-start': { icon: '起', legend: '起點', color: '#e6b2d6', elevation: 0.48 },
  'tile-land': { icon: '境', legend: '秘境', color: '#9ec48b', elevation: 0.36 },
  'tile-event': { icon: '籤', legend: '機會/命運', color: '#d7b75e', elevation: 0.42 },
  'tile-tax': { icon: '貢', legend: '貢金', color: '#d79068', elevation: 0.34 },
  'tile-jail': { icon: '幽', legend: '幽都監', color: '#8a7aae', elevation: 0.5 },
  'tile-free': { icon: '息', legend: '休息', color: '#78bba0', elevation: 0.32 },
  'tile-go-jail': { icon: '禁', legend: '禁地', color: '#aa6172', elevation: 0.52 },
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

export const BOARD_POINTS = [
  [-4.5, -4.5],
  [-3, -4.5],
  [-1.5, -4.5],
  [0, -4.5],
  [1.5, -4.5],
  [3, -4.5],
  [4.5, -4.5],
  [4.5, -3],
  [4.5, -1.5],
  [4.5, 0],
  [4.5, 1.5],
  [4.5, 3],
  [4.5, 4.5],
  [3, 4.5],
  [1.5, 4.5],
  [0, 4.5],
  [-1.5, 4.5],
  [-3, 4.5],
  [-4.5, 4.5],
  [-4.5, 3],
  [-4.5, 1.5],
  [-4.5, 0],
  [-4.5, -1.5],
  [-4.5, -3],
] as const

export const DEFAULT_RULES_TEXT =
  '玩家輪流擲骰前進，經過起點可領取獎勵金幣。\n' +
  '停在秘境可依格子效果購買或支付過路費。\n' +
  '停在「機會」或「命運」格時，抽對應卡片並執行卡面內容。'

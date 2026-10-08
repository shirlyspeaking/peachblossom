import type { FlowerColor, SpeciesId } from '../types'

export interface FlowerSpec {
  id: SpeciesId
  labelZh: string
  group: 'flower' | 'foliage'
  colors: FlowerColor[]
}

export const FLOWERS: FlowerSpec[] = [
  {
    id: 'peony',
    labelZh: '牡丹',
    group: 'flower',
    colors: [
      { id: 'yaohuang', labelZh: '姚黃', hex: '#f3d56a' },
      { id: 'weizi', labelZh: '魏紫', hex: '#6d3b78' },
      { id: 'zhaofen', labelZh: '趙粉', hex: '#f0c3cf' },
    ],
  },
  {
    id: 'lotus',
    labelZh: '荷花',
    group: 'flower',
    colors: [
      { id: 'bailian', labelZh: '白蓮', hex: '#f7f4ee' },
      { id: 'honglian', labelZh: '紅蓮', hex: '#c23b45' },
      { id: 'fenhe', labelZh: '粉荷', hex: '#e7a3b5' },
    ],
  },
  {
    id: 'plum',
    labelZh: '梅花',
    group: 'flower',
    colors: [
      { id: 'gongfen', labelZh: '宮粉', hex: '#f3c3d0' },
      { id: 'zhusha', labelZh: '硃砂', hex: '#c4383a' },
      { id: 'lve', labelZh: '綠萼', hex: '#e7f0e4' },
    ],
  },
  {
    id: 'magnolia',
    labelZh: '玉蘭',
    group: 'flower',
    colors: [
      { id: 'bai', labelZh: '白玉蘭', hex: '#fbf8f2' },
      { id: 'zi', labelZh: '紫玉蘭', hex: '#8d4d86' },
      { id: 'erqiao', labelZh: '二喬', hex: '#d7b4c8' },
    ],
  },
  {
    id: 'chrysanthemum',
    labelZh: '菊花',
    group: 'flower',
    colors: [
      { id: 'huang', labelZh: '黃菊', hex: '#e2b143' },
      { id: 'bai', labelZh: '白菊', hex: '#f6f3ea' },
      { id: 'zi', labelZh: '紫菊', hex: '#7a4e93' },
    ],
  },
  {
    id: 'orchid',
    labelZh: '蘭花',
    group: 'flower',
    colors: [
      { id: 'suxin', labelZh: '素心', hex: '#e7ecd4' },
      { id: 'chunlan', labelZh: '春蘭', hex: '#c5d2a4' },
      { id: 'molan', labelZh: '墨蘭', hex: '#4e342e' },
    ],
  },
  {
    id: 'narcissus',
    labelZh: '水仙',
    group: 'flower',
    colors: [
      { id: 'bai', labelZh: '白水仙', hex: '#f7f6f1' },
      { id: 'huangxin', labelZh: '黃心', hex: '#f0d56a' },
      { id: 'chongban', labelZh: '重瓣', hex: '#fffaf3' },
    ],
  },
  {
    id: 'camellia',
    labelZh: '山茶',
    group: 'flower',
    colors: [
      { id: 'hong', labelZh: '紅山茶', hex: '#c0392b' },
      { id: 'bai', labelZh: '白山茶', hex: '#f8f6f2' },
      { id: 'fen', labelZh: '粉山茶', hex: '#f0b7c4' },
    ],
  },
  {
    id: 'crabapple',
    labelZh: '海棠',
    group: 'flower',
    colors: [
      { id: 'xifu', labelZh: '西府', hex: '#e7a0b4' },
      { id: 'chuisi', labelZh: '垂絲', hex: '#d46a8a' },
      { id: 'bai', labelZh: '白海棠', hex: '#f6f3ee' },
    ],
  },
  {
    id: 'peach',
    labelZh: '桃花',
    group: 'flower',
    colors: [
      { id: 'fen', labelZh: '粉桃', hex: '#f3b7c6' },
      { id: 'bai', labelZh: '白桃', hex: '#fbf7f4' },
      { id: 'fei', labelZh: '緋桃', hex: '#c4475a' },
    ],
  },
  {
    id: 'bamboo',
    labelZh: '竹',
    group: 'foliage',
    colors: [{ id: 'natural', labelZh: '本色', hex: '#7d9a62' }],
  },
  {
    id: 'willow',
    labelZh: '柳',
    group: 'foliage',
    colors: [{ id: 'natural', labelZh: '本色', hex: '#8aa56a' }],
  },
  {
    id: 'pine',
    labelZh: '松',
    group: 'foliage',
    colors: [{ id: 'natural', labelZh: '本色', hex: '#3f5c45' }],
  },
  {
    id: 'banana',
    labelZh: '蕉葉',
    group: 'foliage',
    colors: [{ id: 'natural', labelZh: '本色', hex: '#6e8f4e' }],
  },
]

export function getFlower(id: SpeciesId): FlowerSpec {
  return FLOWERS.find((f) => f.id === id) ?? FLOWERS[0]
}

export function flowerColors(id: SpeciesId): FlowerColor[] {
  return getFlower(id).colors
}

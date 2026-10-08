import type { VaseId } from '../types'

export interface VaseSpec {
  id: VaseId
  painting: string
  name: string
  note: string
  /**
   * Mouth, as a fraction of the cut-out image.
   * x grows right, y grows down. New stems are rooted here.
   */
  mouthX: number
  mouthY: number
}

export const VASES: VaseSpec[] = [
  {
    id: 'jurui-xianwen',
    painting: '郎世寧《聚瑞圖》',
    name: '青瓷弦紋瓶',
    note: '洗口細頸，頸腹起弦，圈足有繫孔。雍正元年畫中的那一只。',
    mouthX: 0.5,
    mouthY: 0.1,
  },
  {
    id: 'pinghua-zhefang',
    painting: '郎世寧《畫瓶花》',
    name: '青花折方瓶',
    note: '圓口長頸，方腹，肩飾龍首雙耳，近明宣德牽牛花折方瓶。',
    mouthX: 0.5,
    mouthY: 0.1,
  },
  {
    id: 'suichao-fanggu',
    painting: '傳邊文進《歲朝圖》',
    name: '仿古方觚',
    note: '撇口長頸，腹出戟，飾雷紋、蕉葉紋與雲紋。',
    mouthX: 0.5,
    mouthY: 0.1,
  },
  {
    id: 'lisong-hualan',
    painting: '李嵩《花籃》',
    name: '提梁籐籃',
    note: '宋代籃花。提梁下的籃口才是插花處。',
    mouthX: 0.5,
    mouthY: 0.52,
  },
]

export function getVase(id: VaseId): VaseSpec {
  return VASES.find((v) => v.id === id) ?? VASES[0]
}

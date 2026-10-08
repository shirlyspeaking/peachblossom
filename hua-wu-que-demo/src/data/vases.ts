import type { VaseId } from '../types'

export interface VaseSpec {
  id: VaseId
  painting: string
  name: string
  note: string
  /**
   * Opening, as a fraction of the cut-out image.
   * x grows right, y grows down. Foreground blooms are cut off below this line
   * so the stem cannot sit on the lip.
   */
  mouthX: number
  mouthY: number
  /** Cut end of a new stem, inside the body rather than on the lip. */
  rootY: number
}

export const VASES: VaseSpec[] = [
  {
    id: 'jurui-xianwen',
    painting: '郎世寧《聚瑞圖》',
    name: '青瓷弦紋瓶',
    note: '洗口細頸，頸腹起弦，圈足有繫孔。雍正元年畫中的那一只。',
    mouthX: 0.5,
    mouthY: 0.1,
    rootY: 0.32,
  },
  {
    id: 'pinghua-zhefang',
    painting: '郎世寧《畫瓶花》',
    name: '青花折方瓶',
    note: '圓口長頸，方腹，肩飾龍首雙耳，近明宣德牽牛花折方瓶。',
    mouthX: 0.5,
    mouthY: 0.09,
    rootY: 0.32,
  },
  {
    id: 'suichao-fanggu',
    painting: '傳邊文進《歲朝圖》',
    name: '仿古方觚',
    note: '撇口長頸，腹出戟，飾雷紋、蕉葉紋與雲紋。',
    mouthX: 0.5,
    mouthY: 0.22,
    rootY: 0.44,
  },
  {
    id: 'lisong-hualan',
    painting: '李嵩《花籃》',
    name: '提梁籐籃',
    note: '宋代籃花。提梁下的籃口才是插花處。',
    mouthX: 0.5,
    mouthY: 0.54,
    rootY: 0.74,
  },
  {
    id: 'taibai-jiangdou',
    painting: '清康熙官窯',
    name: '豇豆紅太白尊',
    note: '短頸幾乎貼肩，蘋果圓腹，釉裡苔點。',
    mouthX: 0.5,
    mouthY: 0.09,
    rootY: 0.3,
  },
  {
    id: 'danping-fencai',
    painting: '清粉彩',
    name: '牡丹膽瓶',
    note: '長頸、圓腹，腹繪牡丹。',
    mouthX: 0.5,
    mouthY: 0.1,
    rootY: 0.32,
  },
  {
    id: 'yuhuchun-wucai',
    painting: '明五彩',
    name: '玉壺春',
    note: '撇口、中頸、垂腹，紅黃藍綠同器。',
    mouthX: 0.5,
    mouthY: 0.2,
    rootY: 0.4,
  },
  {
    id: 'tianqiu-doucai',
    painting: '清鬥彩',
    name: '天球瓶',
    note: '直頸、大圓腹，腹繪折枝花。',
    mouthX: 0.5,
    mouthY: 0.14,
    rootY: 0.34,
  },
]

export function getVase(id: VaseId): VaseSpec {
  return VASES.find((v) => v.id === id) ?? VASES[0]
}

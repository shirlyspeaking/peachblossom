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
    id: 'danping-qiuhui',
    painting: '南宋佚名《膽瓶秋卉圖》',
    name: '藍釉長頸膽瓶',
    note: '北京故宮藏。長頸折沿，下有護瓶架。畫中原插秋菊，此處留空。',
    mouthX: 0.5,
    mouthY: 0.08,
    rootY: 0.28,
  },
  {
    id: 'lisong-hualan',
    painting: '南宋李嵩《花籃圖》',
    name: '提梁花籃',
    note: '臺北故宮冬花一幀為籐籃。提梁下的籃口才是插花處。',
    mouthX: 0.5,
    mouthY: 0.54,
    rootY: 0.74,
  },
  {
    id: 'wenhui-xiaoping',
    painting: '北宋《文會圖》',
    name: '小瓶承盤',
    note: '臺北故宮藏，畫院之作。案上小瓶坐在寬沿承盤裡。',
    mouthX: 0.5,
    mouthY: 0.08,
    rootY: 0.28,
  },
  {
    id: 'tingqin-guding',
    painting: '宋《聽琴圖》',
    name: '古銅鼎',
    note: '宣和畫院之作。平口、雙耳、三足，畫中用來插花。',
    mouthX: 0.5,
    mouthY: 0.24,
    rootY: 0.44,
  },
  {
    id: 'songren-huabo',
    painting: '宋無款《人物》',
    name: '金釦花缽',
    note: '臺北故宮藏。敞口、金釦、帶耳，院方說似玻璃器。',
    mouthX: 0.5,
    mouthY: 0.16,
    rootY: 0.36,
  },
  {
    id: 'yaoshan-pingmei',
    painting: '南宋馬公顯《藥山李翱問答圖》',
    name: '案上青瓷瓶',
    note: '京都南禪寺藏。石桌上的小青瓷瓶，畫中用來插一枝梅。',
    mouthX: 0.5,
    mouthY: 0.08,
    rootY: 0.28,
  },
  {
    id: 'luohan-liujiao',
    painting: '南宋《五百羅漢圖》',
    name: '六角銅瓶',
    note: '京都大德寺藏，淳熙年間。採蓮一鋪裡的銅瓶，唇口、六角、撇足。',
    mouthX: 0.5,
    mouthY: 0.08,
    rootY: 0.28,
  },
  {
    id: 'xiaojing-pan',
    painting: '傳李公麟《孝經圖》',
    name: '多曲盤',
    note: '大都會藏。撇足多曲盤，花從盤心插起。',
    mouthX: 0.5,
    mouthY: 0.14,
    rootY: 0.32,
  },
]

export function getVase(id: VaseId): VaseSpec {
  return VASES.find((v) => v.id === id) ?? VASES[0]
}

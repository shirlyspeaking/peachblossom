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
]

export function getVase(id: VaseId): VaseSpec {
  return VASES.find((v) => v.id === id) ?? VASES[0]
}

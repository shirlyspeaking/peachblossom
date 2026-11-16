import type { RoomId } from '../types'

export interface RoomSpec {
  id: RoomId
  label: string
  note: string
}

export const ROOMS: RoomSpec[] = [
  {
    id: 'shufang',
    label: '書齋疏影',
    note: '紙屏上有疏影，案頭留白，可置一瓶。',
  },
  {
    id: 'tea',
    label: '茶寮靜照',
    note: '竹簾與茶煙，席前空出瓶位。',
  },
  {
    id: 'window',
    label: '窗影留白',
    note: '檻窗竹影，滿地光格。',
  },
  {
    id: 'garden',
    label: '園林煙水',
    note: '月洞白牆，石台臨池。',
  },
  {
    id: 'palace',
    label: '宮廷雅室',
    note: '殿柱與遠屏，地心空闊。',
  },
  {
    id: 'song-shufang',
    label: '宋人書齋',
    note: '取宋無款《人物》的榻、屏風和紙窗。中間留空。',
  },
  {
    id: 'song-tingqin',
    label: '松下聽琴',
    note: '取《聽琴圖》的松、竹和湖石。中間留空。',
  },
  {
    id: 'song-wenhui',
    label: '池畔文會',
    note: '取《文會圖》的池邊黑漆方桌。桌上不放花瓶。',
  },
]

export function getRoom(id: RoomId): RoomSpec {
  return ROOMS.find((room) => room.id === id) ?? ROOMS[0]
}

import type { ContainerKind, RoomId, SpeciesId } from '../types'

/** Public dir files are emitted under build `base` (e.g. `/hua-wu-que/` on peachspring.cc). */
function publicAsset(pathFromPublicRoot: string): string {
  const base = import.meta.env.BASE_URL
  const rel = pathFromPublicRoot.startsWith('/')
    ? pathFromPublicRoot.slice(1)
    : pathFromPublicRoot
  return `${base}${rel}`
}

const vaseRel: Record<ContainerKind, string> = {
  /** 對應簡報占位：`assets/vases/vase_1.png` */
  ping: 'assets/vases/vase_1.png',
  lan: 'assets/vases/vase_lan.png',
  pan: 'assets/vases/vase_pan.png',
}

const roomRel: Record<RoomId, string> = {
  shufang: 'assets/rooms/shufang.png',
  tea: 'assets/rooms/tea_room.png',
  window: 'assets/rooms/window_shadow.png',
}

/** PNG per species + color id, e.g. peony_zhusha.png */
export function flowerImagePath(species: SpeciesId, colorId: string): string {
  return publicAsset(`assets/flowers/${species}_${colorId}.png`)
}

export function vaseImagePath(kind: ContainerKind): string {
  return publicAsset(vaseRel[kind])
}

export function roomImagePath(room: RoomId): string {
  return publicAsset(roomRel[room])
}

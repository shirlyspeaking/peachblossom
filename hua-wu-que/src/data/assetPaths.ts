import type { ContainerKind, RoomId, SpeciesId } from '../types'

const vaseFiles: Record<ContainerKind, string> = {
  /** Brief sample: `/assets/vases/vase_1.png` */
  ping: '/assets/vases/vase_1.png',
  lan: '/assets/vases/vase_lan.png',
  pan: '/assets/vases/vase_pan.png',
}

const roomFiles: Record<RoomId, string> = {
  shufang: '/assets/rooms/shufang.png',
  tea: '/assets/rooms/tea_room.png',
  window: '/assets/rooms/window_shadow.png',
}

/** PNG per species + color id, e.g. peony_zhusha.png */
export function flowerImagePath(species: SpeciesId, colorId: string): string {
  return `/assets/flowers/${species}_${colorId}.png`
}

export function vaseImagePath(kind: ContainerKind): string {
  return vaseFiles[kind]
}

export function roomImagePath(room: RoomId): string {
  return roomFiles[room]
}

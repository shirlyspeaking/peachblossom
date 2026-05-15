export type ContainerKind = 'ping' | 'lan' | 'pan'

export type RoomId = 'shufang' | 'tea' | 'window'

export type SpeciesId = 'peony' | 'lotus' | 'plum' | 'magnolia'

export interface TraditionalColor {
  id: string
  labelZh: string
  labelEn: string
  /** Reference hex (see zhongguose / Chinese traditional palette) */
  hex: string
}

export interface PlacedFlower {
  id: string
  species: SpeciesId
  colorId: string
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
}

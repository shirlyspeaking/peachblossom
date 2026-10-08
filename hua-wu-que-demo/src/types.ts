export type VaseId =
  | 'jurui-xianwen'
  | 'pinghua-zhefang'
  | 'suichao-fanggu'
  | 'lisong-hualan'

export type RoomId = 'shufang' | 'tea' | 'window'

export type SpeciesId =
  | 'peony'
  | 'lotus'
  | 'plum'
  | 'magnolia'
  | 'chrysanthemum'
  | 'orchid'
  | 'narcissus'
  | 'camellia'
  | 'crabapple'
  | 'peach'
  | 'bamboo'
  | 'willow'
  | 'pine'
  | 'banana'

export interface FlowerColor {
  id: string
  labelZh: string
  /** Swatch only. The canvas uses a separate photograph per color. */
  hex: string
}

export interface PlacedFlower {
  id: string
  species: SpeciesId
  colorId: string
  /** Percent of the canvas width. The point is the cut end of the stem. */
  x: number
  /** Percent of the canvas height. */
  y: number
  rotation: number
  scale: number
  zIndex: number
}

export interface MouthPoint {
  x: number
  y: number
}

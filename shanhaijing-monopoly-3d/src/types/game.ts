export type TileType =
  | 'tile-start'
  | 'tile-land'
  | 'tile-event'
  | 'tile-tax'
  | 'tile-jail'
  | 'tile-free'
  | 'tile-go-jail'

export interface TileMeta {
  icon: string
  legend: string
  color: string
  elevation: number
}

export interface Tile {
  type: TileType
  label: string
  effect: string
  owner: number | null
}

export interface CardItem {
  title: string
  content: string
}

export interface PlayerState {
  id: number
  money: number
  position: number
}

export interface GameSession {
  playerCount: number
  players: PlayerState[]
  currentPlayerIndex: number
  turnLog: string[]
}

export interface GameState {
  tiles: Tile[]
  chance: CardItem[]
  fate: CardItem[]
  rulesText: string
  game: GameSession
}

export interface SceneTile extends Tile {
  index: number
  x: number
  z: number
  meta: TileMeta
}

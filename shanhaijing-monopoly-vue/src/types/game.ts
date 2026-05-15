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
  name: string
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
  /** 套用棋盤收藏後為 true，主棋盤格不可編輯（重設預設會清除） */
  boardGridLocked?: boolean
}

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  picture?: string | null
}

export interface SessionResponse {
  authenticated?: boolean
  user?: AuthUser | null
}

export interface RoomMember {
  userId: string
  playerIndex: number
  name: string | null
  email: string
  picture: string | null
}

export interface OnlineMeta {
  hostUserId: string
  members: RoomMember[]
}

export interface ServerSnapshot {
  hostUserId: string
  members: RoomMember[]
  tiles: Tile[]
  chance: CardItem[]
  fate: CardItem[]
  rulesText: string
  game: GameSession
  boardGridLocked?: boolean
}

export interface RoomPayload {
  ok?: boolean
  error?: string
  roomCode?: string
  version?: number
  serverVersion?: number
  snapshot?: ServerSnapshot
}

export interface BoardPreset {
  id: string
  name: string
  savedAt: number
  tiles: Tile[]
  chance: CardItem[]
  fate: CardItem[]
  rulesText: string
}

export interface BoardPresetRoot {
  byUser: Record<string, BoardPreset[]>
}

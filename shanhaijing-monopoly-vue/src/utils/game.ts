import {
  DEFAULT_CHANCE,
  DEFAULT_FATE,
  DEFAULT_PLAYER_COUNT,
  DEFAULT_RULES_TEXT,
  DEFAULT_START_MONEY,
  DEFAULT_TOLL_FEE,
  PLAYER_ANIMALS,
  DEFAULT_TILES,
  PASS_GO_BONUS,
  POSITIONS,
} from '../config/game'
import type { BoardPresetRoot, CardItem, GameSession, GameState, RoomMember, Tile } from '../types/game'

export const NUM_TILES = POSITIONS.length

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function getAuthBase() {
  const overridden = (window as Window & { PEACHBLOSSOM_AUTH_BASE?: string }).PEACHBLOSSOM_AUTH_BASE
  if (typeof overridden === 'string' && overridden.trim()) {
    return overridden.replace(/\/$/, '')
  }
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8787'
  }
  return 'https://auth.peachspring.cc'
}

export function roomsBaseUrl() {
  return `${getAuthBase()}/auth/apps/shanhaijing-monopoly/rooms`
}

export function buildDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `玩家 ${index + 1}`,
    money: DEFAULT_START_MONEY,
    position: 0,
  }))
}

export function initialTurnLogLine() {
  return `歡迎來到桃源萬象大富翁。可調整人數，每位玩家起始 ${DEFAULT_START_MONEY} 金幣；擲骰後沿外圈棋盤前進，經過起點可獲得 ${PASS_GO_BONUS} 金幣。`
}

export function defaultGame(): GameSession {
  const playerCount = DEFAULT_PLAYER_COUNT
  return {
    playerCount,
    players: buildDefaultPlayers(playerCount),
    currentPlayerIndex: 0,
    turnLog: [initialTurnLogLine()],
  }
}

export function defaultState(): GameState {
  return {
    tiles: deepClone(DEFAULT_TILES),
    chance: deepClone(DEFAULT_CHANCE),
    fate: deepClone(DEFAULT_FATE),
    rulesText: DEFAULT_RULES_TEXT,
    game: defaultGame(),
    boardGridLocked: false,
  }
}

export function normalizeTiles(rawTiles: Partial<Tile>[] = []) {
  return DEFAULT_TILES.map((tile, index) => {
    const merged = { ...tile, ...(rawTiles[index] ?? {}) }
    const rawOwner = (rawTiles[index] as { owner?: unknown } | undefined)?.owner ?? merged.owner
    const owner =
      rawOwner === '' || rawOwner === undefined || rawOwner === null
        ? null
        : Number.parseInt(String(rawOwner), 10)

    return {
      ...tile,
      ...merged,
      owner: Number.isNaN(owner) ? null : owner,
    }
  })
}

export function normalizeCards(rawCards: unknown, fallback: CardItem[]) {
  if (!Array.isArray(rawCards)) {
    return deepClone(fallback)
  }

  return rawCards.map((item) => ({
    title: typeof item?.title === 'string' ? item.title : '',
    content: typeof item?.content === 'string' ? item.content : '',
  }))
}

export function normalizeState(raw: Partial<GameState> | null | undefined): GameState {
  if (!raw || typeof raw !== 'object') {
    return defaultState()
  }

  const game = raw.game && typeof raw.game === 'object' ? raw.game : defaultGame()
  let playerCount = Number.parseInt(String(game.playerCount ?? DEFAULT_PLAYER_COUNT), 10)
  if (Number.isNaN(playerCount) || playerCount < 2 || playerCount > 6) {
    playerCount = DEFAULT_PLAYER_COUNT
  }

  const players = Array.isArray(game.players) && game.players.length === playerCount
    ? game.players.map((player, index) => ({
        id: index,
        name:
          typeof player?.name === 'string' && player.name.trim()
            ? player.name.trim().slice(0, 20)
            : `玩家 ${index + 1}`,
        money:
          typeof player?.money === 'number' && player.money >= 0
            ? Math.floor(player.money)
            : DEFAULT_START_MONEY,
        position:
          typeof player?.position === 'number'
            ? ((player.position % NUM_TILES) + NUM_TILES) % NUM_TILES
            : 0,
      }))
    : buildDefaultPlayers(playerCount)

  let currentPlayerIndex = Number.parseInt(String(game.currentPlayerIndex ?? 0), 10)
  if (Number.isNaN(currentPlayerIndex)) {
    currentPlayerIndex = 0
  }

  return {
    tiles: normalizeTiles(raw.tiles),
    chance: normalizeCards(raw.chance, DEFAULT_CHANCE),
    fate: normalizeCards(raw.fate, DEFAULT_FATE),
    rulesText: typeof raw.rulesText === 'string' ? raw.rulesText : DEFAULT_RULES_TEXT,
    boardGridLocked: raw.boardGridLocked === true,
    game: {
      playerCount,
      players,
      currentPlayerIndex: ((currentPlayerIndex % playerCount) + playerCount) % playerCount,
      turnLog: Array.isArray(game.turnLog) && game.turnLog.length
        ? game.turnLog.map((line) => String(line))
        : defaultGame().turnLog.slice(),
    },
  }
}

export function readBoardPresetsRoot(raw: string | null): BoardPresetRoot {
  if (!raw) {
    return { byUser: {} }
  }

  try {
    const parsed = JSON.parse(raw) as BoardPresetRoot
    if (!parsed || typeof parsed !== 'object' || !parsed.byUser) {
      return { byUser: {} }
    }
    return parsed
  } catch {
    return { byUser: {} }
  }
}

export function themeGradientForTileLabel(label: string) {
  const rules: Array<[RegExp, string]> = [
    [/東海|瀛洲|波|濤|水府/, 'linear-gradient(145deg, oklch(0.93 0.09 215) 0%, oklch(0.72 0.17 235) 48%, oklch(0.86 0.12 225) 100%)'],
    [/青丘|青松|翠|竹|林|木神/, 'linear-gradient(145deg, oklch(0.94 0.1 155) 0%, oklch(0.74 0.19 158) 45%, oklch(0.88 0.14 162) 100%)'],
    [/崑崙|流沙|漠|黃沙|丘墟/, 'linear-gradient(145deg, oklch(0.96 0.08 75) 0%, oklch(0.8 0.16 68) 50%, oklch(0.92 0.11 72) 100%)'],
    [/北冥|冥|寒冰|深淵/, 'linear-gradient(145deg, oklch(0.92 0.08 245) 0%, oklch(0.68 0.15 255) 48%, oklch(0.84 0.11 250) 100%)'],
    [/扶桑|若木|日|曦|霞/, 'linear-gradient(145deg, oklch(0.95 0.09 45) 0%, oklch(0.76 0.19 35) 45%, oklch(0.9 0.13 40) 100%)'],
    [/鐘山|不周|嶽|崖|峰/, 'linear-gradient(145deg, oklch(0.93 0.07 130) 0%, oklch(0.72 0.14 145) 52%, oklch(0.86 0.1 138) 100%)'],
    [/幽都|監|獄|煞/, 'linear-gradient(145deg, oklch(0.91 0.07 290) 0%, oklch(0.66 0.16 285) 48%, oklch(0.82 0.1 292) 100%)'],
    [/西王母|瑤池|池|蓮/, 'linear-gradient(145deg, oklch(0.95 0.09 350) 0%, oklch(0.76 0.17 340) 48%, oklch(0.9 0.12 345) 100%)'],
    [/玄圃|圃|園/, 'linear-gradient(145deg, oklch(0.94 0.1 148) 0%, oklch(0.75 0.18 155) 45%, oklch(0.89 0.13 152) 100%)'],
    [/塗山|禹|石/, 'linear-gradient(145deg, oklch(0.94 0.06 65) 0%, oklch(0.76 0.13 58) 50%, oklch(0.9 0.09 62) 100%)'],
    [/丹穴|丹|赤|朱/, 'linear-gradient(145deg, oklch(0.94 0.1 30) 0%, oklch(0.72 0.2 25) 48%, oklch(0.88 0.14 28) 100%)'],
    [/羽民|翼|翔/, 'linear-gradient(145deg, oklch(0.93 0.09 205) 0%, oklch(0.72 0.16 220) 50%, oklch(0.86 0.12 212) 100%)'],
    [/無啟|民國|國/, 'linear-gradient(145deg, oklch(0.94 0.08 295) 0%, oklch(0.74 0.15 288) 48%, oklch(0.88 0.11 292) 100%)'],
    [/祭典|修繕|稅|費/, 'linear-gradient(145deg, oklch(0.97 0.1 90) 0%, oklch(0.82 0.18 82) 50%, oklch(0.93 0.13 86) 100%)'],
    [/神獸|集市|市/, 'linear-gradient(145deg, oklch(0.97 0.09 85) 0%, oklch(0.8 0.17 78) 48%, oklch(0.92 0.12 82) 100%)'],
    [/起點|歸/, 'linear-gradient(145deg, oklch(0.95 0.1 330) 0%, oklch(0.76 0.18 320) 45%, oklch(0.9 0.13 325) 100%)'],
    [/機會/, 'linear-gradient(145deg, oklch(0.95 0.1 350) 0%, oklch(0.74 0.2 345) 48%, oklch(0.9 0.14 348) 100%)'],
    [/命運/, 'linear-gradient(145deg, oklch(0.93 0.09 285) 0%, oklch(0.7 0.18 280) 48%, oklch(0.86 0.12 288) 100%)'],
  ]

  return rules.find(([pattern]) => pattern.test(String(label)))?.[1] ?? ''
}

export function isChanceTile(tile: Tile) {
  return (
    tile.type === 'tile-event' &&
    (String(tile.label).includes('機會') || String(tile.effect || '').includes('機會'))
  )
}

export function isFateTile(tile: Tile) {
  return (
    tile.type === 'tile-event' &&
    (String(tile.label).includes('命運') || String(tile.effect || '').includes('命運'))
  )
}

export function isPurchasableLandTile(tile: Tile) {
  return String(tile.effect || '').includes('可購買地塊')
}

export function getTileTollFee(tile: Tile) {
  const matched = String(tile.effect || '').match(/(\d+)\s*金幣/)
  if (!matched?.[1]) {
    return DEFAULT_TOLL_FEE
  }

  const fee = Number.parseInt(matched[1], 10)
  return Number.isFinite(fee) && fee > 0 ? fee : DEFAULT_TOLL_FEE
}

export function memberLabel(name?: string | null, email?: string | null) {
  return name || email || ''
}

export function playerAnimal(index: number) {
  return PLAYER_ANIMALS[index % PLAYER_ANIMALS.length] ?? '🐾'
}

export function playerTitle(index: number, member?: RoomMember | null) {
  const name = memberLabel(member?.name, member?.email)
  return `${playerAnimal(index)} ${name || `玩家${index + 1}`}`
}

export function playerStatusText(index: number, member?: RoomMember | null) {
  if (!member) {
    return `本機玩家 ${index + 1}`
  }

  return member.email ? `已加入 · ${member.email}` : '已加入線上房間'
}

import {
  BOARD_POINTS,
  DEFAULT_CHANCE,
  DEFAULT_FATE,
  DEFAULT_RULES_TEXT,
  DEFAULT_START_MONEY,
  DEFAULT_TILES,
  DEFAULT_TOLL_FEE,
  PASS_GO_BONUS,
  PLAYER_ANIMALS,
} from '../config/game'
import type { CardItem, GameSession, GameState, Tile } from '../types/game'

export const NUM_TILES = BOARD_POINTS.length

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function buildDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    money: DEFAULT_START_MONEY,
    position: 0,
  }))
}

export function initialTurnLogLine() {
  return `歡迎來到山海浮島。每位玩家起始 ${DEFAULT_START_MONEY} 金幣，經過起點可獲得 ${PASS_GO_BONUS} 金幣。`
}

export function defaultGame(): GameSession {
  const playerCount = 4
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
  }
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

export function normalizeState(raw: Partial<GameState> | null | undefined): GameState {
  if (!raw || typeof raw !== 'object') {
    return defaultState()
  }

  const game = raw.game && typeof raw.game === 'object' ? raw.game : defaultGame()
  let playerCount = Number.parseInt(String(game.playerCount ?? 4), 10)
  if (Number.isNaN(playerCount) || playerCount < 2 || playerCount > 6) {
    playerCount = 4
  }

  const players =
    Array.isArray(game.players) && game.players.length === playerCount
      ? game.players.map((player, index) => ({
          id: index,
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
    game: {
      playerCount,
      players,
      currentPlayerIndex: ((currentPlayerIndex % playerCount) + playerCount) % playerCount,
      turnLog:
        Array.isArray(game.turnLog) && game.turnLog.length
          ? game.turnLog.map((line) => String(line))
          : defaultGame().turnLog.slice(),
    },
  }
}

export function playerAnimal(index: number) {
  return PLAYER_ANIMALS[index % PLAYER_ANIMALS.length] ?? '獸'
}

export function playerTitle(index: number) {
  return `${playerAnimal(index)} 玩家${index + 1}`
}

export function isChanceTile(tile: Tile) {
  return tile.type === 'tile-event' && (tile.label.includes('機會') || tile.effect.includes('機會'))
}

export function isFateTile(tile: Tile) {
  return tile.type === 'tile-event' && (tile.label.includes('命運') || tile.effect.includes('命運'))
}

export function isPurchasableLandTile(tile: Tile) {
  return tile.type === 'tile-land' && tile.effect.includes('可購買地塊')
}

export function getTileTollFee(tile: Tile) {
  const matched = tile.effect.match(/(\d+)\s*金幣/)
  if (!matched?.[1]) {
    return DEFAULT_TOLL_FEE
  }

  const fee = Number.parseInt(matched[1], 10)
  return Number.isFinite(fee) && fee > 0 ? fee : DEFAULT_TOLL_FEE
}

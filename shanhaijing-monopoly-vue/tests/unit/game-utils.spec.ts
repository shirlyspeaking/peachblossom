import { describe, expect, it } from 'vitest'
import { DEFAULT_START_MONEY } from '../../src/config/game'
import { getTileTollFee, normalizeState, playerTitle } from '../../src/utils/game'

describe('game utils', () => {
  it('normalizes invalid persisted state back to safe defaults', () => {
    const normalized = normalizeState({
      game: {
        playerCount: 1,
        players: [{ id: 0, money: -20, position: 999 }],
        currentPlayerIndex: 999,
        turnLog: [],
      },
      tiles: [{ type: 'tile-land', label: '測試地', effect: '支付過路費', owner: 'abc' as never }],
    })

    expect(normalized.game.playerCount).toBe(2)
    expect(normalized.game.players).toHaveLength(2)
    expect(normalized.game.players[0]?.money).toBe(DEFAULT_START_MONEY)
    expect(normalized.game.currentPlayerIndex).toBe(1)
    expect(normalized.tiles[0]?.owner).toBeNull()
    expect(normalized.boardGridLocked).toBe(false)
  })

  it('preserves boardGridLocked when true', () => {
    const normalized = normalizeState({
      boardGridLocked: true,
      game: {
        playerCount: 2,
        players: [
          { id: 0, name: '玩家 1', money: 1500, position: 0 },
          { id: 1, name: '玩家 2', money: 1500, position: 0 },
        ],
        currentPlayerIndex: 0,
        turnLog: [],
      },
    })
    expect(normalized.boardGridLocked).toBe(true)
  })

  it('reads toll fee from tile effect text and falls back when absent', () => {
    expect(getTileTollFee({ type: 'tile-land', label: '青丘', effect: '支付 260 金幣過路費', owner: null })).toBe(260)
    expect(getTileTollFee({ type: 'tile-land', label: '青丘', effect: '支付過路費', owner: null })).toBeGreaterThan(0)
  })

  it('builds player title from online member name when available', () => {
    expect(playerTitle(1, { userId: 'u1', playerIndex: 1, name: '小桃', email: 'tao@example.com', picture: null })).toContain('小桃')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '../../src/stores/game'

describe('game store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts with a default playable board', () => {
    const store = useGameStore().api

    expect(store.state.game.playerCount).toBe(2)
    expect(store.state.tiles).toHaveLength(24)
    expect(store.state.chance.length).toBeGreaterThan(0)
    expect(store.state.fate.length).toBeGreaterThan(0)
  })

  it('updates player count in offline mode', () => {
    const store = useGameStore().api
    store.setPlayerCount(6)

    expect(store.state.game.playerCount).toBe(6)
    expect(store.state.game.players).toHaveLength(6)
    expect(store.state.game.currentPlayerIndex).toBe(0)
  })

  it('requires confirmation before resetting to default', () => {
    const store = useGameStore().api
    store.state.rulesText = '自訂規則'
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    store.resetToDefault()

    expect(store.state.rulesText).toBe('自訂規則')
  })
})

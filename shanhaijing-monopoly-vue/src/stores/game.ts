import { defineStore } from 'pinia'
import { useMonopolyGame } from '../composables/useMonopolyGame'

export const useGameStore = defineStore('game', () => {
  const api = useMonopolyGame()
  return { api }
})

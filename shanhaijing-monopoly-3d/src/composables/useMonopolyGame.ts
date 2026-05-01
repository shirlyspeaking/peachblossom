import { computed, reactive, ref } from 'vue'
import { BOARD_POINTS, LAND_PRICE, PASS_GO_BONUS, STORAGE_KEY, TILE_META } from '../config/game'
import {
  buildDefaultPlayers,
  defaultState,
  getTileTollFee,
  isChanceTile,
  isFateTile,
  isPurchasableLandTile,
  normalizeState,
  playerAnimal,
  playerTitle,
} from '../utils/game'
import type { CardItem, GameState } from '../types/game'

const TOAST_DURATION = 2200

export function useMonopolyGame() {
  const state = ref<GameState>(loadState())
  const diceValue = ref(1)
  const isRolling = ref(false)
  const toastMessage = ref('')
  const selectedTileIndex = ref<number | null>(null)

  const cardModal = reactive({
    open: false,
    type: 'chance' as 'chance' | 'fate',
    title: '',
    body: '',
    onContinue: null as null | (() => void),
  })

  const buyLandModal = reactive({
    open: false,
    title: '',
    body: '',
    onChoice: null as null | ((accepted: boolean) => void),
  })

  let toastTimer: number | null = null
  let diceTickTimer: number | null = null
  let diceResultTimer: number | null = null

  const tiles = computed(() =>
    state.value.tiles.map((tile, index) => ({
      ...tile,
      index,
      x: BOARD_POINTS[index][0],
      z: BOARD_POINTS[index][1],
      meta: TILE_META[tile.type],
    })),
  )

  const currentPlayer = computed(() => state.value.game.players[state.value.game.currentPlayerIndex])
  const selectedTile = computed(() =>
    selectedTileIndex.value === null ? null : tiles.value[selectedTileIndex.value],
  )
  const recentTurnLog = computed(() => state.value.game.turnLog.slice(-8).reverse())
  const currentTurnLabel = computed(() => `現在輪到 ${playerTitle(state.value.game.currentPlayerIndex)}`)

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    } catch {
      return defaultState()
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  function showToast(message: string) {
    toastMessage.value = message
    if (toastTimer) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => {
      toastMessage.value = ''
    }, TOAST_DURATION)
  }

  function pushTurnLog(line: string) {
    state.value.game.turnLog.push(line)
    if (state.value.game.turnLog.length > 100) {
      state.value.game.turnLog = state.value.game.turnLog.slice(-100)
    }
  }

  function setPlayerCount(nextCount: number) {
    const count = Math.max(2, Math.min(6, Math.floor(nextCount)))
    state.value.game.playerCount = count
    state.value.game.players = buildDefaultPlayers(count)
    state.value.game.currentPlayerIndex = 0
    state.value.tiles.forEach((tile) => {
      tile.owner = null
    })
    pushTurnLog(`浮島重新集結為 ${count} 位玩家，所有棋子回到起點。`)
    saveState()
    showToast('已更新遊玩人數')
  }

  function restartGameSession() {
    const count = state.value.game.playerCount
    state.value.game.players = buildDefaultPlayers(count)
    state.value.game.currentPlayerIndex = 0
    state.value.game.turnLog = [`重新開局。${count} 位玩家回到起點，每人 ${currentPlayer.value.money} 金幣。`]
    state.value.tiles.forEach((tile) => {
      tile.owner = null
    })
    selectedTileIndex.value = null
    saveState()
    showToast('已重新開始')
  }

  function resetToDefault() {
    state.value = defaultState()
    selectedTileIndex.value = null
    saveState()
    showToast('已回到預設山海棋盤')
  }

  function pickRandomCard(type: 'chance' | 'fate'): CardItem | null {
    const deck = state.value[type]
    if (!deck.length) return null
    return deck[Math.floor(Math.random() * deck.length)]
  }

  function showCard(type: 'chance' | 'fate', title: string, body: string, onContinue?: () => void) {
    cardModal.type = type
    cardModal.title = title
    cardModal.body = body
    cardModal.onContinue = onContinue ?? null
    cardModal.open = true
  }

  function closeCard() {
    cardModal.open = false
    const callback = cardModal.onContinue
    cardModal.onContinue = null
    callback?.()
  }

  function closeBuyLand(accepted = false) {
    buyLandModal.open = false
    const callback = buyLandModal.onChoice
    buyLandModal.onChoice = null
    callback?.(accepted)
  }

  function advanceTurnAfterLand(playerId: number) {
    state.value.game.currentPlayerIndex = (playerId + 1) % state.value.game.playerCount
    pushTurnLog(`輪到 ${playerTitle(state.value.game.currentPlayerIndex)}。`)
    saveState()
  }

  function settleOwnedLandToll(playerId: number, tileIndex: number) {
    const tile = state.value.tiles[tileIndex]
    const owner = Number.parseInt(String(tile.owner), 10)
    if (Number.isNaN(owner) || owner < 0 || owner >= state.value.game.players.length || owner === playerId) {
      return false
    }

    const traveler = state.value.game.players[playerId]
    const landlord = state.value.game.players[owner]
    const fee = getTileTollFee(tile)
    const paid = Math.max(0, Math.min(traveler.money, fee))
    traveler.money -= paid
    landlord.money += paid
    pushTurnLog(`${playerTitle(playerId)} 走到「${tile.label}」，支付 ${paid} 金幣給 ${playerTitle(owner)}。`)
    return true
  }

  function tryPurchaseOrFinish(playerId: number, tileIndex: number) {
    const tile = state.value.tiles[tileIndex]
    const player = state.value.game.players[playerId]
    selectedTileIndex.value = tileIndex

    if (settleOwnedLandToll(playerId, tileIndex)) {
      advanceTurnAfterLand(playerId)
      return
    }

    if (!isPurchasableLandTile(tile) || tile.owner !== null) {
      advanceTurnAfterLand(playerId)
      return
    }

    buyLandModal.title = `買下 ${tile.label}？`
    buyLandModal.body = `需要 ${LAND_PRICE} 金幣，目前持有 ${player.money} 金幣。`
    buyLandModal.onChoice = (accepted) => {
      if (accepted && player.money >= LAND_PRICE) {
        player.money -= LAND_PRICE
        tile.owner = playerId
        pushTurnLog(`${playerTitle(playerId)} 以 ${LAND_PRICE} 金幣買下「${tile.label}」。`)
      } else if (accepted) {
        pushTurnLog(`${playerTitle(playerId)} 金幣不足，無法買下「${tile.label}」。`)
        showToast('金幣不足')
      } else {
        pushTurnLog(`${playerTitle(playerId)} 暫不購買「${tile.label}」。`)
      }
      advanceTurnAfterLand(playerId)
    }
    buyLandModal.open = true
  }

  function runLandEffects(playerId: number) {
    const position = state.value.game.players[playerId].position
    const tile = state.value.tiles[position]

    if (isChanceTile(tile) || isFateTile(tile)) {
      const type = isChanceTile(tile) ? 'chance' : 'fate'
      const picked = pickRandomCard(type)
      pushTurnLog(
        picked
          ? `${playerTitle(playerId)} 抽到${type === 'chance' ? '機會' : '命運'}：「${picked.title}」`
          : `${playerTitle(playerId)} 停在牌格，但牌堆是空的。`,
      )
      showCard(
        type,
        picked?.title.trim() || '牌堆是空的',
        picked?.content.trim() || '請回到原版編輯牌堆，或稍後在 3D 版加入編輯器。',
        () => tryPurchaseOrFinish(playerId, position),
      )
      return
    }

    tryPurchaseOrFinish(playerId, position)
  }

  function rollDice() {
    if (isRolling.value) return
    isRolling.value = true
    if (diceTickTimer) window.clearInterval(diceTickTimer)
    if (diceResultTimer) window.clearTimeout(diceResultTimer)

    diceTickTimer = window.setInterval(() => {
      diceValue.value = 1 + Math.floor(Math.random() * 6)
    }, 72)

    diceResultTimer = window.setTimeout(() => {
      if (diceTickTimer) window.clearInterval(diceTickTimer)

      const roll = 1 + Math.floor(Math.random() * 6)
      diceValue.value = roll
      const playerId = state.value.game.currentPlayerIndex
      const player = state.value.game.players[playerId]
      const sum = player.position + roll
      const crossedGo = sum >= BOARD_POINTS.length
      player.position = sum % BOARD_POINTS.length
      selectedTileIndex.value = player.position

      if (crossedGo) {
        player.money += PASS_GO_BONUS
      }

      const tileName = state.value.tiles[player.position]?.label ?? '未知地界'
      pushTurnLog(`${playerTitle(playerId)} 擲出 ${roll} 點，抵達「${tileName}」${crossedGo ? `，經過起點 +${PASS_GO_BONUS}` : ''}。`)
      saveState()
      window.setTimeout(() => {
        isRolling.value = false
        runLandEffects(playerId)
      }, 480)
    }, 760)
  }

  return {
    state,
    tiles,
    diceValue,
    isRolling,
    toastMessage,
    selectedTileIndex,
    selectedTile,
    currentPlayer,
    recentTurnLog,
    currentTurnLabel,
    cardModal,
    buyLandModal,
    playerAnimal,
    playerTitle,
    setPlayerCount,
    restartGameSession,
    resetToDefault,
    rollDice,
    closeCard,
    closeBuyLand,
  }
}

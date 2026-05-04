import { computed, reactive, ref } from 'vue'
import {
  BOARD_PRESETS_KEY,
  DEFAULT_START_MONEY,
  LAND_PRICE,
  MAX_BOARD_PRESETS_PER_USER,
  PASS_GO_BONUS,
  POSITIONS,
  STORAGE_KEY,
  TILE_META,
} from '../config/game'
import { refreshSession, usePeachAuth } from './usePeachAuth'
import {
  buildDefaultPlayers,
  deepClone,
  defaultState,
  getTileTollFee,
  initialTurnLogLine,
  isChanceTile,
  isFateTile,
  isPurchasableLandTile,
  normalizeState,
  playerAnimal,
  playerStatusText,
  playerTitle,
  readBoardPresetsRoot,
  roomsBaseUrl,
} from '../utils/game'
import type { BoardPreset, GameState, OnlineMeta, RoomPayload, ServerSnapshot } from '../types/game'

const TOAST_DURATION = 2200

export type SideDrawerId = 'presets' | 'cards'

export function useMonopolyGame() {
  const { authState } = usePeachAuth()

  const state = ref<GameState>(loadState())
  const toastMessage = ref('')
  const diceValue = ref(1)
  const isRolling = ref(false)
  const rulesModalOpen = ref(false)
  const sideDrawer = ref<SideDrawerId | null>(null)
  const selectedPresetId = ref('')
  const presetNameInput = ref('')
  const roomCodeInput = ref('')
  const presetsRevision = ref(0)

  const medalModal = reactive({
    open: false,
    type: 'chance' as 'chance' | 'fate',
    title: '',
    body: '',
    onContinue: null as null | (() => void),
  })

  const buyLandModal = reactive({
    open: false,
    html: '',
    onChoice: null as null | ((accepted: boolean) => void),
  })

  const online = reactive({
    mode: false,
    roomCode: '',
    version: 0,
    meta: null as OnlineMeta | null,
  })

  let pollTimer: number | null = null
  let onlineSaveTimer: number | null = null
  let localSaveTimer: number | null = null
  let toastTimer: number | null = null
  let diceTickTimer: number | null = null
  let diceResultTimer: number | null = null

  const tiles = computed(() =>
    state.value.tiles.map((tile, index) => ({
      ...tile,
      index,
      row: POSITIONS[index][0],
      col: POSITIONS[index][1],
      meta: TILE_META[tile.type],
    })),
  )

  const canEditBoardAndCards = computed(() => !online.mode || isOnlineHost.value)
  const currentPlayer = computed(() => state.value.game.players[state.value.game.currentPlayerIndex] ?? null)
  const boardPresets = computed(() => {
    presetsRevision.value
    const userId = authState.user?.id
    if (!userId) {
      return []
    }
    const root = readBoardPresetsRoot(localStorage.getItem(BOARD_PRESETS_KEY))
    return (root.byUser[userId] ?? []).slice().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
  })

  const onlineRoomShareUrl = computed(() => {
    if (!online.roomCode) return ''
    const url = new URL(window.location.href)
    url.searchParams.set('room', online.roomCode)
    return url.toString()
  })

  const onlineStatusText = computed(() => {
    if (!online.mode || !online.roomCode) {
      return ''
    }
    const members = online.meta?.members ?? []
    return `房間代碼 ${online.roomCode}，已加入 ${members.length}/${state.value.game.playerCount} 位玩家`
  })

  const isOnlineHost = computed(() => {
    return !!(online.mode && online.meta?.hostUserId && authState.user?.id && online.meta.hostUserId === authState.user.id)
  })

  const lobbyFull = computed(() => {
    if (!online.mode || !online.meta) return false
    return (online.meta.members ?? []).length >= state.value.game.playerCount
  })

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    } catch {
      return defaultState()
    }
  }

  function saveState() {
    if (online.mode) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  function showToast(message: string) {
    toastMessage.value = message
    if (toastTimer) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => {
      toastMessage.value = ''
    }, TOAST_DURATION)
  }

  function debouncedSave() {
    if (localSaveTimer) window.clearTimeout(localSaveTimer)
    localSaveTimer = window.setTimeout(() => {
      if (online.mode) {
        scheduleOnlinePushAfterEdit()
        return
      }
      saveState()
      showToast('已自動儲存')
    }, 500)
  }

  function stopOnlinePoll() {
    if (pollTimer) {
      window.clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function memberAtPlayerIndex(index: number) {
    return (online.meta?.members ?? []).find((member) => member.playerIndex === index) ?? null
  }

  function titleForPlayer(index: number) {
    return playerTitle(index, online.mode ? memberAtPlayerIndex(index) : null)
  }

  function statusForPlayer(index: number) {
    const member = online.mode ? memberAtPlayerIndex(index) : null
    if (online.mode && !member) {
      return '等待加入'
    }
    return playerStatusText(index, member)
  }

  function canEditPlayerMoney(index: number) {
    if (!online.mode) return true
    const member = memberAtPlayerIndex(index)
    return !!(member?.userId && authState.user?.id && member.userId === authState.user.id)
  }

  function buildServerSnapshot(): ServerSnapshot {
    return {
      hostUserId: online.meta?.hostUserId ?? '',
      members: deepClone(online.meta?.members ?? []),
      tiles: deepClone(state.value.tiles),
      chance: deepClone(state.value.chance),
      fate: deepClone(state.value.fate),
      rulesText: state.value.rulesText,
      game: deepClone(state.value.game),
    }
  }

  function applyServerPayload(data: RoomPayload, silentToast = false) {
    if (!data.snapshot) return
    online.version = data.version ?? online.version
    online.meta = {
      hostUserId: data.snapshot.hostUserId,
      members: data.snapshot.members ?? [],
    }
    state.value = normalizeState({
      tiles: data.snapshot.tiles,
      chance: data.snapshot.chance,
      fate: data.snapshot.fate,
      rulesText: data.snapshot.rulesText,
      game: data.snapshot.game,
    })
    if (online.mode && !silentToast) {
      showToast('已同步房間狀態')
    }
  }

  async function pollRoom() {
    if (!online.mode || !online.roomCode) return

    try {
      const response = await fetch(`${roomsBaseUrl()}/${encodeURIComponent(online.roomCode)}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      const data = (await response.json()) as RoomPayload
      if (data?.ok && data.version !== online.version) {
        applyServerPayload(data, true)
      }
    } catch {
      // ignore background polling failures
    }
  }

  function startOnlinePoll() {
    stopOnlinePoll()
    pollTimer = window.setInterval(pollRoom, 2600)
  }

  async function pushOnlineSnapshot(callback?: (success: boolean) => void) {
    if (!online.mode || !online.roomCode) {
      callback?.(true)
      return
    }

    try {
      const response = await fetch(`${roomsBaseUrl()}/${encodeURIComponent(online.roomCode)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: online.version,
          snapshot: buildServerSnapshot(),
        }),
      })
      const data = (await response.json()) as RoomPayload

      if (response.ok && data?.ok) {
        online.version = data.version ?? online.version
        if (data.snapshot) {
          applyServerPayload(data, true)
        }
        callback?.(true)
        return
      }

      if (data?.error === 'version_conflict' && data.snapshot) {
        applyServerPayload(
          {
            version: data.serverVersion ?? online.version,
            snapshot: data.snapshot,
          },
          true,
        )
        showToast('與伺服器同步後已合併狀態')
        callback?.(false)
        return
      }

      showToast('同步失敗，請重試')
      callback?.(false)
    } catch {
      showToast('網路錯誤')
      callback?.(false)
    }
  }

  function scheduleOnlinePushAfterEdit() {
    if (!online.mode) return
    if (onlineSaveTimer) window.clearTimeout(onlineSaveTimer)
    onlineSaveTimer = window.setTimeout(() => {
      void pushOnlineSnapshot()
    }, 900)
  }

  function syncRulesText(value: string) {
    state.value.rulesText = value
    debouncedSave()
  }

  function updateTileField(index: number, field: 'label' | 'effect', value: string) {
    state.value.tiles[index][field] = value
    debouncedSave()
  }

  function updatePlayerMoney(index: number, value: number) {
    if (!state.value.game.players[index]) return
    if (!canEditPlayerMoney(index)) {
      showToast('線上模式只能調整自己的金幣')
      return
    }
    state.value.game.players[index].money = Math.max(0, Math.floor(value || 0))
    debouncedSave()
  }

  function pushTurnLog(line: string) {
    state.value.game.turnLog.push(line)
    if (state.value.game.turnLog.length > 100) {
      state.value.game.turnLog = state.value.game.turnLog.slice(-100)
    }
  }

  function setPlayerCount(nextCount: number) {
    if (online.mode) {
      showToast('線上房間無法變更人數')
      return
    }

    const count = Math.max(2, Math.min(6, Math.floor(nextCount)))
    state.value.game.playerCount = count
    state.value.game.players = buildDefaultPlayers(count)
    state.value.game.currentPlayerIndex = 0
    state.value.tiles.forEach((tile) => {
      if (tile.owner != null && tile.owner >= count) {
        tile.owner = null
      }
    })
    pushTurnLog(`這局改成 ${count} 隻靈獸，大家回到起點並拿回 ${DEFAULT_START_MONEY} 金幣。`)
    saveState()
    showToast('已更新遊玩人數')
  }

  function pickRandomCard(type: 'chance' | 'fate') {
    const deck = state.value[type]
    if (!deck.length) return null
    return deck[Math.floor(Math.random() * deck.length)]
  }

  function closeMedalPopup() {
    medalModal.open = false
    const callback = medalModal.onContinue
    medalModal.onContinue = null
    callback?.()
  }

  function closeBuyLandPopup(accepted = false) {
    buyLandModal.open = false
    const callback = buyLandModal.onChoice
    buyLandModal.onChoice = null
    callback?.(accepted)
  }

  function showMedalCard(type: 'chance' | 'fate', title: string, body: string, onContinue?: () => void) {
    medalModal.type = type
    medalModal.title = title
    medalModal.body = body
    medalModal.onContinue = onContinue ?? null
    medalModal.open = true
  }

  function showBuyLandDialog(html: string, onChoice: (accepted: boolean) => void) {
    buyLandModal.html = html
    buyLandModal.onChoice = onChoice
    buyLandModal.open = true
  }

  function clearAllTileOwners() {
    state.value.tiles.forEach((tile) => {
      tile.owner = null
    })
  }

  function restartGameSession() {
    if (online.mode && !isOnlineHost.value) {
      showToast('僅房主可重新開始遊戲')
      return
    }
    if (
      !window.confirm(
        '確定重新開始本局？\n將保留：棋盤格、機會／命運卡、規則文字。\n將重置：棋子位置、金幣、領地擁有權、回合與回合記錄。',
      )
    ) {
      return
    }

    const count = Math.min(6, Math.max(2, Number(state.value.game.playerCount) || 4))
    state.value.game = {
      playerCount: count,
      players: buildDefaultPlayers(count),
      currentPlayerIndex: 0,
      turnLog: [initialTurnLogLine()],
    }
    clearAllTileOwners()
    if (online.mode) {
      scheduleOnlinePushAfterEdit()
    } else {
      saveState()
    }
    showToast('已重新開始遊戲')
  }

  function snapshotBoardSettingsOnly() {
    return {
      tiles: deepClone(state.value.tiles),
      chance: deepClone(state.value.chance),
      fate: deepClone(state.value.fate),
      rulesText: state.value.rulesText,
    }
  }

  function applyBoardPresetPayload(preset: BoardPreset) {
    const playerCount = Math.min(6, Math.max(2, Number(state.value.game.playerCount) || 4))
    state.value = normalizeState({
      ...snapshotBoardSettingsOnly(),
      ...preset,
      game: {
        playerCount,
        players: buildDefaultPlayers(playerCount),
        currentPlayerIndex: 0,
        turnLog: [initialTurnLogLine()],
      },
    })
    if (online.mode) {
      scheduleOnlinePushAfterEdit()
    } else {
      saveState()
    }
  }

  function genPresetId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `p_${Date.now()}_${Math.floor(Math.random() * 1e9)}`
  }

  function savePreset() {
    const userId = authState.user?.id
    if (!userId) {
      showToast('請先完成 Google 登入')
      return
    }
    if (!canEditBoardAndCards.value) {
      showToast('線上房間僅房主可儲存棋盤設定')
      return
    }

    const name = presetNameInput.value.trim()
    if (!name) {
      showToast('請輸入收藏名稱')
      return
    }

    const root = readBoardPresetsRoot(localStorage.getItem(BOARD_PRESETS_KEY))
    if (!root.byUser[userId]) {
      root.byUser[userId] = []
    }
    root.byUser[userId].unshift({
      id: genPresetId(),
      name,
      savedAt: Date.now(),
      ...snapshotBoardSettingsOnly(),
    })
    root.byUser[userId] = root.byUser[userId].slice(0, MAX_BOARD_PRESETS_PER_USER)
    localStorage.setItem(BOARD_PRESETS_KEY, JSON.stringify(root))
    presetsRevision.value += 1
    presetNameInput.value = ''
    showToast('已儲存收藏')
  }

  function loadPreset() {
    const preset = boardPresets.value.find((item) => item.id === selectedPresetId.value)
    if (!preset) {
      showToast('找不到此收藏')
      return
    }
    if (!canEditBoardAndCards.value) {
      showToast('線上房間僅房主可載入棋盤')
      return
    }
    if (!window.confirm('套用後將取代目前棋盤、機會／命運卡與規則文字，並依目前人數重新開局。確定？')) {
      return
    }
    applyBoardPresetPayload(preset)
    sideDrawer.value = null
    showToast(`已載入「${preset.name || '未命名'}」`)
  }

  function deletePreset() {
    const userId = authState.user?.id
    if (!userId) return
    if (!canEditBoardAndCards.value) {
      showToast('線上房間僅房主可刪除收藏')
      return
    }
    if (!window.confirm('確定刪除此筆收藏？（不影響目前棋盤）')) {
      return
    }
    const root = readBoardPresetsRoot(localStorage.getItem(BOARD_PRESETS_KEY))
    root.byUser[userId] = (root.byUser[userId] ?? []).filter((item) => item.id !== selectedPresetId.value)
    localStorage.setItem(BOARD_PRESETS_KEY, JSON.stringify(root))
    presetsRevision.value += 1
    selectedPresetId.value = ''
    showToast('已刪除收藏')
  }

  function resetToDefault() {
    if (online.mode) {
      showToast('請先離開線上模式再重設')
      return
    }
    if (!window.confirm('確定要重設為預設內容？所有修改將清除。')) {
      return
    }
    state.value = defaultState()
    saveState()
    showToast('已重設為預設內容')
  }

  function addCard(type: 'chance' | 'fate') {
    state.value[type].push({ title: '', content: '' })
    debouncedSave()
  }

  function updateCard(type: 'chance' | 'fate', index: number, field: 'title' | 'content', value: string) {
    state.value[type][index][field] = value
    debouncedSave()
  }

  function deleteCard(type: 'chance' | 'fate', index: number) {
    state.value[type].splice(index, 1)
    debouncedSave()
  }

  function drawCard(type: 'chance' | 'fate') {
    const picked = pickRandomCard(type)
    if (!picked) {
      showToast('此牌堆目前沒有卡片')
      return
    }
    const playerId = state.value.game.currentPlayerIndex
    const landedPos = state.value.game.players[playerId].position
    showMedalCard(type, picked.title.trim() || '（未命名）', picked.content.trim() || '（無內容）', () => {
      applyResolvedCardEffect(playerId, picked.title, picked.content, landedPos)
    })
  }

  function applyResolvedCardEffect(playerId: number, title: string, content: string, landedPos: number) {
    const player = state.value.game.players[playerId]
    const teleport =
      /(立刻\s*)?前往起點|回到起點|移動至起點|到達起點|移至起點|到達\s*「?\s*起點/.test(content) ||
      /(立刻\s*)?前往起點|回到起點/.test(title)

    if (!teleport) {
      return landedPos
    }

    const denyBonus = /不領|無獎勵|無法領|不發放|不拿.*獎勵|不領獎|不經過/.test(content)
    const grantPass = !denyBonus && /領取|可領|經過起點\s*\+|獲得.*經過|\+.*200|起點獎勵/.test(content)

    player.position = 0
    if (grantPass) {
      player.money += PASS_GO_BONUS
      pushTurnLog(`${titleForPlayer(playerId)} 依「${title || '卡片'}」效果移至起點，並領取經過起點 ${PASS_GO_BONUS} 金幣。`)
    } else {
      pushTurnLog(`${titleForPlayer(playerId)} 依「${title || '卡片'}」效果立刻移至起點（不領經過起點獎勵）。`)
    }

    if (online.mode) {
      scheduleOnlinePushAfterEdit()
    } else {
      saveState()
    }
    return 0
  }

  function advanceTurnAfterLand(playerId: number) {
    state.value.game.currentPlayerIndex = (playerId + 1) % state.value.game.playerCount
    pushTurnLog(`下一位出發：${titleForPlayer(state.value.game.currentPlayerIndex)}。`)
    if (online.mode) {
      void pushOnlineSnapshot()
    } else {
      saveState()
    }
  }

  function settleOwnedLandToll(playerId: number, tileIndex: number) {
    const tile = state.value.tiles[tileIndex]
    if (!tile) return false

    const owner = Number.parseInt(String(tile.owner), 10)
    if (Number.isNaN(owner) || owner < 0 || owner >= state.value.game.players.length || owner === playerId) {
      return false
    }

    const traveler = state.value.game.players[playerId]
    const landlord = state.value.game.players[owner]
    const fee = getTileTollFee(tile)
    const paid = Math.max(0, Math.min(traveler.money, fee))
    if (paid > 0) {
      traveler.money -= paid
      landlord.money += paid
    }

    if (paid < fee) {
      pushTurnLog(
        `${titleForPlayer(playerId)} 走到「${tile.label}」，應付過路費 ${fee}，但只剩 ${paid}；已全數付給 ${titleForPlayer(owner)}。`,
      )
    } else {
      pushTurnLog(`${titleForPlayer(playerId)} 走到「${tile.label}」，支付過路費 ${paid} 給 ${titleForPlayer(owner)}。`)
    }
    return true
  }

  function tryPurchaseOrFinish(playerId: number, tileIndex: number) {
    const tile = state.value.tiles[tileIndex]
    const player = state.value.game.players[playerId]
    const unowned = tile.owner == null

    if (settleOwnedLandToll(playerId, tileIndex)) {
      advanceTurnAfterLand(playerId)
      return
    }

    if (!isPurchasableLandTile(tile) || !unowned) {
      advanceTurnAfterLand(playerId)
      return
    }

    showBuyLandDialog(
      `是否以 <strong>${LAND_PRICE} 金幣</strong> 購買「<strong>${tile.label}</strong>」？<br>（您目前有 ${player.money} 金幣）`,
      (accepted) => {
        if (accepted) {
          if (player.money < LAND_PRICE) {
            pushTurnLog(`${titleForPlayer(playerId)} 金幣不夠，沒辦法買下「${tile.label}」。`)
            showToast('金幣不足')
          } else {
            player.money -= LAND_PRICE
            tile.owner = playerId
            pushTurnLog(`${titleForPlayer(playerId)} 用 ${LAND_PRICE} 金幣買下「${tile.label}」。`)
            if (online.mode) {
              scheduleOnlinePushAfterEdit()
            } else {
              saveState()
            }
          }
        } else {
          pushTurnLog(`${titleForPlayer(playerId)} 先不買「${tile.label}」。`)
        }
        advanceTurnAfterLand(playerId)
      },
    )
  }

  function runLandEffects(playerId: number) {
    const position = state.value.game.players[playerId].position
    const tile = state.value.tiles[position]

    if (isChanceTile(tile)) {
      const picked = pickRandomCard('chance')
      pushTurnLog(
        picked
          ? `${titleForPlayer(playerId)} 抽到機會卡：「${picked.title.trim()}」— ${picked.content.trim()}`
          : `${titleForPlayer(playerId)} 停在機會格，但牌堆還沒有卡片。`,
      )
      showMedalCard(
        'chance',
        picked?.title.trim() || '牌堆是空的',
        picked?.content.trim() || '請先新增機會卡。',
        () => {
          const nextPosition = picked
            ? applyResolvedCardEffect(playerId, picked.title, picked.content, position)
            : position
          tryPurchaseOrFinish(playerId, nextPosition)
        },
      )
      return
    }

    if (isFateTile(tile)) {
      const picked = pickRandomCard('fate')
      pushTurnLog(
        picked
          ? `${titleForPlayer(playerId)} 抽到命運卡：「${picked.title.trim()}」— ${picked.content.trim()}`
          : `${titleForPlayer(playerId)} 停在命運格，但牌堆還沒有卡片。`,
      )
      showMedalCard(
        'fate',
        picked?.title.trim() || '牌堆是空的',
        picked?.content.trim() || '請先新增命運卡。',
        () => {
          const nextPosition = picked
            ? applyResolvedCardEffect(playerId, picked.title, picked.content, position)
            : position
          tryPurchaseOrFinish(playerId, nextPosition)
        },
      )
      return
    }

    tryPurchaseOrFinish(playerId, position)
  }

  function rollDice() {
    if (isRolling.value) return
    if (online.mode) {
      if (!lobbyFull.value) {
        showToast('請等待所有玩家加入房間')
        return
      }
      const member = memberAtPlayerIndex(state.value.game.currentPlayerIndex)
      if (!member || !authState.user?.id || member.userId !== authState.user.id) {
        showToast(`現在輪到 ${titleForPlayer(state.value.game.currentPlayerIndex)} 行動`)
        return
      }
    }

    isRolling.value = true
    if (diceTickTimer) window.clearInterval(diceTickTimer)
    if (diceResultTimer) window.clearTimeout(diceResultTimer)

    diceTickTimer = window.setInterval(() => {
      diceValue.value = 1 + Math.floor(Math.random() * 6)
    }, 75)

    diceResultTimer = window.setTimeout(() => {
      if (diceTickTimer) window.clearInterval(diceTickTimer)

      const roll = 1 + Math.floor(Math.random() * 6)
      diceValue.value = roll

      const playerId = state.value.game.currentPlayerIndex
      const player = state.value.game.players[playerId]
      const sum = player.position + roll
      const crossedGo = sum >= POSITIONS.length
      player.position = sum % POSITIONS.length
      if (crossedGo) {
        player.money += PASS_GO_BONUS
      }

      const tileName = state.value.tiles[player.position]?.label ?? '？'
      let message = `${titleForPlayer(playerId)} 擲出 ${roll} 點，走到「${tileName}」`
      if (crossedGo) {
        message += `；經過起點 +${PASS_GO_BONUS}`
      }
      pushTurnLog(message)

      const finish = () => {
        isRolling.value = false
        runLandEffects(playerId)
      }

      if (online.mode) {
        void pushOnlineSnapshot(() => finish())
      } else {
        saveState()
        finish()
      }
    }, 720)
  }

  async function createOnlineRoom() {
    try {
      const session = await refreshSession()
      if (!session?.authenticated || !session.user) {
        showToast('請先完成 Google 登入')
        return
      }

      const response = await fetch(roomsBaseUrl(), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerCount: state.value.game.playerCount,
          state: state.value,
        }),
      })
      const data = (await response.json()) as RoomPayload
      if (!data?.ok || !data.roomCode) {
        showToast(data?.error || '建立失敗')
        return
      }
      enterOnlineMode(data.roomCode, data)
    } catch {
      showToast('建立失敗')
    }
  }

  async function joinOnlineRoom() {
    const code = roomCodeInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (code.length < 4) {
      showToast('請輸入有效房間代碼')
      return
    }

    try {
      const session = await refreshSession()
      if (!session?.authenticated || !session.user) {
        showToast('請先完成 Google 登入')
        return
      }

      const response = await fetch(`${roomsBaseUrl()}/join`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = (await response.json()) as RoomPayload
      if (!data?.ok || !data.roomCode) {
        if (data?.error === 'room_full') {
          showToast('房間已滿')
        } else if (data?.error === 'room_not_found') {
          showToast('找不到房間')
        } else {
          showToast('加入失敗')
        }
        return
      }
      enterOnlineMode(data.roomCode, data)
    } catch {
      showToast('加入失敗')
    }
  }

  function enterOnlineMode(roomCode: string, data: RoomPayload) {
    online.mode = true
    online.roomCode = roomCode
    applyServerPayload(data, true)
    startOnlinePoll()
    showToast('已進入線上房間')
  }

  function leaveOnlineMode() {
    stopOnlinePoll()
    online.mode = false
    online.roomCode = ''
    online.version = 0
    online.meta = null
    showToast('已返回本機模式（未寫入雲端）')
  }

  function fillRoomCodeFromQuery() {
    const params = new URLSearchParams(window.location.search)
    const room = params.get('room')
    if (room) {
      roomCodeInput.value = room.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    }
  }

  async function initialize() {
    fillRoomCodeFromQuery()
    await refreshSession()
  }

  function toggleSideDrawer(which: SideDrawerId) {
    sideDrawer.value = sideDrawer.value === which ? null : which
  }

  function closeSideDrawer() {
    sideDrawer.value = null
  }

  return {
    state,
    tiles,
    toastMessage,
    diceValue,
    isRolling,
    rulesModalOpen,
    sideDrawer,
    toggleSideDrawer,
    closeSideDrawer,
    selectedPresetId,
    presetNameInput,
    roomCodeInput,
    medalModal,
    buyLandModal,
    online,
    canEditBoardAndCards,
    currentPlayer,
    boardPresets,
    onlineRoomShareUrl,
    onlineStatusText,
    isOnlineHost,
    lobbyFull,
    initialize,
    memberAtPlayerIndex,
    playerAnimal,
    titleForPlayer,
    statusForPlayer,
    canEditPlayerMoney,
    syncRulesText,
    updateTileField,
    updatePlayerMoney,
    setPlayerCount,
    restartGameSession,
    resetToDefault,
    addCard,
    updateCard,
    deleteCard,
    drawCard,
    closeMedalPopup,
    closeBuyLandPopup,
    rollDice,
    savePreset,
    loadPreset,
    deletePreset,
    createOnlineRoom,
    joinOnlineRoom,
    leaveOnlineMode,
    showToast,
  }
}

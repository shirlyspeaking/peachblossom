<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AuthBar from './components/AuthBar.vue'
import BaseDialog from './components/BaseDialog.vue'
import BoardTile from './components/BoardTile.vue'
import CardEditorColumn from './components/CardEditorColumn.vue'
import { PLAYER_COLORS } from './config/game'
import { login, logout, refreshSession } from './composables/usePeachAuth'
import { useAuthStore } from './stores/auth'
import { useGameStore } from './stores/game'

const game = useGameStore().api
const { authState } = useAuthStore().api

const turnLogOpen = ref(false)
const playersModalOpen = ref(false)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  if (playersModalOpen.value) {
    playersModalOpen.value = false
  } else if (turnLogOpen.value) {
    turnLogOpen.value = false
  } else if (game.medalModal.open) {
    game.closeMedalPopup()
  } else if (game.buyLandModal.open) {
    game.closeBuyLandPopup(false)
  } else if (game.sideDrawer) {
    game.closeSideDrawer()
  }
}

const pawnPositions = computed(() =>
  game.tiles.map((tile) =>
    game.state.game.players
      .map((player, index) => ({ position: player.position, playerNumber: index + 1 }))
      .filter((item) => item.position === tile.index)
      .map((item) => ({
        playerNumber: item.playerNumber,
        label: game.pawnLabelForPlayer(item.playerNumber - 1),
      })),
  ),
)

const playerSlotIndices = computed(() =>
  Array.from({ length: game.state.game.playerCount }, (_, i) => i),
)

const recentTurnLog = computed(() => game.state.game.turnLog.slice(-30))

onMounted(async () => {
  await game.initialize()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar__lead">
        <div class="topbar__title">
          <p class="eyebrow">桃花源 · 劇本桌遊</p>
          <h1>桃源萬象大富翁</h1>
        </div>

        <div class="topbar-orbit hero-orbit" aria-hidden="true">
          <span class="hero-orbit__ring"></span>
          <span class="hero-orbit__beast">龍</span>
          <span class="hero-orbit__dice">骰</span>
          <span class="hero-orbit__spark hero-orbit__spark--one"></span>
          <span class="hero-orbit__spark hero-orbit__spark--two"></span>
        </div>
      </div>

      <div class="topbar__actions">
        <AuthBar
          :status="authState.status"
          :user="authState.user ?? null"
          :error="authState.error"
          @login="login"
          @logout="logout"
          @retry="refreshSession"
        />
        <a class="back-link" href="../index.html">← 回桃花源</a>
        <a class="back-link back-link--secondary" href="../shanhaijing-monopoly/index.html">查看舊版</a>
      </div>
    </header>

    <section class="online-panel">
      <div>
        <h3>線上對戰（Google 登入）</h3>
      </div>

      <div class="online-panel__actions">
        <button type="button" class="primary-btn" @click="game.createOnlineRoom">建立線上房間</button>
        <label class="inline-field">
          <span>房間代碼</span>
          <input v-model="game.roomCodeInput" type="text" maxlength="8" placeholder="ABCDEF" />
        </label>
        <button type="button" class="secondary-btn" @click="game.joinOnlineRoom">加入房間</button>
        <button type="button" class="danger-btn" :disabled="!game.online.mode" @click="game.leaveOnlineMode">離開線上模式</button>
      </div>

      <div v-if="game.online.mode" class="online-panel__status">
        <p>{{ game.onlineStatusText }}</p>
        <a :href="game.onlineRoomShareUrl">{{ game.onlineRoomShareUrl }}</a>
      </div>
    </section>

    <main class="workspace-shell">
      <section class="board-panel">
        <div class="panel-header panel-header--board">
          <div class="panel-header__lead">
            <p class="eyebrow">Board</p>
            <h2>巡遊棋盤</h2>
            <p v-if="game.state.boardGridLocked" class="board-locked-note">
              已套用棋盤收藏：格名與效果為唯讀。若要恢復編輯，請按「重設預設」。
            </p>
          </div>
          <div class="board-toolbar">
            <button type="button" class="secondary-btn secondary-btn--toolbar" @click="playersModalOpen = true">玩家設定</button>
            <button type="button" class="secondary-btn secondary-btn--toolbar" @click="turnLogOpen = true">回合記錄</button>
            <button type="button" class="secondary-btn secondary-btn--toolbar" @click="game.restartGameSession">重新開始</button>
            <button type="button" class="danger-btn danger-btn--toolbar" @click="game.resetToDefault">重設預設</button>
          </div>
        </div>

        <div class="board-scroll">
          <div class="board-grid" :class="{ 'board-grid--locked': game.state.boardGridLocked }">
            <BoardTile
              v-for="(tile, index) in game.tiles"
              :key="index"
              :tile="tile"
              :index="index"
              :row="tile.row"
              :col="tile.col"
              :meta="tile.meta"
              :disabled="!game.canEditBoardTiles"
              :pawns="pawnPositions[index]"
              @update-field="game.updateTileField"
            />

            <section class="board-center">
              <div class="board-center__block board-center__block--dice">
                <div
                  class="dice-shell"
                  :class="{ 'dice-shell--rolling': game.isRolling }"
                  :style="`--dice-rotation: var(--dice-face-${game.diceValue});`"
                >
                  <div class="dice-cube">
                    <span class="dice-face dice-face--front">1</span>
                    <span class="dice-face dice-face--back">6</span>
                    <span class="dice-face dice-face--right">3</span>
                    <span class="dice-face dice-face--left">4</span>
                    <span class="dice-face dice-face--top">2</span>
                    <span class="dice-face dice-face--bottom">5</span>
                  </div>
                </div>
                <button type="button" class="primary-btn" :disabled="game.isRolling" @click="game.rollDice">
                  擲骰
                </button>
                <div class="draw-actions">
                  <button type="button" class="secondary-btn" @click="game.drawCard('chance')">抽機會卡</button>
                  <button type="button" class="secondary-btn" @click="game.drawCard('fate')">抽命運卡</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div class="drawer-rail" role="toolbar" aria-label="側邊工具">
        <button
          type="button"
          class="drawer-rail__btn"
          :class="{ 'drawer-rail__btn--active': game.sideDrawer === 'presets' }"
          :aria-pressed="game.sideDrawer === 'presets'"
          @click="game.toggleSideDrawer('presets')"
        >
          <span class="drawer-rail__label">棋盤收藏</span>
        </button>
        <button
          type="button"
          class="drawer-rail__btn"
          :class="{ 'drawer-rail__btn--active': game.sideDrawer === 'cards' }"
          :aria-pressed="game.sideDrawer === 'cards'"
          @click="game.toggleSideDrawer('cards')"
        >
          <span class="drawer-rail__label">卡片設置</span>
        </button>
      </div>

      <Transition name="drawer-backdrop">
        <div
          v-if="game.sideDrawer"
          class="drawer-backdrop"
          aria-hidden="true"
          @click="game.closeSideDrawer"
        />
      </Transition>

      <Transition name="drawer-panel">
        <aside
          v-if="game.sideDrawer"
          class="drawer-panel"
          role="dialog"
          :aria-labelledby="game.sideDrawer === 'presets' ? 'drawer-title-presets' : 'drawer-title-cards'"
        >
          <div class="drawer-panel__header panel-header">
            <div class="panel-header__lead">
              <p class="eyebrow">{{ game.sideDrawer === 'presets' ? 'Presets' : 'Cards' }}</p>
              <h2 :id="game.sideDrawer === 'presets' ? 'drawer-title-presets' : 'drawer-title-cards'">
                {{ game.sideDrawer === 'presets' ? '棋盤收藏' : '卡片設置' }}
              </h2>
            </div>
            <button type="button" class="secondary-btn" @click="game.closeSideDrawer">關閉</button>
          </div>

          <div class="drawer-panel__body">
            <template v-if="game.sideDrawer === 'presets'">
              <p class="panel-note drawer-panel__lede">保存地塊、規則與卡牌設定，方便下次快速載入。</p>
              <div class="preset-panel">
                <template v-if="authState.user">
                  <label class="inline-field inline-field--stacked">
                    <span>收藏名稱</span>
                    <input v-model="game.presetNameInput" type="text" maxlength="40" placeholder="例如：春節親子版" />
                  </label>
                  <button type="button" class="secondary-btn" @click="game.savePreset">儲存目前設定</button>

                  <label class="inline-field inline-field--stacked">
                    <span>已儲存棋盤</span>
                    <select v-model="game.selectedPresetId">
                      <option value="">— 請選擇 —</option>
                      <option v-for="preset in game.boardPresets" :key="preset.id" :value="preset.id">
                        {{ preset.name }} · {{ new Date(preset.savedAt).toLocaleDateString() }}
                      </option>
                    </select>
                  </label>

                  <div class="preset-actions">
                    <button type="button" class="secondary-btn" :disabled="!game.selectedPresetId" @click="game.loadPreset">套用至棋盤</button>
                    <button type="button" class="danger-btn" :disabled="!game.selectedPresetId" @click="game.deletePreset">刪除</button>
                  </div>
                </template>
                <p v-else class="panel-note">請先登入後再使用棋盤收藏。</p>
              </div>
            </template>

            <div v-else class="cards-grid cards-grid--drawer">
              <CardEditorColumn
                title="機會卡"
                emoji="🟡"
                accent-class="card-column__title--chance"
                :cards="game.state.chance"
                type="chance"
                :disabled="!game.canEditBoardAndCards"
                @add="game.addCard"
                @update="game.updateCard"
                @delete="game.deleteCard"
              />

              <CardEditorColumn
                title="命運卡"
                emoji="🔵"
                accent-class="card-column__title--fate"
                :cards="game.state.fate"
                type="fate"
                :disabled="!game.canEditBoardAndCards"
                @add="game.addCard"
                @update="game.updateCard"
                @delete="game.deleteCard"
              />
            </div>
          </div>
        </aside>
      </Transition>
    </main>

    <BaseDialog :open="turnLogOpen" title="回合記錄" width="medium" @close="turnLogOpen = false">
      <div class="turn-log turn-log--dialog">
        <p v-for="(line, index) in recentTurnLog" :key="`${index}-${line}`">{{ line }}</p>
      </div>
    </BaseDialog>

    <BaseDialog :open="playersModalOpen" title="玩家設定" width="medium" @close="playersModalOpen = false">
      <div class="player-modal-count">
        <label class="inline-field inline-field--stacked player-modal-count__field">
          <span>本局玩家數</span>
          <select
            :value="game.state.game.playerCount"
            :disabled="game.online.mode"
            @change="game.setPlayerCount(Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="n in [2, 3, 4, 5, 6]" :key="n" :value="n">{{ n }} 人</option>
          </select>
        </label>
        <p v-if="game.online.mode" class="player-modal-count__hint">
          線上房間的人數由建立房間時決定，無法在此變更。
        </p>
      </div>
      <div class="player-modal-grid">
        <article
          v-for="index in playerSlotIndices"
          :key="index"
          class="player-modal-item"
          :class="{ 'player-modal-item--active': index === game.state.game.currentPlayerIndex }"
        >
          <span class="player-token" :style="{ background: PLAYER_COLORS[index % PLAYER_COLORS.length] }">
            {{ game.playerAnimal(index) }}
          </span>
          <label class="player-modal-item__name">
            <span>玩家 {{ index + 1 }}</span>
            <input
              type="text"
              maxlength="20"
              :disabled="!game.state.game.players[index]"
              :value="game.state.game.players[index]?.name || `玩家 ${index + 1}`"
              @change="game.updatePlayerName(index, ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="player-modal-item__money">
            <span>💰 金幣</span>
            <input
              type="number"
              min="0"
              step="1"
              :disabled="!game.state.game.players[index] || !game.canEditPlayerMoney(index)"
              :value="game.state.game.players[index]?.money ?? 0"
              @change="game.updatePlayerMoney(index, Number(($event.target as HTMLInputElement).value))"
            />
          </label>
        </article>
      </div>
    </BaseDialog>

    <BaseDialog :open="game.medalModal.open" :title="game.medalModal.type === 'chance' ? '機會卡' : '命運卡'" width="narrow" @close="game.closeMedalPopup">
      <div class="medal-card" :class="`medal-card--${game.medalModal.type}`">
        <h3>{{ game.medalModal.title }}</h3>
        <p>{{ game.medalModal.body }}</p>
        <button type="button" class="primary-btn primary-btn--wide" @click="game.closeMedalPopup">確定</button>
      </div>
    </BaseDialog>

    <BaseDialog :open="game.buyLandModal.open" title="購買地塊" width="narrow" @close="game.closeBuyLandPopup(false)">
      <div class="buy-panel">
        <p v-html="game.buyLandModal.html" />
        <div class="buy-panel__actions">
          <button type="button" class="primary-btn" @click="game.closeBuyLandPopup(true)">要</button>
          <button type="button" class="secondary-btn" @click="game.closeBuyLandPopup(false)">不要</button>
        </div>
      </div>
    </BaseDialog>

    <transition name="toast-fade">
      <div v-if="game.toastMessage" class="toast">{{ game.toastMessage }}</div>
    </transition>
  </div>
</template>

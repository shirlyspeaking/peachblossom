<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
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

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  if (game.rulesModalOpen) {
    game.rulesModalOpen = false
  } else if (game.medalModal.open) {
    game.closeMedalPopup()
  } else if (game.buyLandModal.open) {
    game.closeBuyLandPopup(false)
  } else if (game.boardPresetPopoverOpen) {
    game.boardPresetPopoverOpen = false
  }
}

const pawnPositions = computed(() =>
  game.tiles.map((tile) =>
    game.state.game.players
      .map((player, index) => ({ position: player.position, playerNumber: index + 1 }))
      .filter((item) => item.position === tile.index)
      .map((item) => item.playerNumber),
  ),
)

const recentTurnLog = computed(() => game.state.game.turnLog.slice(-30))
const activePlayer = computed(() => game.currentPlayer)
const ownedTileCount = computed(() => game.state.tiles.filter((tile) => tile.owner !== null).length)
const networkSummary = computed(() => (game.online.mode ? '雲端同步中' : '本機遊玩中'))

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
      <div class="topbar__title">
        <p class="eyebrow">桃花源劇本桌遊</p>
        <h1>桃源萬象大富翁</h1>
        <p class="topbar__desc">
          以山海經為第一個劇本的可擴充大富翁遊戲，未來可延展成更多中國古代故事與地圖。
        </p>
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

    <section class="hero-panel">
      <div class="hero-panel__intro">
        <h2>多檔案、可維護、可擴充</h2>
        <p>
          這個版本把原本單一 HTML 中混雜的棋盤編輯、卡片管理、遊戲流程、線上房間與登入收藏，
          拆分為 composables、components、config、types 與 utils。
        </p>
      </div>

      <div class="hero-panel__meta">
        <div class="meta-chip">
          <span class="meta-chip__label">目前回合</span>
          <strong>{{ game.currentTurnLabel }}</strong>
        </div>
        <div class="meta-chip" v-if="game.online.mode">
          <span class="meta-chip__label">線上房間</span>
          <strong>{{ game.onlineStatusText }}</strong>
        </div>
      </div>
    </section>

    <section class="story-strip">
      <article class="story-card">
        <span class="story-card__label">當前劇本</span>
        <strong>山海經 · 巡遊山海</strong>
        <p>保留現有地圖與卡牌編輯，同時把底層改造成可再擴充更多古代故事劇本的前端架構。</p>
      </article>
      <article class="story-card">
        <span class="story-card__label">遊戲節奏</span>
        <strong>{{ networkSummary }}</strong>
        <p>已佔領 {{ ownedTileCount }} 塊地，{{ game.state.game.playerCount }} 位玩家共同巡遊棋盤。</p>
      </article>
      <article class="story-card" v-if="activePlayer">
        <span class="story-card__label">行動中角色</span>
        <strong>{{ game.titleForPlayer(game.state.game.currentPlayerIndex) }}</strong>
        <p>目前持有 {{ activePlayer.money }} 金幣，停留在第 {{ activePlayer.position + 1 }} 格。</p>
      </article>
    </section>

    <section class="online-panel">
      <div>
        <h3>線上對戰（Google 登入）</h3>
        <p class="panel-note">沿用既有 `auth.peachspring.cc` 房間 API，新前端只重構呼叫方式，不改動舊版後端。</p>
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

    <main class="workspace-grid">
      <section class="board-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Board</p>
            <h2>巡遊棋盤</h2>
            <p class="panel-note">左側保留回合節奏與玩家金幣，右側專注於劇本規則與卡片編排。</p>
          </div>
          <div class="panel-actions">
            <button type="button" class="secondary-btn" @click="game.rulesModalOpen = true">規則</button>
            <button type="button" class="secondary-btn" @click="game.restartGameSession">重新開始</button>
            <button type="button" class="danger-btn" @click="game.resetToDefault">重設預設</button>
          </div>
        </div>

        <div class="board-scroll">
          <div class="board-grid">
            <BoardTile
              v-for="(tile, index) in game.tiles"
              :key="index"
              :tile="tile"
              :index="index"
              :row="tile.row"
              :col="tile.col"
              :meta="tile.meta"
              :disabled="!game.canEditBoardAndCards"
              :pawns="pawnPositions[index]"
              @update-field="game.updateTileField"
            />

            <section class="board-center">
              <div class="board-center__block">
                <p class="eyebrow">Players</p>
                <div class="inline-field">
                  <span>遊玩人數</span>
                  <select
                    :value="game.state.game.playerCount"
                    :disabled="game.online.mode"
                    @change="game.setPlayerCount(Number(($event.target as HTMLSelectElement).value))"
                  >
                    <option v-for="count in [2, 3, 4, 5, 6]" :key="count" :value="count">{{ count }} 人</option>
                  </select>
                </div>

                <div class="player-list">
                  <article
                    v-for="(player, index) in game.state.game.players"
                    :key="player.id"
                    class="player-card"
                    :class="{ 'player-card--active': index === game.state.game.currentPlayerIndex }"
                  >
                    <div class="player-card__identity">
                      <span class="player-token" :style="{ background: PLAYER_COLORS[index % PLAYER_COLORS.length] }">
                        {{ game.playerAnimal(index) }}
                      </span>
                      <div>
                        <strong>{{ game.titleForPlayer(index) }}</strong>
                        <p>{{ game.statusForPlayer(index) }}</p>
                      </div>
                    </div>

                    <label class="inline-field inline-field--stacked">
                      <span>金幣</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        :disabled="!game.canEditPlayerMoney(index)"
                        :value="player.money"
                        @change="game.updatePlayerMoney(index, Number(($event.target as HTMLInputElement).value))"
                      />
                    </label>
                  </article>
                </div>
              </div>

              <div class="board-center__block board-center__block--dice">
                <p class="eyebrow">Dice</p>
                <div class="dice-shell" :class="{ 'dice-shell--rolling': game.isRolling }">
                  <span class="dice-shell__emoji">🎲</span>
                  <strong>{{ game.diceValue }}</strong>
                </div>
                <button type="button" class="primary-btn primary-btn--wide" :disabled="game.isRolling" @click="game.rollDice">
                  擲骰
                </button>
                <div class="draw-actions">
                  <button type="button" class="secondary-btn" @click="game.drawCard('chance')">抽機會卡</button>
                  <button type="button" class="secondary-btn" @click="game.drawCard('fate')">抽命運卡</button>
                </div>
              </div>

              <div class="board-center__block">
                <p class="eyebrow">Turn Log</p>
                <div class="turn-log">
                  <p v-for="(line, index) in recentTurnLog" :key="`${index}-${line}`">{{ line }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <aside class="side-panel">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Scenario</p>
              <h2>劇本導覽</h2>
            </div>
          </div>

          <div class="scenario-list">
            <article class="scenario-item">
              <strong>本局目標</strong>
              <p>用可編輯的規則、地圖與卡片，快速拼出適合課堂或同樂的桌遊版本。</p>
            </article>
            <article class="scenario-item">
              <strong>重構方向</strong>
              <p>Pinia 管狀態、Vitest 驗證核心規則、Playwright 做基本端對端煙霧測試。</p>
            </article>
            <article class="scenario-item">
              <strong>建議流程</strong>
              <p>先調整地塊與規則，再設定卡牌內容，最後建立房間讓不同玩家進入各自座位。</p>
            </article>
          </div>
        </section>

        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Rules</p>
              <h2>基本規則與收藏</h2>
            </div>
            <button type="button" class="secondary-btn" @click="game.boardPresetPopoverOpen = !game.boardPresetPopoverOpen">
              棋盤收藏
            </button>
          </div>

          <textarea
            class="rules-textarea"
            :disabled="!game.canEditBoardAndCards"
            :value="game.state.rulesText"
            @input="game.syncRulesText(($event.target as HTMLTextAreaElement).value)"
          />

          <div v-if="game.boardPresetPopoverOpen" class="preset-panel">
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
        </section>

        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Cards</p>
              <h2>卡片設置</h2>
            </div>
            <button type="button" class="secondary-btn" @click="game.cardsDrawerCollapsed = !game.cardsDrawerCollapsed">
              {{ game.cardsDrawerCollapsed ? '展開' : '收合' }}
            </button>
          </div>

          <div v-if="!game.cardsDrawerCollapsed" class="cards-grid">
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
        </section>
      </aside>
    </main>

    <BaseDialog :open="game.rulesModalOpen" title="基本規則" width="wide" @close="game.rulesModalOpen = false">
      <textarea
        class="rules-textarea rules-textarea--dialog"
        :disabled="!game.canEditBoardAndCards"
        :value="game.state.rulesText"
        @input="game.syncRulesText(($event.target as HTMLTextAreaElement).value)"
      />
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

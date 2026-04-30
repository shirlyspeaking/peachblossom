<script setup lang="ts">
import MonopolyScene from './components/MonopolyScene.vue'
import { PLAYER_COLORS } from './config/game'
import { useMonopolyGame } from './composables/useMonopolyGame'

const game = useMonopolyGame()
</script>

<template>
  <main class="app-shell">
    <section class="hero-panel">
      <div class="hero-panel__copy">
        <p class="eyebrow">Three.js tabletop prototype</p>
        <h1>山海浮島大富翁 3D</h1>
        <p>
          把原本的山海經大富翁重構成可旋視的 3D 桌遊棋盤：浮島地塊、神獸棋子、立體骰子與抽牌事件都集中在同一張數位沙盤上。
        </p>
      </div>

      <div class="hero-panel__actions">
        <a class="link-pill" href="../index.html">回桃花源</a>
        <a class="link-pill link-pill--quiet" href="../shanhaijing-monopoly-vue/index.html">查看 Vue 版</a>
      </div>
    </section>

    <section class="game-layout">
      <div class="board-stage">
        <MonopolyScene
          :tiles="game.tiles.value"
          :players="game.state.value.game.players"
          :current-player-index="game.state.value.game.currentPlayerIndex"
          :selected-tile-index="game.selectedTileIndex.value"
          :dice-value="game.diceValue.value"
          :is-rolling="game.isRolling.value"
          @select-tile="game.selectedTileIndex.value = $event"
        />
        <div class="stage-caption">
          <strong>{{ game.currentTurnLabel.value }}</strong>
          <span>點擊任一浮島地塊可查看名稱、類型與持有者。</span>
        </div>
      </div>

      <aside class="control-panel">
        <section class="panel-section panel-section--dice">
          <p class="eyebrow">Dice</p>
          <div class="dice-readout" :class="{ 'dice-readout--rolling': game.isRolling.value }">
            <span>🎲</span>
            <strong>{{ game.diceValue.value }}</strong>
          </div>
          <button class="primary-btn" type="button" :disabled="game.isRolling.value" @click="game.rollDice">
            {{ game.isRolling.value ? '浮島迴響中...' : '擲出靈骰' }}
          </button>
        </section>

        <section class="panel-section">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Players</p>
              <h2>神獸棋子</h2>
            </div>
            <label class="select-field">
              <span>人數</span>
              <select
                :value="game.state.value.game.playerCount"
                @change="game.setPlayerCount(Number(($event.target as HTMLSelectElement).value))"
              >
                <option v-for="count in [2, 3, 4, 5, 6]" :key="count" :value="count">{{ count }}</option>
              </select>
            </label>
          </div>

          <div class="player-list">
            <article
              v-for="(player, index) in game.state.value.game.players"
              :key="player.id"
              class="player-card"
              :class="{ 'player-card--active': index === game.state.value.game.currentPlayerIndex }"
            >
              <span class="player-token" :style="{ background: PLAYER_COLORS[index % PLAYER_COLORS.length] }">
                {{ game.playerAnimal(index) }}
              </span>
              <div>
                <strong>{{ game.playerTitle(index) }}</strong>
                <p>{{ player.money }} 金幣 · 第 {{ player.position + 1 }} 格</p>
              </div>
            </article>
          </div>
        </section>

        <section class="panel-section selected-tile">
          <p class="eyebrow">Selected island</p>
          <template v-if="game.selectedTile.value">
            <h2>{{ game.selectedTile.value.label }}</h2>
            <p>{{ game.selectedTile.value.meta.legend }} · {{ game.selectedTile.value.effect }}</p>
            <small>
              {{
                game.selectedTile.value.owner === null
                  ? '尚未被任何玩家持有'
                  : `由 ${game.playerTitle(game.selectedTile.value.owner)} 持有`
              }}
            </small>
          </template>
          <template v-else>
            <h2>尚未選取地塊</h2>
            <p>點擊棋盤上的浮島，或擲骰後查看棋子抵達的位置。</p>
          </template>
        </section>

        <section class="panel-section">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Turn log</p>
              <h2>巡遊紀錄</h2>
            </div>
            <div class="panel-actions">
              <button class="ghost-btn" type="button" @click="game.restartGameSession">重開</button>
              <button class="ghost-btn ghost-btn--danger" type="button" @click="game.resetToDefault">重設</button>
            </div>
          </div>

          <div class="turn-log">
            <p v-for="line in game.recentTurnLog.value" :key="line">{{ line }}</p>
          </div>
        </section>
      </aside>
    </section>

    <section class="rules-panel">
      <p class="eyebrow">Rules</p>
      <p>{{ game.state.value.rulesText }}</p>
    </section>

    <div v-if="game.cardModal.open" class="modal-backdrop" @click.self="game.closeCard">
      <article class="modal-card">
        <p class="eyebrow">{{ game.cardModal.type === 'chance' ? '機會卡' : '命運卡' }}</p>
        <h2>{{ game.cardModal.title }}</h2>
        <p>{{ game.cardModal.body }}</p>
        <button class="primary-btn" type="button" @click="game.closeCard">繼續巡遊</button>
      </article>
    </div>

    <div v-if="game.buyLandModal.open" class="modal-backdrop" @click.self="game.closeBuyLand(false)">
      <article class="modal-card">
        <p class="eyebrow">Purchase</p>
        <h2>{{ game.buyLandModal.title }}</h2>
        <p>{{ game.buyLandModal.body }}</p>
        <div class="modal-actions">
          <button class="primary-btn" type="button" @click="game.closeBuyLand(true)">買下秘境</button>
          <button class="ghost-btn" type="button" @click="game.closeBuyLand(false)">先不買</button>
        </div>
      </article>
    </div>

    <transition name="toast-fade">
      <div v-if="game.toastMessage.value" class="toast">{{ game.toastMessage.value }}</div>
    </transition>
  </main>
</template>

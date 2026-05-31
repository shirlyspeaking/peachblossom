<script setup lang="ts">
import { computed } from 'vue'
import { PLAYER_COLORS } from '../config/game'
import { playerAnimal, themeGradientForTileLabel } from '../utils/game'
import type { Tile, TileMeta } from '../types/game'

const props = defineProps<{
  tile: Tile
  index: number
  row: number
  col: number
  meta: TileMeta
  disabled: boolean
  playMode?: boolean
  pawns: { playerNumber: number; label: string }[]
}>()

const emit = defineEmits<{
  updateField: [index: number, field: 'label' | 'effect', value: string]
}>()

const tileStyle = computed(() => ({
  gridRow: props.row,
  gridColumn: props.col,
  background: themeGradientForTileLabel(props.tile.label) || undefined,
}))
</script>

<template>
  <article class="board-tile" :class="tile.type" :style="tileStyle">
    <header class="board-tile__header">
      <span class="board-tile__icon">{{ meta.icon }}</span>
      <span class="board-tile__label">{{ tile.label }}</span>
      <span class="board-tile__num">{{ index + 1 }}</span>
    </header>

    <template v-if="playMode">
      <p v-if="tile.effect" class="board-tile__effect">{{ tile.effect }}</p>
    </template>
    <template v-else>
      <input
        class="board-tile__input"
        :disabled="disabled"
        :value="tile.label"
        placeholder="格名"
        @input="emit('updateField', index, 'label', ($event.target as HTMLInputElement).value)"
      />

      <input
        class="board-tile__input"
        :disabled="disabled"
        :value="tile.effect"
        placeholder="效果說明"
        @input="emit('updateField', index, 'effect', ($event.target as HTMLInputElement).value)"
      />
    </template>

    <div v-if="tile.owner !== null" class="board-tile__owner" :style="{ color: PLAYER_COLORS[tile.owner % PLAYER_COLORS.length] }">
      已由玩家 {{ tile.owner + 1 }} 持有
    </div>

    <div class="board-tile__pawns">
      <div
        v-for="pawn in pawns"
        :key="pawn.playerNumber"
        class="board-tile__pawn-unit"
      >
        <span
          class="board-tile__pawn"
          :style="{ background: PLAYER_COLORS[(pawn.playerNumber - 1) % PLAYER_COLORS.length] }"
        >
          {{ playerAnimal(pawn.playerNumber - 1) }}
        </span>
        <span class="board-tile__pawn-name">{{ pawn.label }}</span>
      </div>
    </div>
  </article>
</template>

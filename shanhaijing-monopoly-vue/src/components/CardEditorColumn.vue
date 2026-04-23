<script setup lang="ts">
import type { CardItem } from '../types/game'

defineProps<{
  title: string
  emoji: string
  accentClass: string
  cards: CardItem[]
  type: 'chance' | 'fate'
  disabled: boolean
}>()

const emit = defineEmits<{
  add: [type: 'chance' | 'fate']
  update: [type: 'chance' | 'fate', index: number, field: 'title' | 'content', value: string]
  delete: [type: 'chance' | 'fate', index: number]
}>()
</script>

<template>
  <section class="card-column">
    <header class="card-column__header">
      <h3 :class="['card-column__title', accentClass]">{{ emoji }} {{ title }}</h3>
      <span class="card-column__count">{{ cards.length }} 張</span>
    </header>

    <div class="card-column__list">
      <article v-for="(card, index) in cards" :key="`${type}-${index}`" class="card-editor">
        <div class="card-editor__top">
          <strong>{{ title }} #{{ index + 1 }}</strong>
          <button type="button" class="icon-btn" :disabled="disabled" @click="emit('delete', type, index)">✕</button>
        </div>
        <input
          class="card-editor__input"
          :disabled="disabled"
          :value="card.title"
          placeholder="卡片標題"
          @input="emit('update', type, index, 'title', ($event.target as HTMLInputElement).value)"
        />
        <textarea
          class="card-editor__textarea"
          :disabled="disabled"
          :value="card.content"
          placeholder="卡片效果內容"
          @input="emit('update', type, index, 'content', ($event.target as HTMLTextAreaElement).value)"
        />
      </article>
    </div>

    <button type="button" class="secondary-btn" :disabled="disabled" @click="emit('add', type)">
      ＋ 新增一張{{ title }}
    </button>
  </section>
</template>

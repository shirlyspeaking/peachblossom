<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  width?: 'narrow' | 'medium' | 'wide'
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-root" role="dialog" aria-modal="true" :aria-label="title">
      <div class="dialog-backdrop" @click="emit('close')" />
      <div class="dialog-panel" :class="`dialog-panel--${width ?? 'medium'}`">
        <header class="dialog-header">
          <h2>{{ title }}</h2>
          <button type="button" class="icon-btn" aria-label="關閉" @click="emit('close')">✕</button>
        </header>
        <div class="dialog-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

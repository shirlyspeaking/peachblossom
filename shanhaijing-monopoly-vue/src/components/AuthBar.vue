<script setup lang="ts">
import type { AuthUser } from '../types/game'

defineProps<{
  status: 'loading' | 'authenticated' | 'guest' | 'error'
  user: AuthUser | null | undefined
  error?: string
}>()

const emit = defineEmits<{
  login: []
  logout: []
  retry: []
}>()
</script>

<template>
  <div class="auth-bar" aria-live="polite">
    <template v-if="status === 'loading'">
      <span class="auth-text">登入狀態檢查中…</span>
    </template>

    <template v-else-if="status === 'authenticated' && user">
      <span class="auth-text" :title="user.email">{{ user.email }}</span>
      <button type="button" class="pill-btn pill-btn--ghost" @click="emit('logout')">登出</button>
    </template>

    <template v-else-if="status === 'error'">
      <span class="auth-text auth-text--warn">無法連線至登入服務（{{ error || '連線失敗' }}）</span>
      <button type="button" class="pill-btn" @click="emit('retry')">重試</button>
    </template>

    <template v-else>
      <button type="button" class="pill-btn" @click="emit('login')">登入</button>
    </template>
  </div>
</template>

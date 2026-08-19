<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Experience as ExperienceType, FrameState, JadeInfo } from './experience/Experience'
import { WindAudio } from './experience/WindAudio'

const canvas = ref<HTMLCanvasElement | null>(null)
const webglOk = ref(true)
const soundOn = ref(false)
const hoverJade = ref<JadeInfo | null>(null)
const frame = ref<FrameState>({
  progress: 0,
  chapter: '冰屋',
  verse: '北冥冰封。屋從雪裡長出來，縫裡有光。',
  beastName: '',
  beastLine: '',
  hint: 'Scroll down to discover',
  jades: [],
})

let experience: ExperienceType | null = null
const wind = new WindAudio()

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

function onScroll(): void {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const t = max <= 0 ? 0 : window.scrollY / max
  experience?.setScrollTarget(t)
}

function onPointer(event: PointerEvent): void {
  const nx = (event.clientX / window.innerWidth) * 2 - 1
  const ny = -(event.clientY / window.innerHeight) * 2 + 1
  experience?.setPointer(nx, ny)
}

function onClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('a, button')) return
  const jade = experience?.pickJade()
  if (jade) {
    window.location.assign(jade.href)
  }
}

function onResize(): void {
  experience?.resize()
}

async function toggleSound(): Promise<void> {
  soundOn.value = await wind.toggle()
}

onMounted(async () => {
  webglOk.value = supportsWebGL()
  if (!webglOk.value || !canvas.value) return

  try {
    const { Experience } = await import('./experience/Experience')
    experience = new Experience(canvas.value, {
      onFrame: (state) => {
        frame.value = state
      },
      onJadeHover: (jade) => {
        hoverJade.value = jade
        document.body.style.cursor = jade ? 'pointer' : ''
      },
    })
  } catch (error) {
    console.error(error)
    webglOk.value = false
    return
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('click', onClick)
  window.addEventListener('resize', onResize)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('click', onClick)
  window.removeEventListener('resize', onResize)
  wind.stop()
  experience?.dispose()
  document.body.style.cursor = ''
})
</script>

<template>
  <canvas v-if="webglOk" ref="canvas" class="webgl" aria-hidden="true"></canvas>
  <div v-if="webglOk" class="grain" aria-hidden="true"></div>
  <div v-if="webglOk" class="scroll-spacer" aria-hidden="true"></div>

  <div v-if="webglOk" class="hud">
    <header class="brand">
      <h1>山海經</h1>
      <p>// Copyright · 北冥冰屋 / Peachblossom</p>
    </header>

    <aside class="manifesto">
      <small>////// {{ frame.chapter }}</small>
      <p>{{ frame.verse }}</p>
    </aside>

    <p class="chapter">{{ frame.chapter }}</p>

    <div v-if="frame.beastName" class="beast-card">
      <strong>{{ frame.beastName }}</strong>
      <span>{{ frame.beastLine }}</span>
    </div>

    <div class="dock">
      <p class="hint">{{ frame.hint }} <em>{{ String(Math.round(frame.progress * 100)).padStart(2, '0') }}</em></p>
      <div class="controls">
        <button class="ghost" type="button" @click.stop="toggleSound">
          Sound: {{ soundOn ? 'On' : 'Off' }}
        </button>
        <a class="ghost" href="../index.html">回桃花源</a>
      </div>
    </div>

    <div class="progress" aria-hidden="true">
      <span :style="{ width: `${frame.progress * 100}%` }"></span>
    </div>
  </div>

  <div
    v-for="item in frame.jades"
    :key="item.jade.id"
    class="jade-label"
    :class="{ 'is-on': item.visible }"
    :style="{ left: `${item.x}px`, top: `${item.y}px` }"
  >
    <strong>{{ item.jade.name }}</strong>
    <span>{{ item.jade.hint }}</span>
  </div>

  <div v-if="hoverJade" class="hover-card">點入 · {{ hoverJade.name }}</div>

  <section v-if="!webglOk" class="fallback">
    <h1>山海經</h1>
    <p>此頁需要 WebGL。你仍可從下方冰塊進入既有的山海應用。</p>
    <nav>
      <a class="ghost" href="../shanhai-jing-escape/index.html">山海密室</a>
      <a class="ghost" href="../taoyuan-wanxiang-monopoly/">山海經大富翁</a>
      <a class="ghost" href="../shanhaijing-monopoly-3d/">山海浮島</a>
      <a class="ghost" href="../index.html">回桃花源</a>
    </nav>
  </section>
</template>

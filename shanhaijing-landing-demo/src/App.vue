<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Experience as ExperienceType, FrameState, JadeInfo } from './experience/Experience'
import { PANGU_CLASSIC } from './experience/createPangu'
import { BurstAudio } from './experience/BurstAudio'
import { WindAudio } from './experience/WindAudio'

const canvas = ref<HTMLCanvasElement | null>(null)
const webglOk = ref(true)
const soundOn = ref(false)
const hoverJade = ref<JadeInfo | null>(null)
const typed = ref('')
const typedDone = ref(false)
const reducedMotion = ref(false)
const frame = ref<FrameState>({
  progress: 0,
  chapter: '冰屋',
  verse: '北冥冰封。屋從雪裡長出來，縫裡有光。',
  beastName: '',
  beastLine: '',
  hint: 'Scroll down to discover',
  jades: [],
  panguSheet: false,
  panguBurst: false,
})

let experience: ExperienceType | null = null
let typeTimer: number | null = null
const wind = new WindAudio()
const burst = new BurstAudio()

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

function onScroll(): void {
  burst.unlock()
  const max = document.documentElement.scrollHeight - window.innerHeight
  const t = max <= 0 ? 0 : window.scrollY / max
  experience?.setScrollTarget(t)
}

function onPointerDown(): void {
  burst.unlock()
}

function onPointer(event: PointerEvent): void {
  burst.unlock()
  const nx = (event.clientX / window.innerWidth) * 2 - 1
  const ny = -(event.clientY / window.innerHeight) * 2 + 1
  experience?.setPointer(nx, ny)
}

function onClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('a, button, .pangu-sheet')) return
  const jade = experience?.pickJade()
  if (jade) {
    window.location.assign(jade.href)
  }
}

function onResize(): void {
  experience?.resize()
}

async function toggleSound(): Promise<void> {
  burst.unlock()
  soundOn.value = await wind.toggle()
}

function stopType(): void {
  if (typeTimer !== null) {
    window.clearInterval(typeTimer)
    typeTimer = null
  }
}

const PANGU_READING =
  'https://taixu.app/judou/reading/4333e22d-b726-4cbb-9f5a-31b419644f99'

function revealAll(): void {
  typed.value = PANGU_CLASSIC
  typedDone.value = true
  stopType()
}

function onPanguSheetClick(): void {
  if (!typedDone.value) {
    revealAll()
    return
  }
  window.location.assign(PANGU_READING)
}

function startType(): void {
  if (typedDone.value || typeTimer !== null) return
  if (reducedMotion.value) {
    revealAll()
    return
  }
  typeTimer = window.setInterval(() => {
    if (typed.value.length >= PANGU_CLASSIC.length) {
      revealAll()
      return
    }
    typed.value = PANGU_CLASSIC.slice(0, typed.value.length + 1)
  }, 58)
}

watch(
  () => frame.value.panguSheet,
  (open) => {
    if (open) startType()
    else stopType()
  },
)

watch(
  () => frame.value.panguBurst,
  (bursting) => {
    if (bursting && !reducedMotion.value) burst.play()
  },
)

onMounted(async () => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  webglOk.value = supportsWebGL()
  const canvasEl = canvas.value
  if (!webglOk.value || !canvasEl) return

  try {
    const { Experience } = await import('./experience/Experience')
    const liveCanvas = canvas.value
    if (!liveCanvas?.isConnected) return
    experience?.dispose()
    experience = new Experience(liveCanvas, {
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
    if (canvas.value?.isConnected) webglOk.value = false
    return
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('click', onClick)
  window.addEventListener('resize', onResize)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('click', onClick)
  window.removeEventListener('resize', onResize)
  stopType()
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

    <div v-if="frame.beastName" class="beast-card" :class="{ 'is-pangu': frame.chapter === '盤古' }">
      <strong>{{ frame.beastName }}</strong>
      <span>{{ frame.beastLine }}</span>
    </div>

    <article
      class="pangu-sheet"
      :class="{ 'is-on': frame.panguSheet }"
      :aria-hidden="!frame.panguSheet"
      @click.stop="onPanguSheetClick"
    >
      <p class="pangu-sheet-title">《盤古開天地》</p>
      <p class="pangu-sheet-body">
        <span>{{ typed }}</span>
        <em v-if="frame.panguSheet && !typedDone" class="pangu-caret" aria-hidden="true"></em>
      </p>
      <p v-if="frame.panguSheet && !typedDone" class="pangu-sheet-hint">點一下顯示全文</p>
      <p v-else-if="frame.panguSheet" class="pangu-sheet-hint">點一下進入句讀</p>
    </article>

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

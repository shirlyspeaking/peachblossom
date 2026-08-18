import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import {
  createBrokenPeak,
  createDragonBeast,
  createFoxBeast,
  createKunBeast,
  createPengBeast,
  tickBeasts,
} from './createBeasts'
import { createCloudField, tickClouds } from './createClouds'
import { createIsland } from './createIsland'
import { createRelics, JADES, tickRelics, type JadeInfo } from './createJadeGallery'
import { createMountains } from './createMountains'
import { clamp, damp, lerp, smoothstep } from './math'

export type { JadeInfo }

export type ScreenJade = {
  jade: JadeInfo
  x: number
  y: number
  visible: boolean
}

export type FrameState = {
  progress: number
  chapter: string
  verse: string
  beastName: string
  beastLine: string
  hint: string
  jades: ScreenJade[]
}

type Hooks = {
  onFrame: (state: FrameState) => void
  onJadeHover: (jade: JadeInfo | null) => void
}

const STORY = [
  {
    until: 0.14,
    name: '冰屋',
    verse: '北冥冰封。屋從雪裡長出來，縫裡有光。',
    beastName: '',
    beastLine: '',
    hint: 'Scroll down to discover',
  },
  {
    until: 0.26,
    name: '裂冰',
    verse: '下捲入海。冰面裂開，北冥在腳下。',
    beastName: '',
    beastLine: '',
    hint: 'Through the ice',
  },
  {
    until: 0.46,
    name: '鯤',
    verse: '北冥有魚，其名為鯤。鯤之大，不知其幾千里也。',
    beastName: '鯤',
    beastLine: '從冰海深處游來',
    hint: 'A fish named Kun',
  },
  {
    until: 0.64,
    name: '鵬',
    verse: '化而為鳥，其名為鵬。翼若垂天之雲。',
    beastName: '鵬',
    beastLine: '破冰升空',
    hint: 'Then it becomes a bird',
  },
  {
    until: 0.8,
    name: '應龍',
    verse: '不周既折，應龍盤於缺處。天柱折，地維絕。',
    beastName: '應龍',
    beastLine: '盤據不周之折',
    hint: 'The broken mountain',
  },
  {
    until: 0.92,
    name: '九尾',
    verse: '青丘之山，有獸焉，其狀如狐而九尾。',
    beastName: '九尾狐',
    beastLine: '青丘來客',
    hint: 'Nine tails in the snow',
  },
  {
    until: 1,
    name: '北冥',
    verse: '卷未盡。神獸過後，冰裡還封著路。',
    beastName: '',
    beastLine: '',
    hint: 'The north sea does not end',
  },
]

export class Experience {
  readonly renderer: THREE.WebGLRenderer
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(38, 1, 0.1, 360)
  readonly reduced: boolean

  private readonly hooks: Hooks
  private lastTime = performance.now()
  private readonly pointer = new THREE.Vector2()
  private readonly raycaster = new THREE.Raycaster()
  private readonly posCurve: THREE.CatmullRomCurve3
  private readonly lookCurve: THREE.CatmullRomCurve3
  private readonly targetPos = new THREE.Vector3()
  private readonly targetLook = new THREE.Vector3()
  private readonly lookAt = new THREE.Vector3()
  private readonly fogColor = new THREE.Color(0xc5cad3)
  private readonly mistNear = new THREE.Color(0xc5cad3)
  private readonly mistFar = new THREE.Color(0x9aa6b4)
  private readonly jadeMeshes: THREE.Mesh[]
  private readonly island: THREE.Group
  private readonly clouds: THREE.Group
  private readonly kun: THREE.Group
  private readonly peng: THREE.Group
  private readonly dragon: THREE.Group
  private readonly fox: THREE.Group
  private readonly peak: THREE.Group
  private readonly dust: THREE.Points
  private readonly dustBase: Float32Array
  private readonly hoverScale = new THREE.Vector3()
  private composer: EffectComposer | null = null
  private bloom: UnrealBloomPass | null = null
  private scrollTarget = 0
  private scrollCurrent = 0
  private hoverJade: JadeInfo | null = null
  private raf = 0
  private disposed = false

  constructor(canvas: HTMLCanvasElement, hooks: Hooks) {
    this.hooks = hooks
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.35 : 1.75))
    this.renderer.setClearColor(0xc5cad3, 1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08

    this.scene.fog = new THREE.Fog(this.fogColor, 12, 58)
    this.scene.background = this.fogColor
    this.camera.position.set(8.2, 5.6, 13.5)

    this.posCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8.2, 5.6, 13.5),
      new THREE.Vector3(4.2, 4.2, 8),
      new THREE.Vector3(0.6, 2.8, -10),
      new THREE.Vector3(-4, 4.6, -38),
      new THREE.Vector3(-8, 6.5, -46),
      new THREE.Vector3(-7, 6.8, -50),
      new THREE.Vector3(-4, 7, -54),
      new THREE.Vector3(3, 12, -88),
      new THREE.Vector3(1, 16, -98),
      new THREE.Vector3(8, 8.5, -132),
      new THREE.Vector3(7, 7, -142),
      new THREE.Vector3(-3, 5, -170),
      new THREE.Vector3(1, 4.6, -178),
      new THREE.Vector3(0, 5.6, -220),
    ])
    this.lookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.6, 0.4),
      new THREE.Vector3(0, 2.5, 0),
      new THREE.Vector3(0, 1.4, -28),
      new THREE.Vector3(4, 2.6, -60),
      new THREE.Vector3(8, 2.5, -66),
      new THREE.Vector3(10, 2.5, -68),
      new THREE.Vector3(14, 2.6, -70),
      new THREE.Vector3(0, 18, -108),
      new THREE.Vector3(0, 20, -110),
      new THREE.Vector3(0, 6.5, -150),
      new THREE.Vector3(0, 6, -150),
      new THREE.Vector3(3.2, 2.5, -186),
      new THREE.Vector3(3.2, 2.3, -186),
      new THREE.Vector3(0, 3.2, -240),
    ])

    this.addLights()
    this.scene.add(createMountains())
    this.island = createIsland()
    this.island.scale.setScalar(1.35)
    this.scene.add(this.island)
    this.clouds = createCloudField(isMobile)
    this.scene.add(this.clouds)

    this.kun = createKunBeast()
    this.peng = createPengBeast()
    this.dragon = createDragonBeast()
    this.fox = createFoxBeast()
    this.peak = createBrokenPeak()
    this.scene.add(this.kun, this.peng, this.dragon, this.fox, this.peak)

    const relics = createRelics()
    this.jadeMeshes = relics.meshes
    this.scene.add(relics.group)

    const dustCount = isMobile ? 420 : 1100
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 80
      dustPositions[i * 3 + 1] = Math.random() * 28
      dustPositions[i * 3 + 2] = -250 + Math.random() * 280
    }
    this.dustBase = dustPositions.slice()
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    this.dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xe8f0f8,
        size: 0.055,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    )
    this.scene.add(this.dust)

    if (!this.reduced) {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.4, 0.92)
      this.composer.addPass(this.bloom)
      this.composer.addPass(new OutputPass())
    }

    this.resize()
    this.tick()
  }

  setScrollTarget(value: number): void {
    this.scrollTarget = clamp(value, 0, 1)
  }

  setPointer(nx: number, ny: number): void {
    this.pointer.set(nx, ny)
  }

  pickJade(): JadeInfo | null {
    if (this.scrollCurrent < 0.86) return null
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.jadeMeshes, false)
    const jade = hits[0]?.object.userData.jade as JadeInfo | undefined
    return jade ?? null
  }

  resize(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    this.camera.aspect = width / Math.max(height, 1)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.composer?.setSize(width, height)
    this.bloom?.setSize(width, height)
  }

  dispose(): void {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.composer?.dispose()
    this.renderer.dispose()
  }

  private addLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xe8eef5, 0x7d8692, 1.05))
    const sun = new THREE.DirectionalLight(0xf3f7fb, 1.2)
    sun.position.set(14, 22, 9)
    this.scene.add(sun)
    const fill = new THREE.DirectionalLight(0xb7c6d6, 0.5)
    fill.position.set(-11, 8, -40)
    this.scene.add(fill)
  }

  private tick = (): void => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.tick)

    const now = performance.now()
    const dt = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now
    const time = now / 1000
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    this.scrollTarget = maxScroll <= 0 ? 0 : clamp(window.scrollY / maxScroll, 0, 1)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.scrollCurrent = reducedMotion
      ? this.scrollTarget
      : damp(this.scrollCurrent, this.scrollTarget, 2.4, dt)

    const t = this.scrollCurrent
    this.posCurve.getPointAt(t, this.targetPos)
    this.lookCurve.getPointAt(t, this.targetLook)

    const parallax = reducedMotion ? 0 : 0.9 * (1 - t * 0.4)
    this.targetPos.x += this.pointer.x * parallax
    this.targetPos.y += this.pointer.y * parallax * 0.4

    this.camera.position.lerp(this.targetPos, reducedMotion ? 1 : 1 - Math.exp(-2.8 * dt))
    this.lookAt.lerp(this.targetLook, reducedMotion ? 1 : 1 - Math.exp(-2.6 * dt))
    this.camera.lookAt(this.lookAt)

    this.fogColor.copy(this.mistNear).lerp(this.mistFar, smoothstep(0.2, 0.85, t))
    const fog = this.scene.fog as THREE.Fog
    fog.color.copy(this.fogColor)
    fog.near = lerp(12, 8, t)
    fog.far = lerp(48, 78, Math.sin(t * Math.PI) * 0.85 + 0.15)

    const houseFade = 1 - smoothstep(0.16, 0.3, t)
    this.island.visible = houseFade > 0.04
    this.island.scale.setScalar(1.35 * (0.7 + houseFade * 0.3))

    if (!reducedMotion) {
      tickClouds(this.clouds, time, dt)
      tickBeasts(this.kun, this.peng, this.dragon, this.fox, this.peak, t, time)
      tickRelics(this.jadeMeshes, t)
      this.tickDust(time)
    } else {
      tickBeasts(this.kun, this.peng, this.dragon, this.fox, this.peak, t, 0)
      tickRelics(this.jadeMeshes, t)
    }

    this.updateJadeHover()
    const story = STORY.find((item) => t <= item.until) ?? STORY[STORY.length - 1]
    this.hooks.onFrame({
      progress: t,
      chapter: story?.name ?? '北冥',
      verse: story?.verse ?? '',
      beastName: story?.beastName ?? '',
      beastLine: story?.beastLine ?? '',
      hint: story?.hint ?? '',
      jades: this.projectJades(),
    })

    if (this.composer) this.composer.render()
    else this.renderer.render(this.scene, this.camera)
  }

  private tickDust(time: number): void {
    const pos = this.dust.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const bx = this.dustBase[i * 3] ?? 0
      const by = this.dustBase[i * 3 + 1] ?? 0
      const bz = this.dustBase[i * 3 + 2] ?? 0
      pos.setX(i, bx + Math.sin(time * 0.18 + i) * 0.28)
      pos.setY(i, ((by - time * 0.62) % 28 + 28) % 28)
      pos.setZ(i, bz)
    }
    pos.needsUpdate = true
  }

  private updateJadeHover(): void {
    if (this.scrollCurrent < 0.86) {
      if (this.hoverJade) {
        this.hoverJade = null
        this.hooks.onJadeHover(null)
      }
      return
    }
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.jadeMeshes.filter((mesh) => mesh.visible), false)
    const next = (hits[0]?.object.userData.jade as JadeInfo | undefined) ?? null
    if (next?.id !== this.hoverJade?.id) {
      this.hoverJade = next
      this.hooks.onJadeHover(next)
    }
    this.jadeMeshes.forEach((mesh) => {
      const active = mesh.userData.jade?.id === this.hoverJade?.id
      this.hoverScale.set(active ? 1.08 : 1, active ? 1.08 : 1, active ? 1.08 : 1)
      mesh.scale.lerp(this.hoverScale, 0.1)
    })
  }

  private projectJades(): ScreenJade[] {
    return JADES.map((jade, index) => {
      const mesh = this.jadeMeshes[index]
      if (!mesh || !mesh.visible) {
        return { jade, x: 0, y: 0, visible: false }
      }
      const world = mesh.getWorldPosition(new THREE.Vector3())
      world.y += 2
      const ndc = world.project(this.camera)
      return {
        jade,
        x: (ndc.x * 0.5 + 0.5) * window.innerWidth,
        y: (-ndc.y * 0.5 + 0.5) * window.innerHeight,
        visible: this.scrollCurrent > 0.86 && ndc.z < 1,
      }
    })
  }
}

export { JADES }

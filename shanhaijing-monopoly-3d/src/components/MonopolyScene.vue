<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { PLAYER_COLORS } from '../config/game'
import { playerAnimal } from '../utils/game'
import type { PlayerState, SceneTile } from '../types/game'

const props = defineProps<{
  tiles: SceneTile[]
  players: PlayerState[]
  currentPlayerIndex: number
  selectedTileIndex: number | null
  diceValue: number
  isRolling: boolean
}>()

const emit = defineEmits<{
  selectTile: [index: number]
}>()

const canvasHost = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let animationFrame = 0
let boardGroup: THREE.Group | null = null
let pawnGroup: THREE.Group | null = null
let diceMesh: THREE.Mesh | null = null
let raycaster: THREE.Raycaster | null = null
let pointer: THREE.Vector2 | null = null
const tileMeshes: THREE.Mesh[] = []

onMounted(() => {
  initializeScene()
  rebuildSceneObjects()
  window.addEventListener('resize', resizeRenderer)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeRenderer)
  window.cancelAnimationFrame(animationFrame)
  renderer?.dispose()
})

watch(
  () => [props.tiles, props.players, props.selectedTileIndex, props.currentPlayerIndex],
  () => rebuildSceneObjects(),
  { deep: true },
)

function initializeScene() {
  if (!canvasHost.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#f8efe2')
  scene.fog = new THREE.Fog('#f8efe2', 15, 32)

  camera = new THREE.PerspectiveCamera(42, canvasHost.value.clientWidth / canvasHost.value.clientHeight, 0.1, 100)
  camera.position.set(7.6, 10.5, 9.8)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvasHost.value.clientWidth, canvasHost.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  canvasHost.value.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()
  renderer.domElement.addEventListener('pointerdown', handlePointerDown)

  const hemiLight = new THREE.HemisphereLight('#fff5df', '#9a7f6f', 2.4)
  scene.add(hemiLight)

  const sunLight = new THREE.DirectionalLight('#fff1d1', 4.6)
  sunLight.position.set(-4, 10, 6)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  scene.add(sunLight)

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(7.1, 7.6, 0.36, 8, 1),
    new THREE.MeshStandardMaterial({ color: '#d7c09a', roughness: 0.82, metalness: 0.05 }),
  )
  base.position.y = -0.26
  base.rotation.y = Math.PI / 8
  base.receiveShadow = true
  scene.add(base)

  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(3.25, 72),
    new THREE.MeshStandardMaterial({ color: '#95bfc5', roughness: 0.44, metalness: 0.02 }),
  )
  lake.rotation.x = -Math.PI / 2
  lake.position.y = 0.02
  lake.receiveShadow = true
  scene.add(lake)

  createDice()
  animate()
}

function rebuildSceneObjects() {
  if (!scene) return
  if (boardGroup) scene.remove(boardGroup)
  if (pawnGroup) scene.remove(pawnGroup)
  tileMeshes.length = 0

  boardGroup = new THREE.Group()
  pawnGroup = new THREE.Group()
  props.tiles.forEach((tile) => boardGroup?.add(createTileMesh(tile)))
  props.players.forEach((player, index) => pawnGroup?.add(createPawnMesh(player, index)))
  scene.add(boardGroup, pawnGroup)
}

function createTileMesh(tile: SceneTile) {
  const isSelected = tile.index === props.selectedTileIndex
  const isOwned = tile.owner !== null
  const height = tile.meta.elevation + (isSelected ? 0.18 : 0)
  const material = new THREE.MeshStandardMaterial({
    color: isOwned ? PLAYER_COLORS[tile.owner ?? 0] : tile.meta.color,
    roughness: 0.72,
    metalness: isSelected ? 0.22 : 0.08,
    emissive: isSelected ? new THREE.Color('#fff1b8') : new THREE.Color('#000000'),
    emissiveIntensity: isSelected ? 0.38 : 0,
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.18, height, 1.18), material)
  mesh.position.set(tile.x, height / 2, tile.z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.tileIndex = tile.index
  tileMeshes.push(mesh)

  const label = createLabelSprite(tile.meta.icon, isSelected ? '#5a2b34' : '#6b4138')
  label.position.set(tile.x, height + 0.08, tile.z)
  label.scale.set(0.88, 0.44, 1)

  const group = new THREE.Group()
  group.add(mesh, label)
  return group
}

function createPawnMesh(player: PlayerState, index: number) {
  const tile = props.tiles[player.position]
  const rowOffset = (index % 3 - 1) * 0.28
  const colOffset = (Math.floor(index / 3) - 0.5) * 0.28
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length]

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.18, 0.34, 8, 18),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.42,
      metalness: props.currentPlayerIndex === index ? 0.28 : 0.1,
      emissive: props.currentPlayerIndex === index ? new THREE.Color(color) : new THREE.Color('#000000'),
      emissiveIntensity: props.currentPlayerIndex === index ? 0.18 : 0,
    }),
  )
  body.position.set(tile.x + rowOffset, 0.98, tile.z + colOffset)
  body.castShadow = true

  const head = createLabelSprite(playerAnimal(index), '#3f2237')
  head.position.set(tile.x + rowOffset, 1.46, tile.z + colOffset)
  head.scale.set(0.52, 0.28, 1)

  const group = new THREE.Group()
  group.add(body, head)
  return group
}

function createDice() {
  if (!scene) return
  diceMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.MeshStandardMaterial({ color: '#fff8e7', roughness: 0.38, metalness: 0.06 }),
  )
  diceMesh.position.set(0, 0.95, 0)
  diceMesh.castShadow = true
  scene.add(diceMesh)
}

function createLabelSprite(text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'rgba(255, 250, 240, 0.88)'
    roundRect(context, 20, 24, 216, 80, 28)
    context.fill()
    context.fillStyle = color
    context.font = '700 46px "Noto Serif TC", serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, 128, 66)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }))
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function handlePointerDown(event: PointerEvent) {
  if (!renderer || !camera || !raycaster || !pointer) return
  const rect = renderer.domElement.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(tileMeshes, false)[0]
  if (typeof hit?.object.userData.tileIndex === 'number') {
    emit('selectTile', hit.object.userData.tileIndex)
  }
}

function resizeRenderer() {
  if (!canvasHost.value || !renderer || !camera) return
  const width = canvasHost.value.clientWidth
  const height = canvasHost.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  if (!renderer || !scene || !camera) return
  animationFrame = window.requestAnimationFrame(animate)
  const elapsed = performance.now() / 1000
  if (diceMesh) {
    diceMesh.rotation.x = props.isRolling ? elapsed * 7.5 : props.diceValue * 0.42
    diceMesh.rotation.y = props.isRolling ? elapsed * 9 : props.diceValue * 0.72
    diceMesh.position.y = 0.95 + (props.isRolling ? Math.abs(Math.sin(elapsed * 10)) * 0.38 : 0)
  }
  if (boardGroup) {
    boardGroup.rotation.y = Math.sin(elapsed * 0.18) * 0.025
  }
  renderer.render(scene, camera)
}
</script>

<template>
  <div ref="canvasHost" class="scene-host" aria-label="山海經 3D 大富翁棋盤" />
</template>

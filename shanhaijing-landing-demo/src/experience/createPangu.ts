import * as THREE from 'three'
import { createRadialSprite } from './textures'
import { clamp, gate, lerp } from './math'

export const PANGU_CLASSIC =
  '天地渾沌如雞子。盤古生在其中。萬八千歲。天地開辟。陽清為天，陰濁為地。盤古在其中，一日九變。神於天，聖於地。天日高一丈，地日厚一丈，盤古日長一丈。如此萬八千歲。天數極高，地數極深，盤古極長。故天去地九萬里。'

const EGG_POS = new THREE.Vector3(0.12, -40.4, 0.22)

function eggGeometry(): THREE.LatheGeometry {
  const profile: THREE.Vector2[] = []
  for (let i = 0; i <= 18; i++) {
    const t = i / 18
    const y = (t - 0.5) * 2.35
    const r = Math.sin(t * Math.PI) * (0.68 + (1 - t) * 0.22)
    profile.push(new THREE.Vector2(Math.max(r, 0.02), y))
  }
  return new THREE.LatheGeometry(profile, 28)
}

function setOpacity(root: THREE.Object3D, amount: number): void {
  root.visible = amount > 0.03
  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.material) return
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      if (!('opacity' in material)) return
      const base = Number(material.userData.baseOpacity ?? 1)
      material.transparent = true
      material.opacity = base * amount
    })
  })
}

export type GoldBurst = {
  points: THREE.Points
  velocities: Float32Array
  origin: THREE.Vector3
  playing: boolean
  age: number
}

export function createPanguEgg(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'PanguEgg'

  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xf6d78a,
    roughness: 0.22,
    metalness: 0.28,
    transparent: true,
    opacity: 0.72,
    emissive: new THREE.Color(0x8a4e12),
    emissiveIntensity: 0.42,
  })
  shellMat.userData.baseOpacity = 0.72

  const shell = new THREE.Mesh(eggGeometry(), shellMat)
  shell.name = 'shell'
  shell.scale.setScalar(1.72)
  shell.renderOrder = 2
  group.add(shell)

  const yolkMat = new THREE.MeshBasicMaterial({
    color: 0xffd56a,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  yolkMat.userData.baseOpacity = 0.55
  const yolk = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 14), yolkMat)
  yolk.name = 'yolk'
  yolk.scale.set(0.88, 1.08, 0.88)
  yolk.renderOrder = 3
  group.add(yolk)

  const halo = createRadialSprite('rgba(255, 210, 110, 1)', 'rgba(255, 164, 48, 0.38)')
  halo.name = 'halo'
  halo.scale.set(7.2, 7.2, 1)
  halo.renderOrder = 1
  group.add(halo)

  const light = new THREE.PointLight(0xffd978, 2.4, 28, 1.5)
  light.name = 'coreLight'
  group.add(light)

  group.position.copy(EGG_POS)
  group.userData.baseScale = 1.12
  return group
}

export function createGoldBurst(count: number): GoldBurst {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xffe7a3,
        size: 0.22,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }),
  )
  points.name = 'PanguBurst'
  points.visible = false
  points.frustumCulled = false
  return {
    points,
    velocities,
    origin: EGG_POS.clone(),
    playing: false,
    age: 0,
  }
}

export function triggerGoldBurst(burst: GoldBurst, origin: THREE.Vector3): void {
  burst.origin.copy(origin)
  burst.playing = true
  burst.age = 0
  burst.points.visible = true
  const pos = burst.points.geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i, origin.x, origin.y, origin.z)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const speed = 3.8 + Math.random() * 9.4
    burst.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
    burst.velocities[i * 3 + 1] = Math.cos(phi) * speed * 0.85 + 1.4
    burst.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed
  }
  pos.needsUpdate = true
  const material = burst.points.material as THREE.PointsMaterial
  material.opacity = 1
}

export function tickGoldBurst(burst: GoldBurst, dt: number): void {
  if (!burst.playing) return
  burst.age += dt
  const pos = burst.points.geometry.attributes.position
  const drag = Math.exp(-2.1 * dt)
  for (let i = 0; i < pos.count; i++) {
    const vx = (burst.velocities[i * 3] ?? 0) * drag
    const vy = (burst.velocities[i * 3 + 1] ?? 0) * drag + 1.6 * dt
    const vz = (burst.velocities[i * 3 + 2] ?? 0) * drag
    burst.velocities[i * 3] = vx
    burst.velocities[i * 3 + 1] = vy
    burst.velocities[i * 3 + 2] = vz
    pos.setXYZ(i, pos.getX(i) + vx * dt, pos.getY(i) + vy * dt, pos.getZ(i) + vz * dt)
  }
  pos.needsUpdate = true
  const material = burst.points.material as THREE.PointsMaterial
    const fade = Math.max(0, 1 - burst.age / 2.35)
  material.opacity = fade
  if (fade <= 0.02) {
    burst.playing = false
    burst.points.visible = false
  }
}

export function tickPangu(
  group: THREE.Group,
  t: number,
  time: number,
  burstAge: number,
): { amount: number; centered: boolean } {
  const amount = gate(t, 0.28, 0.35, 0.48, 0.56)
  const centered = t >= 0.36 && t <= 0.48
  setOpacity(group, amount)

  group.position.copy(EGG_POS)
  group.position.y += Math.sin(time * 0.9) * 0.18 * amount
  group.rotation.y = time * 0.18
  group.rotation.z = Math.sin(time * 0.55) * 0.05

  const punch = burstAge >= 0 && burstAge < 1.2 ? Math.exp(-burstAge * 3.2) : 0
  const scale = lerp(1.08, 1.28, amount) * (1 + punch * 0.38)
  group.scale.setScalar(scale)

  const halo = group.getObjectByName('halo') as THREE.Sprite | undefined
  if (halo) {
    const haloScale = 5.2 + amount * 1.8 + punch * 7
    halo.scale.set(haloScale, haloScale, 1)
    const mat = halo.material as THREE.SpriteMaterial
    mat.opacity = (0.42 + amount * 0.4 + punch * 0.7) * clamp(amount * 1.4, 0, 1)
  }

  const light = group.getObjectByName('coreLight') as THREE.PointLight | undefined
  if (light) {
    light.intensity = 2.2 * amount + punch * 32
  }

  const yolk = group.getObjectByName('yolk') as THREE.Mesh | undefined
  const yolkMat = yolk?.material as THREE.MeshBasicMaterial | undefined
  if (yolkMat) {
    yolkMat.userData.baseOpacity = 0.55 + punch * 0.4
  }

  return { amount, centered }
}

export function panguSheetActive(t: number): boolean {
  return t >= 0.36 && t <= 0.52
}

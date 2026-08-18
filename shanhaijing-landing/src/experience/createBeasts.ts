import * as THREE from 'three'
import { createIceMaterial } from './createIceMaterial'
import { clamp, gate, lerp } from './math'

function beastMat(color: number, opacity = 0.92): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.18,
    transparent: true,
    opacity,
    emissive: new THREE.Color(0x101820),
    emissiveIntensity: 0.22,
  })
  material.userData.baseOpacity = opacity
  return material
}

function glowMat(color = 0xf4fbff): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
  })
  material.userData.baseOpacity = 0.95
  return material
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

export function createKunBeast(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Kun'
  const ice = beastMat(0x4e5966, 0.96)

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), ice)
  body.scale.set(6.2, 1.35, 2.1)
  group.add(body)

  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), beastMat(0xb9c4d0, 0.55))
  belly.scale.set(4.6, 0.85, 1.35)
  belly.position.set(0.6, -0.7, 0)
  group.add(belly)

  const head = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), ice)
  head.position.set(5.8, 0.25, 0)
  head.scale.set(1.5, 1.15, 1.25)
  group.add(head)

  const jaw = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.2, 8), ice)
  jaw.rotation.z = -Math.PI / 2
  jaw.position.set(7.4, -0.1, 0)
  group.add(jaw)

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), glowMat())
  eye.position.set(6.3, 0.5, 0.55)
  group.add(eye)
  const eye2 = eye.clone()
  eye2.position.z = -0.9
  group.add(eye2)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 5.5, 8), ice)
  tail.rotation.z = Math.PI / 2
  tail.position.set(-6.8, 0.15, 0)
  group.add(tail)

  for (let i = 0; i < 6; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.1), ice)
    const side = i < 3 ? 1 : -1
    const along = (i % 3) * 3.2 - 2
    fin.position.set(along, 0.2, side * 2.1)
    fin.rotation.y = side * 0.4
    group.add(fin)
  }

  const light = new THREE.PointLight(0xeef5ff, 4.5, 28, 1.6)
  light.position.set(3, 1.2, 0)
  group.add(light)

  group.position.set(8, 2.6, -66)
  group.scale.setScalar(1.45)
  return group
}

export function createPengBeast(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Peng'
  const ice = beastMat(0x596675, 0.96)

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), ice)
  body.scale.set(2.1, 1.05, 3.6)
  group.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), ice)
  head.position.set(0, 0.55, 3.2)
  group.add(head)

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.3, 6), ice)
  beak.rotation.x = Math.PI / 2
  beak.position.set(0, 0.35, 4.15)
  group.add(beak)

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), glowMat(0xffffff))
  eye.position.set(0.32, 0.7, 3.45)
  group.add(eye)

  const wingGeo = new THREE.BoxGeometry(14, 0.16, 4.2)
  const wingL = new THREE.Mesh(wingGeo, ice)
  wingL.name = 'wingL'
  wingL.position.set(-7.2, 0.3, 0.2)
  group.add(wingL)
  const wingR = new THREE.Mesh(wingGeo, ice)
  wingR.name = 'wingR'
  wingR.position.set(7.2, 0.3, 0.2)
  group.add(wingR)

  group.position.set(0, 18, -108)
  return group
}

export function createDragonBeast(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Yinglong'
  const ice = beastMat(0x4a5663, 0.96)
  const spine = new THREE.Group()
  spine.name = 'spine'

  for (let i = 0; i < 14; i++) {
    const seg = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), ice)
    seg.name = 'seg'
    const t = i / 13
    seg.scale.setScalar(1.15 - t * 0.7)
    seg.position.set(Math.sin(i * 0.62) * 2.4, i * 0.55, -i * 0.95)
    spine.add(seg)

    if (i % 2 === 0 && i < 10) {
      const plate = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.1, 5), ice)
      plate.position.copy(seg.position).add(new THREE.Vector3(0, 0.9, 0))
      group.add(plate)
    }
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 10), ice)
  head.position.set(0.4, 0.3, 1.4)
  head.scale.set(1.15, 0.85, 1.3)
  group.add(head)

  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.6, 6), ice)
  hornL.position.set(-0.45, 1.15, 1.1)
  hornL.rotation.z = 0.35
  group.add(hornL)
  const hornR = hornL.clone()
  hornR.position.x = 0.45
  hornR.rotation.z = -0.35
  group.add(hornR)

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), glowMat())
  eye.position.set(0.55, 0.45, 2.15)
  group.add(eye)

  group.add(spine)
  group.position.set(-2, 3.2, -148)
  group.rotation.y = 0.5
  return group
}

export function createFoxBeast(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'NineTail'
  const ice = beastMat(0x6b7682, 0.96)

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), ice)
  body.scale.set(1.15, 0.85, 2.05)
  group.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), ice)
  head.position.set(0, 0.55, 1.7)
  group.add(head)

  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 5), ice)
  earL.position.set(-0.28, 1.15, 1.55)
  group.add(earL)
  const earR = earL.clone()
  earR.position.x = 0.28
  group.add(earR)

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat())
  eye.position.set(0.22, 0.62, 2.12)
  group.add(eye)

  const tails = new THREE.Group()
  tails.name = 'tails'
  for (let i = 0; i < 9; i++) {
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 2.8, 6), ice)
    tail.position.set((i - 4) * 0.28, 0.15, -1.7)
    tail.rotation.x = 1.05
    tail.rotation.z = (i - 4) * 0.16
    tails.add(tail)
  }
  group.add(tails)

  group.position.set(3.2, 2.1, -186)
  return group
}

export function createBrokenPeak(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Buzhou'
  const shards = [
    { s: [4.2, 11, 3.4], p: [0, 5.2, 0], r: [0.08, 0.2, -0.05] },
    { s: [2.4, 7.4, 2.2], p: [-2.4, 4.1, -1.2], r: [0.2, -0.4, 0.1] },
    { s: [1.8, 5.2, 1.6], p: [2.6, 3.4, 0.8], r: [-0.15, 0.3, 0.2] },
    { s: [3.1, 3.2, 2.8], p: [0.4, 1.2, 1.6], r: [0.1, 0.1, 0] },
    { s: [1.2, 4.8, 1.1], p: [-1.1, 7.8, 0.4], r: [0.4, 0.2, -0.3] },
  ]
  shards.forEach((shard) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), createIceMaterial(Math.random()))
    mesh.scale.set(shard.s[0], shard.s[1], shard.s[2])
    mesh.position.set(shard.p[0], shard.p[1], shard.p[2])
    mesh.rotation.set(shard.r[0], shard.r[1], shard.r[2])
    group.add(mesh)
  })
  group.position.set(1, -0.4, -150)
  return group
}

export function tickBeasts(
  kun: THREE.Group,
  peng: THREE.Group,
  dragon: THREE.Group,
  fox: THREE.Group,
  peak: THREE.Group,
  t: number,
  time: number,
): void {
  const kunGate = gate(t, 0.2, 0.28, 0.42, 0.5)
  setOpacity(kun, kunGate)
  kun.position.x = lerp(-8, 22, clamp((t - 0.2) / 0.26, 0, 1))
  kun.position.y = 2.6 + Math.sin(time * 0.7) * 0.8
  kun.position.z = -66
  kun.rotation.y = 0.55
  kun.rotation.z = Math.sin(time * 0.55) * 0.05
  kun.scale.setScalar(1.05 + kunGate * 0.12)

  const pengGate = gate(t, 0.44, 0.54, 0.66, 0.76)
  setOpacity(peng, pengGate)
  peng.position.set(
    Math.sin(time * 0.25) * 3.5,
    lerp(8, 22, clamp((t - 0.44) / 0.22, 0, 1)),
    -108,
  )
  peng.rotation.x = -0.18
  const flap = Math.sin(time * 3.4) * 0.32 * pengGate
  const wingL = peng.getObjectByName('wingL')
  const wingR = peng.getObjectByName('wingR')
  if (wingL) wingL.rotation.z = 0.28 + flap
  if (wingR) wingR.rotation.z = -0.28 - flap

  const peakGate = gate(t, 0.58, 0.68, 0.84, 0.92)
  setOpacity(peak, peakGate)
  peak.rotation.y = time * 0.03

  const dragonGate = gate(t, 0.6, 0.7, 0.82, 0.9)
  setOpacity(dragon, dragonGate)
  dragon.position.set(-2 + Math.sin(time * 0.4) * 0.8, 3.2, -148)
  dragon.rotation.y = 0.45 + Math.sin(time * 0.5) * 0.12
  const spine = dragon.getObjectByName('spine')
  spine?.children.forEach((seg, index) => {
    if (seg.name !== 'seg') return
    seg.position.x = Math.sin(time * 1.4 + index * 0.45) * 2.4
  })

  const foxGate = gate(t, 0.76, 0.84, 0.96, 1)
  setOpacity(fox, foxGate)
  fox.position.set(3.2, 2.1 + Math.sin(time * 1.1) * 0.12, -186)
  fox.rotation.y = -0.35 + Math.sin(time * 0.6) * 0.08
  const tails = fox.getObjectByName('tails')
  tails?.children.forEach((tail, index) => {
    tail.rotation.y = Math.sin(time * 2.2 + index) * 0.22
  })
}

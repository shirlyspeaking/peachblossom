import * as THREE from 'three'
import { createIceMaterial } from './createIceMaterial'
import { gate } from './math'

export type JadeInfo = {
  id: string
  name: string
  seal: string
  hint: string
  href: string
}

export const JADES: JadeInfo[] = [
  {
    id: 'escape',
    name: '山海密室',
    seal: '謎',
    hint: '裂冰之後，密室自開',
    href: '../shanhai-jing-escape/index.html',
  },
  {
    id: 'monopoly',
    name: '山海經大富翁',
    seal: '遊',
    hint: '神獸巡境，環山為局',
    href: '../taoyuan-wanxiang-monopoly/',
  },
  {
    id: 'isles',
    name: '山海浮島',
    seal: '島',
    hint: '北冥盡處，方壺浮起',
    href: '../shanhaijing-monopoly-3d/',
  },
]

function paintFrostFace(seal: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#c5d0dc'
    ctx.fillRect(0, 0, 512, 768)
    ctx.fillStyle = 'rgba(244, 250, 255, 0.92)'
    ctx.font = '700 220px "Noto Sans TC", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(seal, 256, 384)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createRelics(): { group: THREE.Group; meshes: THREE.Mesh[] } {
  const group = new THREE.Group()
  group.name = 'Relics'
  const meshes: THREE.Mesh[] = []
  const spots = [
    { x: -7, y: 2.2, z: -208 },
    { x: 6.5, y: 2.6, z: -224 },
    { x: 0, y: 3.1, z: -240 },
  ]

  JADES.forEach((jade, index) => {
    const spot = spots[index]
    if (!spot) return
    const shell = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 2.4), createIceMaterial(0.3 + index * 0.22))
    shell.position.set(spot.x, spot.y, spot.z)
    shell.userData.jade = jade
    shell.userData.appear = 0.86 + index * 0.04
    group.add(shell)
    meshes.push(shell)

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.3, 0.12),
      new THREE.MeshBasicMaterial({ map: paintFrostFace(jade.seal), transparent: true, opacity: 0.9 }),
    )
    core.position.copy(shell.position)
    group.add(core)
  })

  return { group, meshes }
}

export function tickRelics(meshes: THREE.Mesh[], t: number): void {
  meshes.forEach((mesh) => {
    const appear = Number(mesh.userData.appear ?? 0.9)
    const amount = gate(t, appear, appear + 0.05, 1.2, 1.3)
    mesh.visible = amount > 0.05
  })
}

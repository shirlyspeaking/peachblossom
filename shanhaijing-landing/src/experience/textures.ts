import * as THREE from 'three'
import { fbm } from './math'

export function createRadialSprite(
  inner: string,
  mid: string,
  outer = 'rgba(0,0,0,0)',
  size = 128,
): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return new THREE.Sprite()
  }

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.38, mid)
  gradient.addColorStop(1, outer)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Sprite(material)
}

export function createPlusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, 64, 64)
    ctx.strokeStyle = 'rgba(236, 244, 255, 0.92)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(32, 10)
    ctx.lineTo(32, 54)
    ctx.moveTo(10, 32)
    ctx.lineTo(54, 32)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createNumberTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, 128, 64)
    ctx.fillStyle = 'rgba(232, 240, 248, 0.92)'
    ctx.font = '600 28px "Noto Sans TC", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 8, 32)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function displacePlane(geometry: THREE.PlaneGeometry, scale: number, height: number): void {
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const n = fbm(x * scale, y * scale, 5)
    const envelope = THREE.MathUtils.smoothstep(Math.abs(x), geometry.parameters.width * 0.48, 0)
    pos.setZ(i, n * height * envelope)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
}

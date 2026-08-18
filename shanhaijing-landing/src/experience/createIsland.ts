import * as THREE from 'three'
import { createIceMaterial } from './createIceMaterial'
import { createNumberTexture, createPlusTexture, createRadialSprite } from './textures'

export function createIsland(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'IceHouse'

  const plusMap = createPlusTexture()
  const markers = new THREE.Group()
  markers.name = 'Markers'

  const rings = [
    { y: 0.08, r: 4.5, count: 16, h: 0.98 },
    { y: 0.98, r: 3.85, count: 14, h: 0.9 },
    { y: 1.82, r: 3.05, count: 12, h: 0.84 },
    { y: 2.52, r: 2.2, count: 10, h: 0.76 },
    { y: 3.16, r: 1.28, count: 8, h: 0.64 },
    { y: 3.62, r: 0.38, count: 1, h: 0.4 },
  ]

  const markerLabels = ['22', '45', '北冥', '不周', '16', '方壺', '58', '鯤']
  let markerIndex = 0

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + ringIndex * 0.14
      const doorway = ringIndex < 2 && Math.abs(Math.sin(angle)) < 0.22 && Math.cos(angle) > 0.55
      if (doorway) continue

      const jitter = (Math.random() - 0.5) * 0.16
      const radius = ring.r + jitter
      const explode = Math.random() > 0.62 ? 0.45 + Math.random() * 0.95 : 0.1 + Math.random() * 0.12

      const w = 1.18 + Math.random() * 0.38
      const h = ring.h * (0.9 + Math.random() * 0.16)
      const d = 0.92 + Math.random() * 0.32
      const geometry = new THREE.BoxGeometry(w, h, d)
      const material = createIceMaterial(Math.random())

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(
        Math.cos(angle) * (radius + explode),
        ring.y + h * 0.5,
        Math.sin(angle) * (radius + explode),
      )
      mesh.rotation.set(
        (Math.random() - 0.5) * 0.1,
        angle + Math.PI / 2 + (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.08,
      )
      mesh.scale.setScalar(0.86)
      group.add(mesh)

      const shouldMark = explode > 0.4 || (ringIndex < 4 && i % 3 === ringIndex % 3)
      if (shouldMark && markerIndex < markerLabels.length) {
        const markPos = mesh.position.clone()
        markPos.y += h * 0.52
        addMarker(markers, plusMap, markPos, markerLabels[markerIndex] ?? '0')
        markerIndex += 1
      }
    }
  })

  const mound = new THREE.Mesh(
    new THREE.CylinderGeometry(5.8, 7.4, 0.7, 12),
    new THREE.MeshStandardMaterial({
      color: 0xb7bec8,
      roughness: 0.92,
      metalness: 0.04,
      flatShading: true,
    }),
  )
  mound.position.y = -0.28
  group.add(mound)

  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 20, 14),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  )
  innerCore.position.y = 1.7
  innerCore.scale.set(0.62, 0.78, 0.62)
  group.add(innerCore)

  const glow = createRadialSprite('rgba(255, 255, 255, 1)', 'rgba(210, 228, 248, 0.42)')
  glow.position.set(0, 1.72, 0)
  glow.scale.set(6.8, 6.8, 1)
  group.add(glow)

  const innerLight = new THREE.PointLight(0xf7fbff, 12, 22, 1.4)
  innerLight.position.set(0, 1.65, 0)
  group.add(innerLight)

  const linePositions: number[] = []
  const markSprites = markers.children.filter((child) => child instanceof THREE.Sprite)
  markSprites.forEach((child, index) => {
    if (index === 0) return
    const prev = markSprites[index - 1]
    if (!prev) return
    linePositions.push(prev.position.x, prev.position.y, prev.position.z)
    linePositions.push(child.position.x, child.position.y, child.position.z)
  })
  if (linePositions.length > 0) {
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    markers.add(
      new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xf2f7ff, transparent: true, opacity: 0.55 }),
      ),
    )
  }

  group.add(markers)
  group.position.set(0, 0.15, 0)
  return group
}

function addMarker(
  group: THREE.Group,
  plusMap: THREE.CanvasTexture,
  position: THREE.Vector3,
  label: string,
): void {
  const plus = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: plusMap,
      transparent: true,
      depthTest: false,
      color: 0xffffff,
    }),
  )
  plus.position.copy(position)
  plus.scale.set(0.26, 0.26, 1)
  group.add(plus)

  const text = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createNumberTexture(label),
      transparent: true,
      depthTest: false,
    }),
  )
  text.position.copy(position).add(new THREE.Vector3(0.4, 0.1, 0.08))
  text.scale.set(0.78, 0.38, 1)
  group.add(text)
}

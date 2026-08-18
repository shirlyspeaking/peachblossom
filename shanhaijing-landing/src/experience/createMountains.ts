import * as THREE from 'three'
import { displacePlane } from './textures'

export function createMountains(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'SnowRanges'

  const ranges = [
    { z: -78, y: 5.2, w: 170, h: 44, color: 0xb4bbc6, rot: 0 },
    { z: -56, y: 3.1, w: 124, h: 30, color: 0x9aa3b0, rot: 0.03 },
    { z: 64, y: 6.4, w: 150, h: 38, color: 0xc0c6ce, rot: Math.PI },
  ]

  ranges.forEach((range) => {
    const geometry = new THREE.PlaneGeometry(range.w, range.h, 52, 20)
    displacePlane(geometry, 0.04, 16)
    const material = new THREE.MeshStandardMaterial({
      color: range.color,
      roughness: 0.94,
      metalness: 0.02,
      flatShading: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI * 0.5
    mesh.rotation.z = range.rot
    mesh.position.set(0, range.y, range.z)
    group.add(mesh)
  })

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(52, 28),
    new THREE.MeshStandardMaterial({
      color: 0xc5cbd4,
      roughness: 0.98,
      metalness: 0,
    }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.92
  group.add(ground)

  return group
}

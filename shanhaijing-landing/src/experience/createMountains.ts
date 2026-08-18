import * as THREE from 'three'
import { displacePlane } from './textures'

/** Distant ice walls only — no ground plane. */
export function createMountains(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'IceWalls'

  const walls = [
    { pos: [0, -28, -22] as const, rot: [-0.12, 0, 0] as const, w: 90, h: 70, color: 0xaeb6c2 },
    { pos: [-38, -8, -8] as const, rot: [0, 1.15, 0.08] as const, w: 70, h: 90, color: 0x9aa4b0 },
    { pos: [42, 12, -18] as const, rot: [0, -1.05, -0.06] as const, w: 64, h: 80, color: 0xb8c0ca },
    { pos: [0, 42, -28] as const, rot: [0.35, 0, 0] as const, w: 110, h: 50, color: 0xc4ccd6 },
    { pos: [8, -52, 6] as const, rot: [-1.15, 0.2, 0] as const, w: 80, h: 40, color: 0x8e98a4 },
  ]

  walls.forEach((wall) => {
    const geometry = new THREE.PlaneGeometry(wall.w, wall.h, 36, 28)
    displacePlane(geometry, 0.05, 10)
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: wall.color,
        roughness: 0.94,
        metalness: 0.04,
        flatShading: true,
        side: THREE.DoubleSide,
      }),
    )
    mesh.position.set(wall.pos[0], wall.pos[1], wall.pos[2])
    mesh.rotation.set(wall.rot[0], wall.rot[1], wall.rot[2])
    group.add(mesh)
  })

  return group
}

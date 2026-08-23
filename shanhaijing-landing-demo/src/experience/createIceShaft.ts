import * as THREE from 'three'
import { createIceMaterial, NUWA_STONE_COLORS } from './createIceMaterial'

function stoneFor(index: number): THREE.Color {
  return NUWA_STONE_COLORS[index % NUWA_STONE_COLORS.length] ?? NUWA_STONE_COLORS[0]
}

/** Hollow column of ice around the camera path — you fly through it, not over it. */
export function createIceShaft(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'IceShaft'

  const count = 86
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const y = 16 - t * 78
    const angle = i * 2.399 + t * 4.2
    const nearMiss = i % 9 === 0
    const radius = nearMiss ? 2.6 + Math.random() * 0.7 : 5.4 + Math.random() * 7.5
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.7 + Math.random() * 2.4,
        0.55 + Math.random() * 2.1,
        0.7 + Math.random() * 2.2,
      ),
      createIceMaterial(Math.random(), stoneFor(i)),
    )
    mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.72 - t * 8)
    if (mesh.position.distanceTo(new THREE.Vector3(0.12, -40.4, 0.22)) < 5.4) continue
    mesh.rotation.set(Math.random() * 0.8, angle, Math.random() * 0.8)
    group.add(mesh)
  }

  for (let i = 0; i < 18; i++) {
    const y = 8 - i * 3.4
    const angle = i * 1.37
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.4 + (i % 3), 0.7 + (i % 4) * 0.4, 3.2 + (i % 2)),
      createIceMaterial(0.2 + (i % 5) * 0.15, stoneFor(i + 2)),
    )
    mesh.position.set(Math.cos(angle) * 2.35, y, Math.sin(angle) * 2.1)
    if (mesh.position.distanceTo(new THREE.Vector3(0.12, -40.4, 0.22)) < 5.4) continue
    mesh.rotation.set(0.2 * (i % 3), angle, -0.15 * (i % 4))
    group.add(mesh)
  }

  return group
}

import * as THREE from 'three'

export function createKun(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Kun'

  const mat = new THREE.MeshBasicMaterial({
    color: 0x8b97a6,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), mat)
  body.scale.set(7.4, 1.35, 2.05)
  group.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), mat)
  head.position.set(6.6, 0.15, 0)
  head.scale.set(1.6, 1.05, 1.15)
  group.add(head)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.4, 8), mat)
  tail.rotation.z = Math.PI / 2
  tail.position.set(-7.8, 0.1, 0)
  group.add(tail)

  group.position.set(-16, 6.8, -6)
  return group
}

export function tickKun(group: THREE.Group, time: number, progress: number): void {
  const fade = 1 - THREE.MathUtils.smoothstep(progress, 0.08, 0.28)
  group.visible = fade > 0.02
  group.position.x = -18 + time * 1.6
  group.position.y = 6.6 + Math.sin(time * 0.55) * 0.55
  group.position.z = -8
  group.rotation.y = 0.18 + Math.sin(time * 0.4) * 0.06
  group.traverse((child) => {
    const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
    if (mesh.material && 'opacity' in mesh.material) {
      mesh.material.opacity = 0.22 * fade
    }
  })
}

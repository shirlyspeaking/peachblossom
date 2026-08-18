import * as THREE from 'three'
import { cloudFragment, cloudVertex } from './shaders'

export function createCloudField(reduced: boolean): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Clouds'

  const layers = reduced
    ? [
        { y: 8, z: 4, w: 40, h: 70, opacity: 0.22, scale: 2.4, tilt: 0, yaw: 0.2 },
        { y: -18, z: -6, w: 70, h: 36, opacity: 0.28, scale: 2.2, tilt: -Math.PI * 0.5, yaw: 0 },
        { y: -42, z: 2, w: 80, h: 40, opacity: 0.26, scale: 2.1, tilt: -Math.PI * 0.48, yaw: 0.1 },
        { y: 28, z: -12, w: 60, h: 28, opacity: 0.2, scale: 1.8, tilt: -0.2, yaw: 0 },
      ]
    : [
        { y: 10, z: 6, w: 48, h: 80, opacity: 0.2, scale: 2.2, tilt: 0.05, yaw: 0.35 },
        { y: -6, z: -4, w: 90, h: 40, opacity: 0.28, scale: 2.6, tilt: -Math.PI * 0.5, yaw: 0 },
        { y: -24, z: 3, w: 70, h: 90, opacity: 0.18, scale: 2, tilt: 0, yaw: -0.6 },
        { y: -44, z: -8, w: 100, h: 44, opacity: 0.3, scale: 2.4, tilt: -Math.PI * 0.48, yaw: 0.12 },
        { y: 22, z: -14, w: 80, h: 32, opacity: 0.22, scale: 2, tilt: -0.25, yaw: 0.2 },
        { y: 40, z: -20, w: 70, h: 28, opacity: 0.18, scale: 1.8, tilt: -0.15, yaw: 0 },
      ]

  layers.forEach((layer, index) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: index * 2.4 },
        uColor: { value: new THREE.Color(0xe7edf4) },
        uOpacity: { value: layer.opacity },
        uScale: { value: layer.scale },
      },
      vertexShader: cloudVertex,
      fragmentShader: cloudFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(layer.w, layer.h, 1, 1), material)
    mesh.rotation.x = layer.tilt
    mesh.rotation.y = layer.yaw
    mesh.position.set((index % 2 === 0 ? -5 : 6) + index * 0.3, layer.y, layer.z)
    mesh.renderOrder = index
    group.add(mesh)
  })

  return group
}

export function tickClouds(group: THREE.Group, time: number, dt: number): void {
  group.children.forEach((child, index) => {
    const mesh = child as THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
    if (mesh.material.uniforms?.uTime) {
      mesh.material.uniforms.uTime.value = time * (0.65 + index * 0.08)
    }
    mesh.position.x += Math.sin(time * 0.07 + index) * dt * 0.12
  })
}

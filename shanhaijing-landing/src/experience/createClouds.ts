import * as THREE from 'three'
import { cloudFragment, cloudVertex } from './shaders'

export function createCloudField(reduced: boolean): THREE.Group {
  const group = new THREE.Group()
  group.name = 'Clouds'

  const layers = reduced
    ? [
        { y: -3.4, z: 2, w: 90, h: 50, opacity: 0.5, scale: 3.2, tilt: -Math.PI * 0.5 },
        { y: 4.2, z: -46, w: 70, h: 26, opacity: 0.3, scale: 2.2, tilt: -Math.PI * 0.2 },
        { y: 6, z: -110, w: 80, h: 28, opacity: 0.28, scale: 2.2, tilt: -Math.PI * 0.18 },
        { y: 3.2, z: -170, w: 72, h: 24, opacity: 0.3, scale: 2, tilt: -Math.PI * 0.2 },
      ]
    : [
        { y: -3.8, z: 1, w: 130, h: 70, opacity: 0.58, scale: 3.4, tilt: -Math.PI * 0.5 },
        { y: 7.4, z: -14, w: 72, h: 24, opacity: 0.26, scale: 2.3, tilt: -Math.PI * 0.16 },
        { y: 3.4, z: -50, w: 90, h: 32, opacity: 0.34, scale: 2.5, tilt: -Math.PI * 0.22 },
        { y: 16, z: -100, w: 110, h: 36, opacity: 0.28, scale: 2.2, tilt: -Math.PI * 0.12 },
        { y: 5.2, z: -148, w: 88, h: 30, opacity: 0.3, scale: 2.1, tilt: -Math.PI * 0.2 },
        { y: 4, z: -186, w: 70, h: 24, opacity: 0.26, scale: 1.9, tilt: -Math.PI * 0.18 },
        { y: 8, z: -230, w: 90, h: 28, opacity: 0.24, scale: 2, tilt: -Math.PI * 0.16 },
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
    mesh.position.set((index % 2 === 0 ? -8 : 9) + index * 0.35, layer.y, layer.z)
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

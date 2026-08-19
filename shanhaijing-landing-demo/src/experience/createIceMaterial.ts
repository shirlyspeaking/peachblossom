import * as THREE from 'three'
import { iceFragment, iceVertex } from './shaders'

export function createIceMaterial(seed = Math.random()): THREE.ShaderMaterial {
  const shade = 0.88 + Math.random() * 0.1
  return new THREE.ShaderMaterial({
    uniforms: {
      uIce: {
        value: new THREE.Color().setRGB(0.48 * shade, 0.53 * shade, 0.60 * shade),
      },
      uGlow: { value: new THREE.Color(0xf4f9ff) },
      uSeed: { value: seed * 12.6 },
    },
    vertexShader: iceVertex,
    fragmentShader: iceFragment,
    transparent: true,
    depthWrite: true,
  })
}

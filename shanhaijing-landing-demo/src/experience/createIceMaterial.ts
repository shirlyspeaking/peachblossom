import * as THREE from 'three'
import { iceFragment, iceVertex } from './shaders'

/** 女媧五色石：青、黃、赤、白、玄。低飽和、仍偏玻璃，避免糖果色。 */
export const NUWA_STONE_COLORS = [
  new THREE.Color(0x5faba0),
  new THREE.Color(0xd4b056),
  new THREE.Color(0xc45a4e),
  new THREE.Color(0xeef2f6),
  new THREE.Color(0x3d3a58),
]

export function createIceMaterial(
  seed = Math.random(),
  stone: THREE.Color | null = null,
): THREE.ShaderMaterial {
  const shade = 0.88 + Math.random() * 0.1
  return new THREE.ShaderMaterial({
    uniforms: {
      uIce: {
        value: new THREE.Color().setRGB(0.48 * shade, 0.53 * shade, 0.6 * shade),
      },
      uGlow: { value: new THREE.Color(0xf4f9ff) },
      uStone: { value: (stone ?? new THREE.Color(0x8899aa)).clone() },
      uMix: { value: 0 },
      uSeed: { value: seed * 12.6 },
    },
    vertexShader: iceVertex,
    fragmentShader: iceFragment,
    transparent: true,
    depthWrite: true,
  })
}

export function setIceStoneMix(root: THREE.Object3D, mix: number): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    const material = mesh.material as THREE.ShaderMaterial | undefined
    if (material?.uniforms?.uMix) {
      material.uniforms.uMix.value = mix
    }
  })
}

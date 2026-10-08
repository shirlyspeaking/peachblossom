import type { RoomId, SpeciesId, VaseId } from '../types'

/** Public dir files are emitted under build `base` (e.g. `/hua-wu-que/` on peachspring.cc). */
function publicAsset(pathFromPublicRoot: string): string {
  const base = import.meta.env.BASE_URL
  const rel = pathFromPublicRoot.startsWith('/')
    ? pathFromPublicRoot.slice(1)
    : pathFromPublicRoot
  return `${base}${rel}`
}

export function flowerImagePath(species: SpeciesId, colorId: string): string {
  return publicAsset(`assets/flowers/${species}_${colorId}.png`)
}

export function vaseImagePath(id: VaseId): string {
  return publicAsset(`assets/vases/${id}.png`)
}

export function roomImagePath(id: RoomId): string {
  return publicAsset(`assets/rooms/${id}.jpg`)
}

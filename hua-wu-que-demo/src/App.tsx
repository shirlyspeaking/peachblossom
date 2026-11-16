import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { CompositionCanvas } from './components/CompositionCanvas'
import { ControlPanel } from './components/ControlPanel'
import { FLOWER_BEHIND_VASE_Z, FLOWER_FRONT_Z } from './constants/layers'
import { flowerImagePath } from './data/assetPaths'
import { getFlower } from './data/flowers'
import {
  DEFAULT_VASE_POSE,
  type MouthPoint,
  type PlacedFlower,
  type RoomId,
  type SpeciesId,
  type VaseId,
  type VasePose,
} from './types'

export default function App() {
  const [vaseId, setVaseId] = useState<VaseId>('danping-qiuhui')
  const [vasePose, setVasePose] = useState<VasePose>(DEFAULT_VASE_POSE)
  const [vaseSelected, setVaseSelected] = useState(false)
  const [room, setRoom] = useState<RoomId>('shufang')
  const [librarySpecies, setLibrarySpecies] = useState<SpeciesId>('peony')
  const [pendingColorId, setPendingColorId] = useState('yaohuang')
  const [flowers, setFlowers] = useState<PlacedFlower[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mouth, setMouth] = useState<MouthPoint>({ x: 50, y: 38 })
  const [ghost, setGhost] = useState<{
    species: SpeciesId
    colorId: string
    x: number
    y: number
  } | null>(null)

  const onMouth = useCallback((next: MouthPoint) => {
    setMouth((prev) =>
      Math.abs(prev.x - next.x) < 0.2 && Math.abs(prev.y - next.y) < 0.2
        ? prev
        : next,
    )
  }, [])

  function handleLibrarySpecies(species: SpeciesId) {
    setLibrarySpecies(species)
    const colors = getFlower(species).colors
    setPendingColorId((prev) =>
      colors.some((color) => color.id === prev)
        ? prev
        : (colors[0]?.id ?? prev),
    )
  }

  const selectedFlower = useMemo(
    () => flowers.find((flower) => flower.id === selectedId) ?? null,
    [flowers, selectedId],
  )

  function patchFlower(id: string, patch: Partial<PlacedFlower>) {
    setFlowers((prev) =>
      prev.map((flower) => (flower.id === id ? { ...flower, ...patch } : flower)),
    )
  }

  function placeFlower(
    species: SpeciesId,
    colorId: string,
    clientX: number,
    clientY: number,
  ) {
    const canvas = document.querySelector('[data-canvas]')
    if (!(canvas instanceof HTMLElement)) return
    const rect = canvas.getBoundingClientRect()
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    if (!inside || rect.width === 0 || rect.height === 0) return

    let x = ((clientX - rect.left) / rect.width) * 100
    let y = ((clientY - rect.top) / rect.height) * 100
    let rotation = 0
    const vase = document.querySelector('[data-vase]')
    if (vase instanceof HTMLElement) {
      const vaseRect = vase.getBoundingClientRect()
      const nearVase =
        clientX >= vaseRect.left - 24 &&
        clientX <= vaseRect.right + 24 &&
        clientY >= vaseRect.top - rect.height * 0.22 &&
        clientY <= vaseRect.bottom + 16
      if (nearVase) {
        const seat = mouth
        x = Math.min(seat.x + 8, Math.max(seat.x - 8, x))
        y = seat.y
        rotation = (x - seat.x) * 1.4
      }
    }

    const id = crypto.randomUUID()
    setFlowers((prev) => [
      ...prev,
      {
        id,
        species,
        colorId,
        x,
        y,
        rotation,
        scale: 1,
        zIndex: FLOWER_FRONT_Z,
      },
    ])
    setSelectedId(id)
    setVaseSelected(false)
  }

  function beginLibraryDrag(
    species: SpeciesId,
    colorId: string,
    event: ReactPointerEvent<HTMLElement>,
  ) {
    event.preventDefault()
    setGhost({ species, colorId, x: event.clientX, y: event.clientY })
    function move(next: PointerEvent) {
      setGhost({ species, colorId, x: next.clientX, y: next.clientY })
    }
    function finish(next: PointerEvent) {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      setGhost(null)
      placeFlower(species, colorId, next.clientX, next.clientY)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
  }

  function selectFlower(id: string) {
    setSelectedId(id)
    setVaseSelected(false)
  }

  function selectVase() {
    setVaseSelected(true)
    setSelectedId(null)
  }

  function deselect() {
    setSelectedId(null)
    setVaseSelected(false)
  }

  function deleteSelected() {
    if (!selectedId) return
    setFlowers((prev) => prev.filter((flower) => flower.id !== selectedId))
    setSelectedId(null)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }
      if (!selectedId) return
      event.preventDefault()
      setFlowers((prev) => prev.filter((flower) => flower.id !== selectedId))
      setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-(--color-zen-paper) font-[family-name:var(--font-serif-sc)] text-(--color-zen-ink) lg:flex-row">
      <ControlPanel
        vaseId={vaseId}
        onVase={(id) => {
          setVaseId(id)
          setVasePose(DEFAULT_VASE_POSE)
          setVaseSelected(true)
          setSelectedId(null)
        }}
        room={room}
        onRoom={setRoom}
        librarySpecies={librarySpecies}
        onLibrarySpecies={handleLibrarySpecies}
        pendingColorId={pendingColorId}
        onPendingColor={setPendingColorId}
        onBeginDrag={beginLibraryDrag}
        selectedFlower={selectedFlower}
        onPatchSelectedFlower={(patch) => {
          if (selectedId) patchFlower(selectedId, patch)
        }}
        onBringFront={() => {
          if (selectedId) patchFlower(selectedId, { zIndex: FLOWER_FRONT_Z })
        }}
        onSendBack={() => {
          if (selectedId)
            patchFlower(selectedId, { zIndex: FLOWER_BEHIND_VASE_Z })
        }}
        onDeleteSelected={deleteSelected}
        onClear={() => {
          setFlowers([])
          setSelectedId(null)
        }}
        canClear={flowers.length > 0}
      />

      <main className="order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3 lg:order-2 lg:p-5">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <CompositionCanvas
            room={room}
            vaseId={vaseId}
            vasePose={vasePose}
            vaseSelected={vaseSelected}
            flowers={flowers}
            selectedId={selectedId}
            onSelectFlower={selectFlower}
            onDeselect={deselect}
            onSelectVase={selectVase}
            onUpdateFlower={patchFlower}
            onVasePose={setVasePose}
            onMouth={onMouth}
          />
        </div>
      </main>
      {ghost ? (
        <img
          src={flowerImagePath(ghost.species, ghost.colorId)}
          alt=""
          draggable={false}
          className="pointer-events-none fixed z-[80] h-28 w-auto -translate-x-1/2 -translate-y-full opacity-85 drop-shadow-lg"
          style={{ left: ghost.x, top: ghost.y }}
        />
      ) : null}
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CompositionCanvas } from './components/CompositionCanvas'
import { ControlPanel } from './components/ControlPanel'
import { FLOWER_BEHIND_VASE_Z, FLOWER_FRONT_Z } from './constants/layers'
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

  function addFlower() {
    const id = crypto.randomUUID()
    const index = flowers.length
    const spread = [0, -1, 1, -2, 2][index % 5]
    setFlowers((prev) => [
      ...prev,
      {
        id,
        species: librarySpecies,
        colorId: pendingColorId,
        x: mouth.x + spread * 0.45,
        y: mouth.y + (index % 3) * 0.45,
        rotation: spread * 2.5,
        scale: 1,
        zIndex: FLOWER_FRONT_Z,
      },
    ])
    setSelectedId(id)
    setVaseSelected(false)
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
        onAddFlower={addFlower}
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
    </div>
  )
}

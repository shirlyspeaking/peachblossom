import { useCallback, useEffect, useMemo, useState } from 'react'
import { CompositionCanvas } from './components/CompositionCanvas'
import { ControlPanel } from './components/ControlPanel'
import { FLOWER_BEHIND_VASE_Z, FLOWER_FRONT_Z } from './constants/layers'
import { getFlower } from './data/flowers'
import type {
  MouthPoint,
  PlacedFlower,
  RoomId,
  SpeciesId,
  VaseId,
} from './types'

export default function App() {
  const [vaseId, setVaseId] = useState<VaseId>('jurui-xianwen')
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
        onVase={setVaseId}
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
        rotationDeg={selectedFlower?.rotation ?? 0}
        scalePct={Math.round((selectedFlower?.scale ?? 1) * 100)}
        onRotationSlider={(deg) => {
          if (selectedId) patchFlower(selectedId, { rotation: deg })
        }}
        onScaleSlider={(pct) => {
          if (selectedId) patchFlower(selectedId, { scale: pct / 100 })
        }}
        canClear={flowers.length > 0}
      />

      <main className="order-1 flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden p-4 lg:order-2 lg:p-6">
        <header className="shrink-0 space-y-1">
          <p className="text-xs tracking-[0.35em] text-stone-400">紙上花席</p>
          <h2 className="text-xl font-medium text-stone-800">插花·無聲之詩</h2>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-auto pb-2">
          <CompositionCanvas
            room={room}
            vaseId={vaseId}
            flowers={flowers}
            selectedId={selectedId}
            onSelectFlower={setSelectedId}
            onUpdateFlower={patchFlower}
            onMouth={onMouth}
          />
        </div>
      </main>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { CompositionCanvas } from './components/CompositionCanvas'
import { ControlPanel } from './components/ControlPanel'
import {
  FLOWER_BEHIND_VASE_Z,
  FLOWER_FRONT_Z,
} from './constants/layers'
import { SPECIES_COLOR_HINTS } from './data/chineseColors'
import type { ContainerKind, PlacedFlower, RoomId, SpeciesId } from './types'

export default function App() {
  const [container, setContainer] = useState<ContainerKind>('ping')
  const [room, setRoom] = useState<RoomId>('shufang')
  const [librarySpecies, setLibrarySpecies] = useState<SpeciesId>('peony')
  const [pendingColorId, setPendingColorId] = useState(
    SPECIES_COLOR_HINTS.peony[0],
  )
  const [flowers, setFlowers] = useState<PlacedFlower[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleLibrarySpecies(s: SpeciesId) {
    setLibrarySpecies(s)
    const hints = SPECIES_COLOR_HINTS[s]
    setPendingColorId((prev) =>
      hints.includes(prev) ? prev : (hints[0] ?? prev),
    )
  }

  const selectedFlower = useMemo(
    () => flowers.find((f) => f.id === selectedId) ?? null,
    [flowers, selectedId],
  )

  function patchFlower(id: string, patch: Partial<PlacedFlower>) {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    )
  }

  function addFlower() {
    const id = crypto.randomUUID()
    setFlowers((prev) => [
      ...prev,
      {
        id,
        species: librarySpecies,
        colorId: pendingColorId,
        x: 400 + (prev.length % 4) * 28,
        y: 228 + Math.floor(prev.length / 4) * 26,
        rotation: -8 + (prev.length % 6) * 2.5,
        scale: 1,
        zIndex: FLOWER_FRONT_Z,
      },
    ])
    setSelectedId(id)
  }

  return (
    <div className="flex h-[100dvh] min-h-[560px] bg-(--color-zen-paper) text-(--color-zen-ink) font-[family-name:var(--font-serif-sc)]">
      <ControlPanel
        container={container}
        onContainer={setContainer}
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
        rotationDeg={selectedFlower?.rotation ?? 0}
        scalePct={Math.round((selectedFlower?.scale ?? 1) * 100)}
        onRotationSlider={(deg) => {
          if (selectedId) patchFlower(selectedId, { rotation: deg })
        }}
        onScaleSlider={(pct) => {
          if (selectedId) patchFlower(selectedId, { scale: pct / 100 })
        }}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-hidden p-6">
        <header className="shrink-0 space-y-1">
          <p className="text-xs tracking-[0.35em] text-stone-400">
            DIGITAL FLOWER ART · ZEN INTERFACE
          </p>
          <h2 className="text-xl font-medium text-stone-800">
            插花·無聲之詩
          </h2>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-auto pb-4">
          <CompositionCanvas
            room={room}
            container={container}
            flowers={flowers}
            selectedId={selectedId}
            onSelectFlower={setSelectedId}
            onUpdateFlower={(id, patch) => patchFlower(id, patch)}
          />
        </div>
      </main>
    </div>
  )
}

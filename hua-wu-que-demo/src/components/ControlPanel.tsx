import { flowerImagePath } from '../data/assetPaths'
import { FLOWERS, getFlower } from '../data/flowers'
import { getVase } from '../data/vases'
import {
  FLOWER_BEHIND_VASE_Z,
  FLOWER_FRONT_Z,
  VASE_LAYER_Z,
} from '../constants/layers'
import type { PlacedFlower, RoomId, SpeciesId, VaseId } from '../types'
import { ChineseColorSelector } from './ChineseColorSelector'
import { RoomSelect } from './RoomSelect'
import { VaseSelect } from './VaseSelect'

interface ControlPanelProps {
  vaseId: VaseId
  onVase: (id: VaseId) => void
  room: RoomId
  onRoom: (id: RoomId) => void
  librarySpecies: SpeciesId
  onLibrarySpecies: (id: SpeciesId) => void
  pendingColorId: string
  onPendingColor: (id: string) => void
  onAddFlower: () => void
  selectedFlower: PlacedFlower | null
  onPatchSelectedFlower: (patch: Partial<PlacedFlower>) => void
  onBringFront: () => void
  onSendBack: () => void
  onDeleteSelected: () => void
  onClear: () => void
  rotationDeg: number
  scalePct: number
  onRotationSlider: (deg: number) => void
  onScaleSlider: (pct: number) => void
  canClear: boolean
}

export function ControlPanel(props: ControlPanelProps) {
  const {
    vaseId,
    onVase,
    room,
    onRoom,
    librarySpecies,
    onLibrarySpecies,
    pendingColorId,
    onPendingColor,
    onAddFlower,
    selectedFlower,
    onPatchSelectedFlower,
    onBringFront,
    onSendBack,
    onDeleteSelected,
    onClear,
    rotationDeg,
    scalePct,
    onRotationSlider,
    onScaleSlider,
    canClear,
  } = props

  const vase = getVase(vaseId)
  const library = getFlower(librarySpecies)
  const behind =
    selectedFlower != null && selectedFlower.zIndex < VASE_LAYER_Z
  const named = FLOWERS.filter((flower) => flower.group === 'flower')
  const foliage = FLOWERS.filter((flower) => flower.group === 'foliage')

  return (
    <aside className="order-2 flex max-h-[46dvh] w-full min-h-0 flex-col gap-5 overflow-y-auto border-t border-stone-200/90 bg-[#fbfaf7] p-5 shadow-[inset_0_1px_0_rgba(44,40,36,0.04)] lg:order-1 lg:h-full lg:max-h-none lg:max-w-[320px] lg:border-t-0 lg:border-r lg:shadow-[inset_-1px_0_0_rgba(44,40,36,0.04)]">
      <a
        href="../index.html"
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-300/80 bg-white/90 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-white hover:text-stone-900"
      >
        <span aria-hidden>←</span>
        返回主頁
      </a>

      <header className="space-y-1 border-b border-stone-200/80 pb-4">
        <p className="text-xs tracking-[0.28em] text-stone-400">古典插花</p>
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
          花無缺
        </h1>
        <p className="text-sm leading-relaxed text-stone-500">
          選一只瓶子，把折枝放進瓶口。
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">花器</h2>
        <VaseSelect value={vaseId} onChange={onVase} />
        <p className="text-[11px] leading-relaxed text-stone-500">
          {vase.painting} · {vase.name}
        </p>
        <p className="text-[11px] leading-relaxed text-stone-400">{vase.note}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">居室背景</h2>
        <RoomSelect value={room} onChange={onRoom} />
      </section>

      <section className="space-y-3 rounded-xl border border-stone-200/90 bg-white/70 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-stone-700">名花</h2>
          <button
            type="button"
            onClick={onAddFlower}
            className="rounded-full bg-stone-900 px-3 py-1 text-xs text-[#f7f4ee] shadow-sm transition hover:bg-stone-800"
          >
            放入瓶口
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {named.map((flower) => (
            <SpeciesButton
              key={flower.id}
              species={flower.id}
              label={flower.labelZh}
              colorId={
                flower.id === librarySpecies
                  ? pendingColorId
                  : flower.colors[0].id
              }
              active={librarySpecies === flower.id}
              onClick={() => onLibrarySpecies(flower.id)}
            />
          ))}
        </div>
        <ChineseColorSelector
          colors={library.colors}
          value={pendingColorId}
          onChange={onPendingColor}
        />
        <h3 className="pt-1 text-sm font-medium text-stone-700">配枝</h3>
        <div className="grid grid-cols-4 gap-2">
          {foliage.map((flower) => (
            <SpeciesButton
              key={flower.id}
              species={flower.id}
              label={flower.labelZh}
              colorId={flower.colors[0].id}
              active={librarySpecies === flower.id}
              onClick={() => onLibrarySpecies(flower.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-dashed border-stone-300/90 bg-stone-50/70 p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-stone-700">選取花材</h2>
          <button
            type="button"
            onClick={onClear}
            disabled={!canClear}
            className="text-xs text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
          >
            清空花席
          </button>
        </div>
        {!selectedFlower ? (
          <p className="text-xs leading-relaxed text-stone-400">
            於畫布點選一枝，可改色、轉枝、縮放，或收到瓶後。
          </p>
        ) : (
          <>
            <p className="text-xs text-stone-500">
              {getFlower(selectedFlower.species).labelZh}
            </p>
            <ChineseColorSelector
              colors={getFlower(selectedFlower.species).colors}
              value={selectedFlower.colorId}
              onChange={(id) => onPatchSelectedFlower({ colorId: id })}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onBringFront}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:border-stone-400"
              >
                移到瓶前 ({FLOWER_FRONT_Z})
              </button>
              <button
                type="button"
                onClick={onSendBack}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:border-stone-400"
              >
                收到瓶後 ({FLOWER_BEHIND_VASE_Z})
              </button>
              <button
                type="button"
                onClick={onDeleteSelected}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:border-stone-400"
              >
                刪除此枝
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              目前層次：{behind ? '瓶後' : '瓶前'}
            </p>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              <span className="flex justify-between">
                <span>仰俯角度</span>
                <span>{rotationDeg.toFixed(0)}°</span>
              </span>
              <input
                type="range"
                min={-85}
                max={85}
                step={1}
                value={rotationDeg}
                onChange={(event) =>
                  onRotationSlider(Number(event.target.value))
                }
                className="accent-stone-800"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              <span className="flex justify-between">
                <span>枝態尺度</span>
                <span>{scalePct}%</span>
              </span>
              <input
                type="range"
                min={35}
                max={240}
                step={1}
                value={scalePct}
                onChange={(event) => onScaleSlider(Number(event.target.value))}
                className="accent-stone-800"
              />
            </label>
          </>
        )}
      </section>
    </aside>
  )
}

function SpeciesButton({
  species,
  label,
  colorId,
  active,
  onClick,
}: {
  species: SpeciesId
  label: string
  colorId: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-xs transition',
        active
          ? 'border-amber-900/35 bg-amber-50/80'
          : 'border-stone-200/80 hover:border-stone-300',
      ].join(' ')}
    >
      <img
        src={flowerImagePath(species, colorId)}
        alt=""
        className="h-12 w-full object-contain"
      />
      <span className="text-stone-700">{label}</span>
    </button>
  )
}

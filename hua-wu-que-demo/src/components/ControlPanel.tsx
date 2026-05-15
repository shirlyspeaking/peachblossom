import { ChineseColorSelector } from './ChineseColorSelector'
import {
  FLOWER_BEHIND_VASE_Z,
  FLOWER_FRONT_Z,
  VASE_LAYER_Z,
} from '../constants/layers'
import type { ContainerKind, PlacedFlower, RoomId, SpeciesId } from '../types'

const containers: { id: ContainerKind; zh: string; sub: string }[] = [
  { id: 'ping', zh: '瓶花', sub: 'Ping — 高瓶清雅' },
  { id: 'lan', zh: '籃花', sub: 'Lan — 藤籃野趣' },
  { id: 'pan', zh: '盤花', sub: 'Pan — 淺盤留白' },
]

const rooms: { id: RoomId; zh: string }[] = [
  { id: 'shufang', zh: '書齋疏影' },
  { id: 'tea', zh: '茶寮靜照' },
  { id: 'window', zh: '窗影留白' },
]

const speciesList: { id: SpeciesId; zh: string }[] = [
  { id: 'peony', zh: '牡丹' },
  { id: 'lotus', zh: '荷花' },
  { id: 'plum', zh: '梅花' },
  { id: 'magnolia', zh: '玉蘭' },
]

interface ControlPanelProps {
  container: ContainerKind
  onContainer: (v: ContainerKind) => void
  room: RoomId
  onRoom: (v: RoomId) => void
  librarySpecies: SpeciesId
  onLibrarySpecies: (v: SpeciesId) => void
  pendingColorId: string
  onPendingColor: (id: string) => void
  onAddFlower: () => void
  selectedFlower: PlacedFlower | null
  onPatchSelectedFlower: (patch: Partial<PlacedFlower>) => void
  onBringFront: () => void
  onSendBack: () => void
  rotationDeg: number
  scalePct: number
  onRotationSlider: (deg: number) => void
  onScaleSlider: (pct: number) => void
}

export function ControlPanel(props: ControlPanelProps) {
  const {
    container,
    onContainer,
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
    rotationDeg,
    scalePct,
    onRotationSlider,
    onScaleSlider,
  } = props

  const selectedId = selectedFlower?.id ?? null
  const behind =
    selectedFlower != null && selectedFlower.zIndex < VASE_LAYER_Z

  return (
    <aside className="flex h-full min-h-0 w-full max-w-[320px] flex-col gap-5 overflow-y-auto border-r border-stone-200/90 bg-[#fbfaf7] p-5 shadow-[inset_-1px_0_0_rgba(44,40,36,0.04)]">
      <a
        href="../index.html"
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-300/80 bg-white/90 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-white hover:text-stone-900"
      >
        <span aria-hidden>←</span>
        返回主頁
      </a>

      <header className="space-y-1 border-b border-stone-200/80 pb-4">
        <p className="text-xs tracking-[0.28em] text-stone-400">中式插花</p>
        <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
          花無缺
        </h1>
        <p className="text-sm leading-relaxed text-stone-500">
          以留白與景深，佈一席紙上花席。
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">花器</h2>
        <div className="grid gap-2">
          {containers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onContainer(c.id)}
              className={[
                'rounded-xl border px-3 py-2 text-left transition',
                container === c.id
                  ? 'border-amber-900/35 bg-white shadow-sm'
                  : 'border-stone-200/80 hover:border-stone-300',
              ].join(' ')}
            >
              <div className="text-sm font-medium text-stone-800">{c.zh}</div>
              <div className="text-[11px] text-stone-400">{c.sub}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">居室背景</h2>
        <div className="flex flex-wrap gap-2">
          {rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoom(r.id)}
              className={[
                'rounded-full px-3 py-1.5 text-xs transition',
                room === r.id
                  ? 'bg-stone-800 text-[#f7f4ee]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/90',
              ].join(' ')}
            >
              {r.zh}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-stone-200/90 bg-white/70 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-stone-700">花材庫</h2>
          <button
            type="button"
            onClick={onAddFlower}
            className="rounded-full bg-stone-900 px-3 py-1 text-xs text-[#f7f4ee] shadow-sm transition hover:bg-stone-800"
          >
            點擊加入畫布
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {speciesList.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onLibrarySpecies(s.id)}
              className={[
                'rounded-lg border px-2 py-2 text-sm transition',
                librarySpecies === s.id
                  ? 'border-amber-900/35 bg-amber-50/80'
                  : 'border-stone-200/80 hover:border-stone-300',
              ].join(' ')}
            >
              {s.zh}
            </button>
          ))}
        </div>
        <ChineseColorSelector
          species={librarySpecies}
          value={pendingColorId}
          onChange={onPendingColor}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-dashed border-stone-300/90 bg-stone-50/70 p-3">
        <h2 className="text-sm font-medium text-stone-700">選取花材</h2>
        {!selectedId ? (
          <p className="text-xs leading-relaxed text-stone-400">
            於畫布點選一枝花以調整層次、角度與尺寸。
          </p>
        ) : (
          <>
            {selectedFlower ? (
              <ChineseColorSelector
                species={selectedFlower.species}
                value={selectedFlower.colorId}
                onChange={(id) => onPatchSelectedFlower({ colorId: id })}
                prioritizeHints={false}
              />
            ) : null}
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
            </div>
            <p className="text-[11px] text-stone-400">
              目前層次：
              {behind ? '瓶後（景深內）' : '瓶前（為前景枝）'}
              {selectedFlower != null ? `（z=${selectedFlower.zIndex}）` : ''}
            </p>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              <span className="flex justify-between">
                <span>仰俯角度（旋轉）</span>
                <span>{rotationDeg.toFixed(0)}°</span>
              </span>
              <input
                type="range"
                min={-85}
                max={85}
                step={1}
                value={rotationDeg}
                onChange={(e) => onRotationSlider(Number(e.target.value))}
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
                onChange={(e) => onScaleSlider(Number(e.target.value))}
                className="accent-stone-800"
              />
            </label>
          </>
        )}
      </section>

      <footer className="mt-auto pt-2 text-[11px] leading-relaxed text-stone-400">
        素材占位路徑：<code className="rounded bg-stone-100 px-1">/assets/vases/…</code>、
        <code className="rounded bg-stone-100 px-1">/assets/flowers/…</code>、
        <code className="rounded bg-stone-100 px-1">/assets/rooms/…</code>
      </footer>
    </aside>
  )
}

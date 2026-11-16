import type { PointerEvent as ReactPointerEvent } from 'react'
import { flowerImagePath } from '../data/assetPaths'
import { FLOWERS, getFlower } from '../data/flowers'
import { getVase } from '../data/vases'
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
  onBeginDrag: (
    species: SpeciesId,
    colorId: string,
    event: ReactPointerEvent<HTMLElement>,
  ) => void
  selectedFlower: PlacedFlower | null
  onPatchSelectedFlower: (patch: Partial<PlacedFlower>) => void
  onBringFront: () => void
  onSendBack: () => void
  onDeleteSelected: () => void
  onClear: () => void
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
    onBeginDrag,
    selectedFlower,
    onPatchSelectedFlower,
    onBringFront,
    onSendBack,
    onDeleteSelected,
    onClear,
    canClear,
  } = props

  const vase = getVase(vaseId)
  const library = getFlower(librarySpecies)
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
        <ul className="space-y-1 text-sm leading-relaxed text-stone-500">
          <li>把花拖到花瓶上，枝底就插進瓶裡。</li>
          <li>拖花可以移動。拖黑點可以放大縮小。</li>
          <li>左右拖「轉」：向右拖，花往右轉；向左拖，花往左轉。滾輪也一樣。</li>
        </ul>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">花器</h2>
        <VaseSelect value={vaseId} onChange={onVase} />
        <p className="text-[11px] leading-relaxed text-stone-500">{vase.note}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">居室背景</h2>
        <RoomSelect value={room} onChange={onRoom} />
      </section>

      <section className="space-y-3 rounded-xl border border-stone-200/90 bg-white/70 p-3 shadow-sm">
        <h2 className="text-sm font-medium text-stone-700">名花</h2>
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
              onDragStart={(event) =>
                onBeginDrag(
                  flower.id,
                  flower.id === librarySpecies
                    ? pendingColorId
                    : flower.colors[0].id,
                  event,
                )
              }
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
              onDragStart={(event) =>
                onBeginDrag(flower.id, flower.colors[0].id, event)
              }
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
            點一枝，可改色、移到瓶前或瓶後、刪除。選中後，左右拖「轉」來轉向。
          </p>
        ) : (
          <>
            <p className="text-xs text-stone-500">
              {getFlower(selectedFlower.species).labelZh}
              {' · '}
              {selectedFlower.rotation === 0
                ? '現在是直立的'
                : selectedFlower.rotation > 0
                  ? `往右偏了 ${Math.round(selectedFlower.rotation)} 度`
                  : `往左偏了 ${Math.round(-selectedFlower.rotation)} 度`}
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
                移到瓶前
              </button>
              <button
                type="button"
                onClick={onSendBack}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:border-stone-400"
              >
                收到瓶後
              </button>
              <button
                type="button"
                onClick={onDeleteSelected}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:border-stone-400"
              >
                刪除此枝
              </button>
            </div>
          </>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-stone-700">宋代插花</h2>
        <div className="aspect-video overflow-hidden rounded-lg border border-stone-200 bg-stone-900">
          <iframe
            title="鄧菲：自然美學——宋代的插花風尚"
            src="https://player.bilibili.com/player.html?bvid=BV1qC4y197CG&page=1&autoplay=0"
            className="h-full w-full"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        </div>
        <p className="text-[11px] leading-relaxed text-stone-500">
          鄧菲〈自然美學——宋代的插花風尚〉，上海圖書館。講宋人怎麼看花、怎麼插。
        </p>
        <ul className="space-y-1 text-[11px] leading-relaxed text-stone-500">
          <li>
            <a
              className="underline-offset-2 hover:text-stone-800 hover:underline"
              href="https://www.bilibili.com/video/BV1LdQPYkEJD/"
              target="_blank"
              rel="noreferrer"
            >
              《風雅宋》〈滿插瓶花罷出游〉
            </a>
          </li>
          <li>
            <a
              className="underline-offset-2 hover:text-stone-800 hover:underline"
              href="https://tv.cctv.cn/2019/03/31/VIDEMXy4tzSDRNc8e7pVrZEN190331.shtml"
              target="_blank"
              rel="noreferrer"
            >
              《我有傳家寶》瓶中插花
            </a>
          </li>
        </ul>
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
  onDragStart,
}: {
  species: SpeciesId
  label: string
  colorId: string
  active: boolean
  onClick: () => void
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void
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
        draggable={false}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.stopPropagation()
          onClick()
          onDragStart(event)
        }}
        className="h-12 w-full cursor-grab object-contain touch-none"
      />
      <span className="text-stone-700">{label}</span>
    </button>
  )
}

import { SPECIES_COLOR_HINTS, TRADITIONAL_COLORS } from '../data/chineseColors'
import type { SpeciesId } from '../types'

export interface ChineseColorSelectorProps {
  species: SpeciesId
  value: string
  onChange: (colorId: string) => void
  disabled?: boolean
  /** When true, emphasize species-suggested hues first */
  prioritizeHints?: boolean
}

function sortColorsForSpecies(
  species: SpeciesId,
  prioritizeHints: boolean,
): typeof TRADITIONAL_COLORS {
  const hints = new Set(SPECIES_COLOR_HINTS[species])
  const copy = [...TRADITIONAL_COLORS]
  if (!prioritizeHints) return copy
  return copy.sort((a, b) => {
    const ah = hints.has(a.id) ? 0 : 1
    const bh = hints.has(b.id) ? 0 : 1
    return ah - bh
  })
}

/**
 * 「傳統色」選擇器：以實際 hex 填色預覽，選定值用於換圖路徑或 SVG/濾鏡著色。
 */
export function ChineseColorSelector({
  species,
  value,
  onChange,
  disabled,
  prioritizeHints = true,
}: ChineseColorSelectorProps) {
  const ordered = sortColorsForSpecies(species, prioritizeHints)

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-stone-700">傳統色</span>
        <span className="text-xs text-stone-400">
          {species === 'peony'
            ? '牡丹'
            : species === 'lotus'
              ? '荷花'
              : species === 'plum'
                ? '梅花'
                : '玉蘭'}
        </span>
      </div>
      <div
        className="grid grid-cols-4 gap-2"
        role="listbox"
        aria-label="傳統色彩"
      >
        {ordered.map((c) => {
          const selected = c.id === value
          return (
            <button
              key={c.id}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={disabled}
              onClick={() => onChange(c.id)}
              className={[
                'group flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition',
                selected
                  ? 'border-amber-800/70 bg-white shadow-sm ring-1 ring-amber-900/25'
                  : 'border-stone-200/80 bg-stone-50/80 hover:border-stone-300',
                disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              <span
                className="h-9 w-9 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: c.hex }}
                title={`${c.labelZh} ${c.hex}`}
              />
              <span className="line-clamp-1 w-full text-center text-[11px] leading-tight text-stone-600">
                {c.labelZh}
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-[11px] leading-relaxed text-stone-400">
        色系對應素材：<code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[10px]">
          /assets/flowers/{species}_色名id.png
        </code>
        ；缺檔時改以向量花色呈現並可套用色相微調。
      </p>
    </div>
  )
}

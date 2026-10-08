import type { FlowerColor } from '../types'

interface ChineseColorSelectorProps {
  colors: FlowerColor[]
  value: string
  onChange: (colorId: string) => void
  legend?: string
}

/** Named color swatches. Each id maps to its own photograph. */
export function ChineseColorSelector({
  colors,
  value,
  onChange,
  legend = '花色',
}: ChineseColorSelectorProps) {
  if (colors.length <= 1) return null

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-stone-700">{legend}</span>
      <div className="grid grid-cols-3 gap-2" role="listbox" aria-label={legend}>
        {colors.map((color) => {
          const selected = color.id === value
          return (
            <button
              key={color.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(color.id)}
              className={[
                'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition',
                selected
                  ? 'border-amber-800/70 bg-white shadow-sm ring-1 ring-amber-900/20'
                  : 'border-stone-200/80 bg-stone-50/80 hover:border-stone-300',
              ].join(' ')}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <span className="truncate text-xs text-stone-700">
                {color.labelZh}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

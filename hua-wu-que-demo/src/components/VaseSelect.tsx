import { useEffect, useId, useRef, useState } from 'react'
import { vaseImagePath } from '../data/assetPaths'
import { VASES, getVase } from '../data/vases'
import type { VaseId } from '../types'

interface VaseSelectProps {
  value: VaseId
  onChange: (id: VaseId) => void
}

export function VaseSelect({ value, onChange }: VaseSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = getVase(value)

  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-stone-300/90 bg-white px-3 py-2 text-left shadow-sm transition hover:border-stone-400"
      >
        <img
          src={vaseImagePath(current.id)}
          alt=""
          className="h-14 w-10 shrink-0 object-contain"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-stone-800">
            {current.painting}
          </span>
          <span className="block truncate text-xs text-stone-500">
            {current.name}
          </span>
        </span>
        <span aria-hidden className="text-xs text-stone-400">
          {open ? '▴' : '▾'}
        </span>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="花器"
          className="absolute z-30 mt-1 max-h-96 w-full overflow-auto rounded-xl border border-stone-200 bg-[#fbfaf7] p-1 shadow-lg"
        >
          {VASES.map((vase) => {
            const selected = vase.id === value
            return (
              <li key={vase.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(vase.id)
                    setOpen(false)
                  }}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left',
                    selected ? 'bg-white shadow-sm' : 'hover:bg-white/80',
                  ].join(' ')}
                >
                  <img
                    src={vaseImagePath(vase.id)}
                    alt=""
                    className="h-12 w-9 shrink-0 object-contain"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-stone-800">
                      {vase.painting} · {vase.name}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { roomImagePath } from '../data/assetPaths'
import { ROOMS, getRoom } from '../data/rooms'
import type { RoomId } from '../types'

interface RoomSelectProps {
  value: RoomId
  onChange: (id: RoomId) => void
}

export function RoomSelect({ value, onChange }: RoomSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = getRoom(value)

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
        onClick={() => setOpen((next) => !next)}
        className="flex w-full items-center gap-3 rounded-xl border border-stone-300/90 bg-white px-2 py-2 text-left shadow-sm transition hover:border-stone-400"
      >
        <img
          src={roomImagePath(current.id)}
          alt=""
          className="h-12 w-16 shrink-0 rounded-md object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-stone-800">
            {current.label}
          </span>
          <span className="block truncate text-[11px] text-stone-500">
            {current.note}
          </span>
        </span>
        <span aria-hidden className="px-1 text-xs text-stone-400">
          {open ? '▴' : '▾'}
        </span>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="居室背景"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-stone-200 bg-[#fbfaf7] p-1 shadow-lg"
        >
          {ROOMS.map((room) => {
            const selected = room.id === value
            return (
              <li key={room.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(room.id)
                    setOpen(false)
                  }}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left',
                    selected ? 'bg-white shadow-sm' : 'hover:bg-white/80',
                  ].join(' ')}
                >
                  <img
                    src={roomImagePath(room.id)}
                    alt=""
                    className="h-11 w-16 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-stone-800">
                      {room.label}
                    </span>
                    <span className="block truncate text-[11px] text-stone-500">
                      {room.note}
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

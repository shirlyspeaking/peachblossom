import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

interface DragState {
  mode: 'move' | 'scale'
  px: number
  py: number
  ox: number
  oy: number
  os: number
}

interface DirectManipulateOptions {
  enabled: boolean
  canvas: HTMLElement | null
  x: number
  y: number
  scale: number
  minScale: number
  maxScale: number
  /** 1: pointer down increases y. -1: pointer down decreases y (bottom-anchored). */
  ySign: 1 | -1
  minX: number
  maxX: number
  minY: number
  maxY: number
  onMove: (x: number, y: number) => void
  onScale: (scale: number) => void
  onSelect: () => void
}

export function useDirectManipulate(options: DirectManipulateOptions) {
  const drag = useRef<DragState | null>(null)

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!options.enabled || event.button !== 0) return
    event.stopPropagation()
    options.onSelect()
    const handle = (event.target as HTMLElement).closest?.('[data-scale-handle]')
    drag.current = {
      mode: event.altKey || handle ? 'scale' : 'move',
      px: event.clientX,
      py: event.clientY,
      ox: options.x,
      oy: options.y,
      os: options.scale,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const current = drag.current
    if (!current || !options.enabled) return
    if (current.mode === 'scale') {
      const delta =
        current.py - event.clientY + (event.clientX - current.px)
      options.onScale(
        clamp(current.os + delta / 180, options.minScale, options.maxScale),
      )
      return
    }
    const rect = options.canvas?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    const dx = ((event.clientX - current.px) / rect.width) * 100
    const dy =
      ((event.clientY - current.py) / rect.height) * 100 * options.ySign
    options.onMove(
      clamp(current.ox + dx, options.minX, options.maxX),
      clamp(current.oy + dy, options.minY, options.maxY),
    )
  }

  function endDrag() {
    drag.current = null
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

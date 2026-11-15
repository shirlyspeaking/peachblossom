import { useState } from 'react'
import { flowerImagePath } from '../data/assetPaths'
import type { PlacedFlower } from '../types'
import { useDirectManipulate } from '../useDirectManipulate'
import { ScaleHandle } from './ScaleHandle'

interface FlowerPieceProps {
  flower: PlacedFlower
  selected: boolean
  canvas: HTMLElement | null
  /** Drawn under the vase so the cut end stays hidden. Not draggable. */
  passive?: boolean
  layerZ?: number
  onSelect: () => void
  onChange: (patch: Partial<PlacedFlower>) => void
}

export function FlowerPiece({
  flower,
  selected,
  canvas,
  passive = false,
  layerZ,
  onSelect,
  onChange,
}: FlowerPieceProps) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
  const src = flowerImagePath(flower.species, flower.colorId)
  const broken = brokenSrc === src
  const gesture = useDirectManipulate({
    enabled: !passive,
    canvas,
    x: flower.x,
    y: flower.y,
    scale: flower.scale,
    minScale: 0.35,
    maxScale: 2.4,
    ySign: 1,
    minX: -8,
    maxX: 108,
    minY: -8,
    maxY: 108,
    onMove: (x, y) => onChange({ x, y }),
    onScale: (scale) => onChange({ scale }),
    onSelect,
  })

  return (
    <div
      className={[
        'absolute size-0',
        passive ? 'pointer-events-none' : 'pointer-events-auto',
      ].join(' ')}
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        zIndex: layerZ ?? flower.zIndex,
      }}
    >
      <div className="absolute bottom-0 left-0 -translate-x-1/2">
        <div
          className={[
            'relative touch-none',
            passive
              ? 'pointer-events-none'
              : 'pointer-events-auto cursor-grab active:cursor-grabbing',
          ].join(' ')}
          style={{
            transform: `rotate(${flower.rotation}deg) scale(${flower.scale})`,
            transformOrigin: 'center bottom',
          }}
          onPointerDown={gesture.onPointerDown}
          onPointerMove={gesture.onPointerMove}
          onPointerUp={gesture.onPointerUp}
          onPointerCancel={gesture.onPointerCancel}
          onWheel={(event) => {
            if (passive || !selected) return
            event.preventDefault()
            event.stopPropagation()
            if (event.altKey) {
              const scale = Math.min(
                2.4,
                Math.max(0.35, flower.scale - event.deltaY * 0.0015),
              )
              onChange({ scale })
              return
            }
            onChange({ rotation: flower.rotation + event.deltaY * -0.15 })
          }}
        >
          {broken ? null : (
            <img
              src={src}
              alt=""
              draggable={false}
              onError={() => setBrokenSrc(src)}
              className={[
                'block h-[42cqh] w-auto max-w-[64cqw] select-none',
                selected
                  ? 'drop-shadow-[0_0_8px_rgba(120,78,32,0.85)]'
                  : 'drop-shadow-[0_10px_16px_rgba(44,40,36,0.18)]',
              ].join(' ')}
            />
          )}
          {selected && !passive ? <ScaleHandle /> : null}
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { useState } from 'react'
import { flowerImagePath } from '../data/assetPaths'
import type { PlacedFlower } from '../types'

interface FlowerPieceProps {
  flower: PlacedFlower
  selected: boolean
  canvas: HTMLElement | null
  /** Drawn under the vase so the cut end stays hidden. Not draggable. */
  passive?: boolean
  layerZ?: number
  onSelect: () => void
  onDragEnd: (dxPercent: number, dyPercent: number) => void
  onWheelGesture: (deltaRotate: number, deltaScale: number) => void
}

export function FlowerPiece({
  flower,
  selected,
  canvas,
  passive = false,
  layerZ,
  onSelect,
  onDragEnd,
  onWheelGesture,
}: FlowerPieceProps) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
  const src = flowerImagePath(flower.species, flower.colorId)
  const broken = brokenSrc === src

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
      <motion.div
        drag={!passive}
        dragMomentum={false}
        dragElastic={0.04}
        onPointerDown={(event) => {
          event.stopPropagation()
          onSelect()
        }}
        onDragEnd={(_, info) => {
          const rect = canvas?.getBoundingClientRect()
          if (!rect || rect.width === 0 || rect.height === 0) return
          onDragEnd(
            (info.offset.x / rect.width) * 100,
            (info.offset.y / rect.height) * 100,
          )
        }}
        onWheel={(event) => {
          if (!selected) return
          event.preventDefault()
          event.stopPropagation()
          const rotateStep = event.altKey ? 0 : event.deltaY * -0.15
          const scaleStep = event.altKey ? -event.deltaY * 0.0015 : 0
          onWheelGesture(rotateStep, scaleStep)
        }}
        className={[
          'cursor-grab active:cursor-grabbing',
          passive ? 'pointer-events-none' : 'pointer-events-auto',
        ].join(' ')}
        style={{ transformOrigin: 'center bottom' }}
        animate={{
          rotate: flower.rotation,
          scale: flower.scale,
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
      </motion.div>
      </div>
    </div>
  )
}

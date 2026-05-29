import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { flowerImagePath } from '../data/assetPaths'
import { getColorById } from '../data/chineseColors'
import type { PlacedFlower } from '../types'
import { FlowerPlaceholder } from './FlowerPlaceholder'

interface FlowerPieceProps {
  flower: PlacedFlower
  selected: boolean
  onSelect: () => void
  onDragEnd: (dx: number, dy: number) => void
  onWheelGesture: (deltaRotate: number, deltaScale: number) => void
}

export function FlowerPiece({
  flower,
  selected,
  onSelect,
  onDragEnd,
  onWheelGesture,
}: FlowerPieceProps) {
  const [imgBroken, setImgBroken] = useState(false)
  const src = useMemo(
    () => flowerImagePath(flower.species, flower.colorId),
    [flower.species, flower.colorId],
  )
  const color = getColorById(flower.colorId)

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.06}
      onPointerDown={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDragEnd={(_, info) => {
        onDragEnd(info.offset.x, info.offset.y)
      }}
      onWheel={(e) => {
        if (!selected) return
        e.preventDefault()
        e.stopPropagation()
        const rotateStep = e.altKey ? 0 : e.deltaY * -0.15
        const scaleStep = e.altKey ? -e.deltaY * 0.0015 : 0
        onWheelGesture(rotateStep, scaleStep)
      }}
      style={{
        position: 'absolute',
        left: flower.x,
        top: flower.y,
        zIndex: flower.zIndex,
        rotate: flower.rotation,
        scale: flower.scale,
        cursor: 'grab',
      }}
      whileTap={{ cursor: 'grabbing', opacity: 0.94 }}
      className={[
        'select-none rounded-lg outline-offset-4',
        selected ? 'outline outline-2 outline-amber-900/60' : '',
      ].join(' ')}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
        {!imgBroken ? (
          <img
            src={src}
            alt=""
            draggable={false}
            width={140}
            height={160}
            className="pointer-events-none max-h-[160px] max-w-[140px] object-contain"
            style={{
              /**
               * 點選顏色後若仍使用同一張去背圖，可微調 hue 讓色相略隨傳統色呼應；
               * 若有分色檔案建議移除 filter，完全依賴換圖。
               */
              filter: color ? subtleHarmonizeFilter(color.hex) : undefined,
            }}
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full bg-white/35 p-2 ring-1 ring-stone-300/60 backdrop-blur-[1px]"
            style={{
              mixBlendMode: 'multiply',
              boxShadow: `0 12px 28px rgba(44,40,36,0.12)`,
            }}
          >
            <FlowerPlaceholder
              species={flower.species}
              accentHex={color?.hex ?? '#c45c6a'}
              size={128}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/** Lightweight visual nudge toward selected 傳統色 — not physically accurate. */
function subtleHarmonizeFilter(hex: string): string {
  const { h, s } = hexToHsl(hex)
  const hueRotate = Math.round(h) - 25
  const saturate = Math.min(1.15, 0.85 + s * 0.4)
  return `saturate(${saturate}) hue-rotate(${hueRotate}deg) drop-shadow(0 4px 10px rgba(0,0,0,0.08))`
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const n = hex.replace('#', '')
  const v =
    n.length === 3
      ? parseInt(
          n
            .split('')
            .map((c) => c + c)
            .join(''),
          16,
        )
      : parseInt(n, 16)
  const r = ((v >> 16) & 255) / 255
  const g = ((v >> 8) & 255) / 255
  const b = (v & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: h * 360, s, l }
}

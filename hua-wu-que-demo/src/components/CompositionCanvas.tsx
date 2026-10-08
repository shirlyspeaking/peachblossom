import { useLayoutEffect, useRef, useState } from 'react'
import {
  FLOWER_BEHIND_VASE_Z,
  FLOWER_FRONT_Z,
  VASE_LAYER_Z,
} from '../constants/layers'
import { roomImagePath, vaseImagePath } from '../data/assetPaths'
import { getRoom } from '../data/rooms'
import { getVase } from '../data/vases'
import type { MouthPoint, PlacedFlower, RoomId, VaseId } from '../types'
import { FlowerPiece } from './FlowerPiece'

interface CompositionCanvasProps {
  room: RoomId
  vaseId: VaseId
  flowers: PlacedFlower[]
  selectedId: string | null
  onSelectFlower: (id: string | null) => void
  onUpdateFlower: (id: string, patch: Partial<PlacedFlower>) => void
  onMouth: (mouth: MouthPoint) => void
}

export function CompositionCanvas({
  room,
  vaseId,
  flowers,
  selectedId,
  onSelectFlower,
  onUpdateFlower,
  onMouth,
}: CompositionCanvasProps) {
  const [canvasEl, setCanvasEl] = useState<HTMLDivElement | null>(null)
  const vaseRef = useRef<HTMLImageElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const vase = getVase(vaseId)
  const roomSpec = getRoom(room)

  useLayoutEffect(() => {
    const canvas = canvasEl
    const img = vaseRef.current
    if (!canvas || !img) return

    const measure = () => {
      const c = canvas.getBoundingClientRect()
      const i = img.getBoundingClientRect()
      if (c.width === 0 || i.width === 0) return
      const lip =
        ((i.top - c.top + i.height * vase.mouthY) / c.height) * 100
      if (clipRef.current) {
        const belowLip = Math.min(100, Math.max(0, 100 - lip))
        clipRef.current.style.clipPath = `inset(0 0 ${belowLip}% 0)`
      }
      onMouth({
        x: ((i.left - c.left + i.width * vase.mouthX) / c.width) * 100,
        y: ((i.top - c.top + i.height * vase.rootY) / c.height) * 100,
      })
    }

    if (img.complete) measure()
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    img.addEventListener('load', measure)
    return () => {
      observer.disconnect()
      img.removeEventListener('load', measure)
    }
  }, [canvasEl, vase.mouthX, vase.mouthY, vase.rootY, vaseId, onMouth])

  const front = flowers.filter((flower) => flower.zIndex >= VASE_LAYER_Z)

  return (
    <div
      ref={setCanvasEl}
      className="relative mx-auto aspect-[5/4] w-full max-w-[920px] overflow-hidden rounded-2xl border border-stone-200/90 shadow-[0_22px_55px_rgba(44,40,36,0.12)] [container-type:size]"
      style={{ background: '#ebe6dc' }}
      onPointerDown={() => onSelectFlower(null)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${roomImagePath(room)})` }}
        role="img"
        aria-label={roomSpec.label}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20" />

      {flowers.map((flower) => (
        <FlowerPiece
          key={`${flower.id}-seat`}
          flower={flower}
          passive={flower.zIndex >= VASE_LAYER_Z}
          layerZ={FLOWER_BEHIND_VASE_Z}
          selected={flower.zIndex < VASE_LAYER_Z && flower.id === selectedId}
          canvas={canvasEl}
          onSelect={() => onSelectFlower(flower.id)}
          onDragEnd={(dx, dy) =>
            onUpdateFlower(flower.id, { x: flower.x + dx, y: flower.y + dy })
          }
          onWheelGesture={(dRot, dScale) =>
            onUpdateFlower(flower.id, {
              rotation: flower.rotation + dRot,
              scale: clamp(flower.scale + dScale, 0.35, 2.4),
            })
          }
        />
      ))}

      <div
        className="pointer-events-none absolute inset-x-[8%] bottom-[4%] flex items-end justify-center"
        style={{ zIndex: VASE_LAYER_Z }}
      >
        <img
          ref={vaseRef}
          src={vaseImagePath(vaseId)}
          alt={vase.name}
          className="h-[52cqh] w-auto max-w-full object-contain drop-shadow-[0_18px_28px_rgba(44,40,36,0.2)]"
        />
      </div>

      <div
        ref={clipRef}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: FLOWER_FRONT_Z }}
      >
        {front.map((flower) => (
          <FlowerPiece
            key={`${flower.id}-front`}
            flower={flower}
            selected={flower.id === selectedId}
            canvas={canvasEl}
            onSelect={() => onSelectFlower(flower.id)}
            onDragEnd={(dx, dy) =>
              onUpdateFlower(flower.id, { x: flower.x + dx, y: flower.y + dy })
            }
            onWheelGesture={(dRot, dScale) =>
              onUpdateFlower(flower.id, {
                rotation: flower.rotation + dRot,
                scale: clamp(flower.scale + dScale, 0.35, 2.4),
              })
            }
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/55 px-3 py-1 text-xs text-stone-600 backdrop-blur-sm">
        點選折枝；拖曳移位；滾輪轉枝，Alt 加滾輪縮放
      </div>
    </div>
  )
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

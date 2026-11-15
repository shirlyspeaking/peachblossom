import { useLayoutEffect, useRef, useState } from 'react'
import {
  FLOWER_BEHIND_VASE_Z,
  FLOWER_FRONT_Z,
  VASE_LAYER_Z,
} from '../constants/layers'
import { roomImagePath, vaseImagePath } from '../data/assetPaths'
import { getRoom } from '../data/rooms'
import { getVase } from '../data/vases'
import type { MouthPoint, PlacedFlower, RoomId, VaseId, VasePose } from '../types'
import { useDirectManipulate } from '../useDirectManipulate'
import { FlowerPiece } from './FlowerPiece'
import { ScaleHandle } from './ScaleHandle'

interface CompositionCanvasProps {
  room: RoomId
  vaseId: VaseId
  vasePose: VasePose
  vaseSelected: boolean
  flowers: PlacedFlower[]
  selectedId: string | null
  onSelectFlower: (id: string) => void
  onDeselect: () => void
  onSelectVase: () => void
  onUpdateFlower: (id: string, patch: Partial<PlacedFlower>) => void
  onVasePose: (pose: VasePose) => void
  onMouth: (mouth: MouthPoint) => void
}

export function CompositionCanvas({
  room,
  vaseId,
  vasePose,
  vaseSelected,
  flowers,
  selectedId,
  onSelectFlower,
  onDeselect,
  onSelectVase,
  onUpdateFlower,
  onVasePose,
  onMouth,
}: CompositionCanvasProps) {
  const [canvasEl, setCanvasEl] = useState<HTMLDivElement | null>(null)
  const [vaseEl, setVaseEl] = useState<HTMLImageElement | null>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const vase = getVase(vaseId)
  const roomSpec = getRoom(room)
  const vaseGesture = useDirectManipulate({
    enabled: true,
    canvas: canvasEl,
    x: vasePose.x,
    y: vasePose.bottom,
    scale: vasePose.scale,
    minScale: 0.4,
    maxScale: 2.2,
    ySign: -1,
    minX: 8,
    maxX: 92,
    minY: 0,
    maxY: 62,
    onMove: (x, bottom) => onVasePose({ ...vasePose, x, bottom }),
    onScale: (scale) => onVasePose({ ...vasePose, scale }),
    onSelect: onSelectVase,
  })

  useLayoutEffect(() => {
    const canvas = canvasEl
    const img = vaseEl
    if (!canvas || !img) return

    const measure = () => {
      const c = canvas.getBoundingClientRect()
      const i = img.getBoundingClientRect()
      if (c.width === 0 || i.width === 0) return
      const lip = ((i.top - c.top + i.height * vase.mouthY) / c.height) * 100
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
    observer.observe(img)
    img.addEventListener('load', measure)
    return () => {
      observer.disconnect()
      img.removeEventListener('load', measure)
    }
  }, [
    canvasEl,
    vaseEl,
    vase.mouthX,
    vase.mouthY,
    vase.rootY,
    vaseId,
    vasePose.x,
    vasePose.bottom,
    vasePose.scale,
    onMouth,
  ])

  const front = flowers.filter((flower) => flower.zIndex >= VASE_LAYER_Z)

  return (
    <div
      ref={setCanvasEl}
      className="relative mx-auto aspect-[5/4] w-full max-w-[920px] overflow-hidden rounded-2xl border border-stone-200/90 shadow-[0_22px_55px_rgba(44,40,36,0.12)] [container-type:size]"
      style={{ background: '#ebe6dc' }}
      onPointerDown={onDeselect}
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
          onChange={(patch) => onUpdateFlower(flower.id, patch)}
        />
      ))}

      <div
        className="pointer-events-auto absolute w-max touch-none"
        style={{
          left: `${vasePose.x}%`,
          bottom: `${vasePose.bottom}%`,
          zIndex: VASE_LAYER_Z,
          height: `${52 * vasePose.scale}cqh`,
          transform: 'translateX(-50%)',
        }}
        {...vaseGesture}
      >
        <img
          ref={setVaseEl}
          src={vaseImagePath(vaseId)}
          alt={vase.name}
          draggable={false}
          className={[
            'h-full w-auto max-w-[78cqw] cursor-grab object-contain select-none active:cursor-grabbing',
            vaseSelected
              ? 'drop-shadow-[0_0_12px_rgba(120,78,32,0.75)]'
              : 'drop-shadow-[0_18px_28px_rgba(44,40,36,0.2)]',
          ].join(' ')}
        />
        {vaseSelected ? <ScaleHandle /> : null}
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
            onChange={(patch) => onUpdateFlower(flower.id, patch)}
          />
        ))}
      </div>
    </div>
  )
}

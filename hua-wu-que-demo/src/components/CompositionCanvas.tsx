import { useState } from 'react'
import { VASE_LAYER_Z } from '../constants/layers'
import { roomImagePath, vaseImagePath } from '../data/assetPaths'
import type { ContainerKind, PlacedFlower, RoomId } from '../types'
import { FlowerPiece } from './FlowerPiece'

interface CompositionCanvasProps {
  room: RoomId
  container: ContainerKind
  flowers: PlacedFlower[]
  selectedId: string | null
  onSelectFlower: (id: string | null) => void
  onUpdateFlower: (id: string, patch: Partial<PlacedFlower>) => void
}

export function CompositionCanvas({
  room,
  container,
  flowers,
  selectedId,
  onSelectFlower,
  onUpdateFlower,
}: CompositionCanvasProps) {
  const bgUrl = roomImagePath(room)
  const vaseUrl = vaseImagePath(container)
  const [brokenByKind, setBrokenByKind] = useState<
    Partial<Record<ContainerKind, boolean>>
  >({})
  const vaseBroken = brokenByKind[container] === true

  return (
    <div
      className="relative mx-auto aspect-[5/4] w-full max-w-[920px] overflow-hidden rounded-2xl border border-stone-200/90 bg-[#ebe7df] shadow-[0_22px_55px_rgba(44,40,36,0.12)]"
      onPointerDown={() => onSelectFlower(null)}
    >
      {/* Room */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgUrl}), linear-gradient(160deg, #f3eee6, #dcd6cb)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-white/25" />

      {/* Floral layer (behind vase) */}
      {flowers
        .filter((f) => f.zIndex < VASE_LAYER_Z)
        .map((f) => (
          <FlowerPiece
            key={f.id}
            flower={f}
            selected={f.id === selectedId}
            onSelect={() => onSelectFlower(f.id)}
            onDragEnd={(dx, dy) =>
              onUpdateFlower(f.id, { x: f.x + dx, y: f.y + dy })
            }
            onWheelGesture={(dRot, dScale) =>
              onUpdateFlower(f.id, {
                rotation: f.rotation + dRot,
                scale: clamp(f.scale + dScale, 0.35, 2.4),
              })
            }
          />
        ))}

      {/* Vessel */}
      <div
        className="pointer-events-none absolute inset-x-[18%] bottom-[6%] top-auto flex items-end justify-center"
        style={{ zIndex: VASE_LAYER_Z }}
      >
        {!vaseBroken ? (
          <img
            src={vaseUrl}
            alt=""
            className="max-h-[58%] w-auto object-contain opacity-[0.97] drop-shadow-[0_18px_36px_rgba(44,40,36,0.22)]"
            width={280}
            height={340}
            onError={() =>
              setBrokenByKind((m) => ({ ...m, [container]: true }))
            }
          />
        ) : (
          <svg
            viewBox="0 0 200 260"
            className="h-[52%] w-auto max-w-[42%] opacity-95 drop-shadow-[0_18px_36px_rgba(44,40,36,0.22)]"
            aria-hidden
          >
            <defs>
              <linearGradient id="vGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#dcd6cf" />
                <stop offset="100%" stopColor="#a89682" />
              </linearGradient>
            </defs>
            <path
              fill="url(#vGrad)"
              stroke="rgba(44,40,36,0.28)"
              strokeWidth={1}
              d="M72 36 h56 l8 26 q22 10 34 38 q14 34 14 74 q0 52 -34 76 q-34 22 -76 22 q-42 0 -76 -22 q-34 -24 -34 -76 q0 -40 14 -74 q12 -28 34 -38 l8 -26z"
            />
          </svg>
        )}
      </div>

      {/* Floral layer (in front of vase) */}
      {flowers
        .filter((f) => f.zIndex >= VASE_LAYER_Z)
        .map((f) => (
          <FlowerPiece
            key={f.id}
            flower={f}
            selected={f.id === selectedId}
            onSelect={() => onSelectFlower(f.id)}
            onDragEnd={(dx, dy) =>
              onUpdateFlower(f.id, { x: f.x + dx, y: f.y + dy })
            }
            onWheelGesture={(dRot, dScale) =>
              onUpdateFlower(f.id, {
                rotation: f.rotation + dRot,
                scale: clamp(f.scale + dScale, 0.35, 2.4),
              })
            }
          />
        ))}

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/45 px-3 py-1 text-xs text-stone-600 backdrop-blur-sm">
        點選花材以編輯 · 滾輪旋轉 · Alt&nbsp;+&nbsp;滾輪縮放
      </div>
    </div>
  )
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

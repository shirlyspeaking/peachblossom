export function RotateHandle() {
  return (
    <span
      data-rotate-handle=""
      title="左右拖：向右拖，花往右轉；向左拖，花往左轉"
      className="absolute top-[30%] left-[104%] z-10 flex size-7 cursor-ew-resize items-center justify-center rounded-full border border-white bg-stone-800 text-[11px] text-white shadow-sm"
    >
      轉
    </span>
  )
}

export function ScaleHandle() {
  return (
    <span
      data-scale-handle=""
      aria-hidden
      title="拖動此角可放大縮小"
      className="absolute right-[8%] top-[18%] z-10 size-4 cursor-nwse-resize rounded-sm border border-white bg-stone-800 shadow-sm"
    />
  )
}

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

import { memo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Star } from 'lucide-react'
import clsx from 'clsx'

const categoryColors = {
  Học: 'from-sky-500 to-cyan-400',
  Làm: 'from-violet-500 to-fuchsia-500',
  Dạy: 'from-amber-500 to-orange-400',
  'Cá nhân': 'from-emerald-500 to-lime-400',
}

export default memo(function EventCard({ event, isSelected, onSelect, onResize }) {
  const [isResizing, setIsResizing] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event,
    disabled: isResizing, // Disable drag when resizing
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined

  const handleResizeStart = (e, handle) => {
    e.stopPropagation()
    setIsResizing(true)

    const startY = e.clientY
    const cardContainer = e.currentTarget.closest('.resize-container')
    const startHeight = cardContainer.offsetHeight
    const startTop = cardContainer.offsetTop

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY

      // Real-time visual feedback - update DOM directly
      if (handle === 'bottom') {
        const newHeight = Math.max(60, startHeight + deltaY)
        cardContainer.style.height = `${newHeight}px`
      } else if (handle === 'top') {
        const newHeight = Math.max(60, startHeight - deltaY)
        const newTop = startTop + deltaY
        cardContainer.style.height = `${newHeight}px`
        cardContainer.style.top = `${newTop}px`
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)

      // Get final dimensions
      const finalHeight = cardContainer.offsetHeight
      const finalTop = cardContainer.offsetTop

      // Send final data to parent for time calculation
      if (onResize) {
        onResize(event.id, {
          handle,
          startHeight,
          startTop,
          finalHeight,
          finalTop,
        })
      }

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        if (!isResizing) onSelect()
      }}
      className={clsx(
        'h-full w-full rounded-2xl bg-gradient-to-br p-[1px] text-left shadow-lg transition-transform will-change-transform relative group',
        categoryColors[event.category],
        isSelected ? 'scale-[1.02] ring-2 ring-white shadow-xl' : 'hover:scale-[1.01]',
        isDragging ? 'opacity-30 cursor-grabbing' : isResizing ? 'cursor-ns-resize' : 'cursor-grab'
      )}
      title="Kéo để di chuyển, kéo cạnh để thay đổi thời gian"
    >
      {/* Top resize handle */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-10"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
        style={{ pointerEvents: 'auto' }}
      />

      <div className="h-full rounded-2xl bg-slate-950/80 p-3 flex flex-col overflow-hidden pointer-events-none">
        <div className="mb-2 flex items-center justify-between gap-2 flex-shrink-0">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-widest">
            {event.category}
          </span>
          <Star
            className={clsx(
              'size-4 flex-shrink-0',
              event.priority === 'Cao' ? 'fill-amber-300 text-amber-300' : 'text-slate-500'
            )}
          />
        </div>
        <h3 className="font-black leading-tight text-white line-clamp-2 mb-1">{event.title}</h3>
        <p className="text-xs text-slate-300 line-clamp-1">
          {event.start}–{event.end}
          {event.room && ` · ${event.room}`}
        </p>
        <div className="mt-auto pt-2 h-1.5 rounded-full bg-white/10 flex-shrink-0">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all"
            style={{ width: `${event.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom resize handle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-10"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        style={{ pointerEvents: 'auto' }}
      />
    </button>
  )
})

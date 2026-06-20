import { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Star } from 'lucide-react'
import clsx from 'clsx'

const categoryColors = {
  Học: 'from-sky-500 to-cyan-400',
  Làm: 'from-violet-500 to-fuchsia-500',
  Dạy: 'from-amber-500 to-orange-400',
  'Cá nhân': 'from-emerald-500 to-lime-400',
}

export default memo(function EventCard({ event, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className={clsx(
        'h-full w-full rounded-2xl bg-gradient-to-br p-[1px] text-left shadow-lg transition-transform will-change-transform',
        categoryColors[event.category],
        isSelected ? 'scale-[1.02] ring-2 ring-white shadow-xl' : 'hover:scale-[1.01]',
        isDragging ? 'opacity-30 cursor-grabbing' : 'cursor-grab'
      )}
      title="Kéo để di chuyển"
    >
      <div className="h-full rounded-2xl bg-slate-950/80 p-3 flex flex-col overflow-hidden">
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
    </button>
  )
})

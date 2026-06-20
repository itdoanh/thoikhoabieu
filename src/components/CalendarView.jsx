import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useCallback } from 'react'
import DayColumn from './DayColumn'
import EventCard from './EventCard'

const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

export default function CalendarView({ events, onEventChange, onSelectEvent, selectedId }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 8 for faster activation
      },
    })
  )

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const eventId = Number(active.id)
    const draggedEvent = events.find(e => e.id === eventId)

    if (!draggedEvent) {
      setActiveId(null)
      return
    }

    // Extract day from droppable ID format: "day-Thứ 2-slot-480"
    const overIdParts = over.id.toString().split('-')

    if (overIdParts[0] === 'day' && overIdParts[2] === 'slot') {
      const newDay = overIdParts[1]
      const slotMinutes = Number(overIdParts[3])

      // Calculate new start/end time
      const duration = getDurationMinutes(draggedEvent.start, draggedEvent.end)
      const startHour = Math.floor(slotMinutes / 60) + 6 // Add DAY_START
      const startMin = slotMinutes % 60
      const endTotalMin = slotMinutes + duration
      const endHour = Math.floor(endTotalMin / 60) + 6
      const endMin = endTotalMin % 60

      const newStart = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`
      const newEnd = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

      onEventChange(eventId, {
        day: newDay,
        start: newStart,
        end: newEnd,
      })
    }

    setActiveId(null)
  }, [onEventChange, events])

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  const activeEvent = activeId ? events.find(e => e.id === Number(activeId)) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="rounded-3xl bg-gradient-to-br from-slate-900/50 via-slate-950/80 to-slate-900/50 p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-7 gap-3 h-[900px]">
          {days.map((day) => {
            const dayEvents = events.filter((event) => event.day === day)
            return (
              <DayColumn
                key={day}
                day={day}
                events={dayEvents}
                onSelectEvent={onSelectEvent}
                selectedId={selectedId}
              />
            )
          })}
        </div>
      </div>

      <DragOverlay>
        {activeEvent ? (
          <div className="opacity-80">
            <EventCard
              event={activeEvent}
              isSelected={false}
              onSelect={() => {}}
              isDragging={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function getDurationMinutes(start, end) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

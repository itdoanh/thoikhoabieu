import { useMemo, memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import EventCard from './EventCard'

// Memoized TimeSlot component
const TimeSlot = memo(function TimeSlot({ slot }) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
  })

  const top = (slot.minutes / ((23 - 6) * 60)) * 100

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-full transition-colors ${isOver ? 'bg-cyan-400/20' : ''}`}
      style={{
        top: `${top}%`,
        height: '3.5%', // 15 minutes
        pointerEvents: 'auto',
      }}
    />
  )
})

const DAY_START = 6  // 06:00
const DAY_END = 23   // 23:00
const DAY_MINUTES = (DAY_END - DAY_START) * 60

const getMinutesFromStart = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return (hour - DAY_START) * 60 + minute
}

const getDurationMinutes = (start, end) => {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

// Improved overlap detection using interval scheduling algorithm
function layoutEvents(events) {
  if (events.length === 0) return []

  // 1. Sort events by start time
  const sorted = [...events].sort((a, b) => {
    const aStart = getMinutesFromStart(a.start)
    const bStart = getMinutesFromStart(b.start)
    return aStart - bStart
  })

  // 2. Calculate position data
  const positioned = sorted.map((event) => ({
    event,
    start: getMinutesFromStart(event.start),
    end: getMinutesFromStart(event.start) + getDurationMinutes(event.start, event.end),
    column: 0,
    maxColumn: 0
  }))

  // 3. Assign columns using greedy algorithm
  for (let i = 0; i < positioned.length; i++) {
    const current = positioned[i]
    const overlapping = []

    // Find all events that overlap with current
    for (let j = 0; j < positioned.length; j++) {
      if (i === j) continue
      const other = positioned[j]

      // Check if they overlap
      if (current.start < other.end && other.start < current.end) {
        overlapping.push(other)
      }
    }

    // Find first available column
    const usedColumns = new Set(overlapping.map(e => e.column))
    let column = 0
    while (usedColumns.has(column)) {
      column++
    }
    current.column = column

    // Calculate max column in this overlap group
    const maxColumn = Math.max(column, ...overlapping.map(e => e.column))
    current.maxColumn = maxColumn

    // Update maxColumn for all overlapping events
    for (const other of overlapping) {
      other.maxColumn = Math.max(other.maxColumn, maxColumn)
    }
  }

  // 4. Convert to layout data
  return positioned.map(({ event, start, end, column, maxColumn }) => {
    const top = (start / DAY_MINUTES) * 100
    const height = ((end - start) / DAY_MINUTES) * 100
    const totalColumns = maxColumn + 1
    const width = 100 / totalColumns
    const left = column * width

    return { event, top, height, left, width }
  })
}

export default memo(function DayColumn({ day, events, selectedId, onSelectEvent, onEventResize }) {
  const { setNodeRef } = useDroppable({ id: `day-${day}` })

  const arrangedEvents = useMemo(() => layoutEvents(events), [events])

  console.log(`DayColumn ${day}: ${events.length} events, ${arrangedEvents.length} arranged`)

  // Create time slots for dropping (every 30 minutes for performance)
  const timeSlots = useMemo(() => {
    const slots = []
    for (let hour = DAY_START; hour < DAY_END; hour++) {
      for (let min = 0; min < 60; min += 30) { // Changed from 15 to 30 for performance
        const minutes = (hour - DAY_START) * 60 + min
        slots.push({
          id: `day-${day}-slot-${minutes}`,
          hour,
          min,
          minutes,
        })
      }
    }
    return slots
  }, [day])

  return (
    <div className="flex flex-col">
      <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-3 text-center font-black mb-2 text-white shadow-lg">
        {day}
      </div>
      <div
        ref={setNodeRef}
        data-day={day}
        className="relative min-h-[900px] rounded-2xl border border-white/10 bg-slate-950/35 overflow-hidden"
      >
        {/* Drop zones */}
        {timeSlots.map((slot) => (
          <TimeSlot key={slot.id} slot={slot} />
        ))}

        {/* Events */}
        {arrangedEvents.map(({ event, top, height, left, width }) => (
          <div
            key={event.id}
            className="absolute p-1 pointer-events-none resize-container"
            style={{
              top: `${top}%`,
              height: `${Math.max(height, 12)}%`,
              left: `${left}%`,
              width: `${width}%`,
              minHeight: '120px',
            }}
          >
            <div className="pointer-events-auto h-full">
              <EventCard
                event={event}
                isSelected={event.id === selectedId}
                onSelect={() => onSelectEvent(event.id)}
                onResize={(eventId, resizeData) => {
                  if (onEventResize) {
                    // Calculate new times from final dimensions
                    const columnHeight = 900
                    const DAY_MINUTES = (23 - 6) * 60

                    if (resizeData.handle === 'bottom') {
                      // Bottom resize - change end time
                      const heightPercent = (resizeData.finalHeight / columnHeight) * 100
                      const minutes = Math.round((heightPercent / 100) * DAY_MINUTES)
                      const duration = Math.max(15, Math.round(minutes / 15) * 15)

                      onEventResize(eventId, { type: 'bottom', duration })
                    } else if (resizeData.handle === 'top') {
                      // Top resize - change start time
                      const topPercent = (resizeData.finalTop / columnHeight) * 100
                      const newStartMinutes = Math.round((topPercent / 100) * DAY_MINUTES / 15) * 15

                      onEventResize(eventId, { type: 'top', newStartMinutes })
                    }
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

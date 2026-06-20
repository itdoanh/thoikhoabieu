# 🔧 Resize Fixes - Anchor Points & Duration

## Issues Fixed

### 1. ❌ Cạnh kia di chuyển khi resize
**Problem:** Kéo cạnh trên/dưới, cả 2 cạnh đều di chuyển

**Root Cause:** 
```javascript
// Wrong calculation for top resize
const newTop = startTop + deltaY  // ❌ Both edges move
```

**Fix:**
```javascript
// Bottom resize: Top anchor stays fixed
if (handle === 'bottom') {
  const newHeight = Math.max(60, startHeight + deltaY)
  cardContainer.style.height = `${newHeight}px`
  // Don't touch top! ✅
}

// Top resize: Bottom anchor stays fixed
else if (handle === 'top') {
  const newHeight = Math.max(60, startHeight - deltaY)
  const heightDiff = startHeight - newHeight
  const newTop = startTop + heightDiff  // ✅ Keep bottom fixed
  
  cardContainer.style.top = `${newTop}px`
  cardContainer.style.height = `${newHeight}px`
}
```

**Result:**
- ✅ Bottom resize: Top edge stays fixed
- ✅ Top resize: Bottom edge stays fixed
- ✅ Only one edge moves at a time

---

### 2. ✅ Duration preserved when dragging
**Already Working!** CalendarView line 80:
```javascript
const duration = getDurationMinutes(draggedEvent.start, draggedEvent.end)
// ...use duration to calculate new end time
```

**Behavior:**
- ✅ Resize event to 2 hours
- ✅ Drag to another day
- ✅ Still 2 hours duration ✅

---

## Test Cases

### Resize Bottom:
1. Hover event → bottom edge
2. Drag down → card grows, **top stays**
3. Drag up → card shrinks, **top stays**

### Resize Top:
1. Hover event → top edge
2. Drag up → card grows, **bottom stays**
3. Drag down → card shrinks, **bottom stays**

### Drag After Resize:
1. Resize event to 3 hours
2. Drag to different day
3. **Still 3 hours** ✅

---

**Status:** ✅ Fixed - Proper anchor points!

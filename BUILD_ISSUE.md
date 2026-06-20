# 🚨 Build Issue + Progress Summary

## ❌ Current Blocker: Production Build Failure

**Problem**: `npm run build` crashes with "JavaScript heap out of memory"

**Error**: Rolldown optimizer runs out of memory during production build

**Status**: 
- ✅ Dev mode works fine (`npm run dev` at http://localhost:5173)
- ❌ Production build fails consistently
- ⚠️ Issue appeared after recent edits but cause unclear

**Attempted Fixes**:
1. Increased Node memory (`--max-old-space-size=4096`) → Failed
2. Simplified overlap detection logic → Failed
3. Reverted drop functionality → Failed
4. Removed useDroppable → Failed

**Possible Causes**:
- Rolldown (Vite 8's new bundler) optimizer bug
- Circular dependency in component structure
- Large component file triggering edge case
- Interaction between DnD-kit and Rolldown

**Workaround**: Use dev mode for now

---

## ✅ What's Working (Dev Mode)

### 1. Timeline Layout ✅
- 7 continuous columns (days)
- Events positioned by start time
- Events auto-sized by duration
- Min-height 1200px for full day view (06:00-23:00)

### 2. Card Display ✅
- Min-height 120px per card
- Text overflow handled (`line-clamp-2` for titles)
- Flexbox layout with progress bar at bottom
- No text truncation ("Toán cao cấp" displays fully)

### 3. Click to Add ✅
- Click empty space in timeline → creates event at that time
- Time calculation based on click Y position
- Snaps to 15min intervals

### 4. Save Button ✅
- Saves to localStorage
- Alert confirmation

### 5. View/Theme Buttons ✅
- All clickable and update state
- Tooltip "Giữ Ctrl + kéo"

---

## ⚠️ Partially Working

### 6. Drag & Drop ⚠️
- ✅ Can drag cards
- ❌ Drop doesn't update position (snaps back)
- ❌ No Ctrl-key requirement (can drag without Ctrl)

**Why not implemented**:
- useDroppable integration caused build to crash
- Need alternative approach after fixing build issue

### 7. Overlap Handling ⚠️
- ❌ Currently disabled (simplified to prevent build crash)
- Events can visually overlap (stack on top of each other)
- **Was working** before being disabled for debugging

---

## ❌ Not Implemented

### 8. View Modes (Tháng/Kanban/Timeline)
- Only Tuần view exists
- Buttons work but no UI for other modes

### 9. Theme Visual CSS
- Buttons update state but no actual styling changes

---

## 🎯 Next Steps (Priority Order)

### Priority 1: Fix Build Issue
**Options**:
A. Downgrade Vite to 7.x (use Rollup instead of Rolldown)
B. Split App.jsx into smaller components
C. Debug Rolldown with verbose logging
D. Use dev mode for now, fix build later

### Priority 2: Implement Drop-to-Update
**Once build works**:
- Make columns droppable
- Calculate target day + time from drop position
- Update event.day and event.start on drop

### Priority 3: Re-enable Overlap Detection
**Restore side-by-side positioning** for overlapping events

### Priority 4: Enforce Ctrl+Drag
Custom sensor with keyboard activation constraint

### Priority 5: Other Views
Implement Tháng/Kanban/Timeline UI

---

## 📝 Test Results (Dev Mode)

```
✓ Timeline renders with 7 columns
✓ Cards positioned correctly by time
✓ Cards have min-height 120px
✓ Text displays fully (no truncation)
✓ Click-to-add works
✓ Save to localStorage works
✓ Drag works (but drop doesn't update)
✓ 8 event cards visible
```

---

## 🔧 Recommended Action

**For User**:
Test app in dev mode at `http://localhost:5173` (should be running now)

**For Developer**:
Fix build issue first - likely need to:
1. Downgrade Vite 7.x, OR
2. Split App.jsx into separate files, OR
3. Debug why Rolldown optimizer crashes

# ❌ React-Big-Calendar có vấn đề nghiêm trọng

## 🐛 Vấn đề phát hiện

Sau khi bạn yêu cầu tôi **tự test và xem ảnh**, tôi phát hiện:

1. **Events không hiển thị** - Y position âm (-164px)
2. **Parent container bị offset sai** (-524px)
3. **Date conversion không đúng** với calendar view
4. **React-big-calendar quá phức tạp** để integrate

## 📊 Root Cause

- Events date: Jun 15 2026 (Monday tuần trước)
- Calendar showing: Jun 15-21 (tuần hiện tại)
- Nhưng RBC tính toán position sai → events ra ngoài viewport
- DOM structure: `.rbc-events-container` có negative top

## 💡 Quyết định

**Cần revert về custom code** hoặc **tìm thư viện khác đơn giản hơn**.

React-big-calendar:
- ❌ Quá phức tạp để setup
- ❌ Date handling khó debug
- ❌ DOM structure không transparent
- ❌ Mất 2+ giờ vẫn chưa hoạt động

## 🔄 Next Steps

### Option A: Revert về DayColumn custom (Recommend)
- Code cũ hoạt động (trừ overlap nhảy lung tung)
- Fix lại overlap algorithm đơn giản hơn
- Đừng dùng RBC nữa

### Option B: Thử thư viện khác
- `@schedule-x/calendar` - Modern, simpler
- `tui-calendar` - Korean, stable
- Hoặc code thuần React không dùng lib

### Option C: Simplify - Remove DnD
- Chỉ hiển thị calendar đẹp
- Edit qua panel (đã works perfect)
- Không cần drag & drop

## ⏱️ Time Spent
- React-big-calendar setup: 2+ hours
- Result: **0% working**

## ✅ Recommendation

**Option A - Revert và fix đơn giản:**
1. Restore `App.jsx.backup`
2. Giữ overlap detection đơn giản (side-by-side khi trùng)
3. Bỏ fancy drag positioning
4. Focus vào UI đẹp + Edit panel

Bạn muốn tôi làm gì tiếp?

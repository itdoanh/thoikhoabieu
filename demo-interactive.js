import { chromium } from '@playwright/test'

(async () => {
  console.log('🌐 Opening TimeCraft for manual testing...\n')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
    args: ['--start-maximized']
  })

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 }
  })

  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('✅ TimeCraft loaded successfully!\n')
  console.log('📝 Features to test:')
  console.log('   1. ✓ Time slots 06:00-23:00 (18 mốc giờ)')
  console.log('   2. ✓ Click ô trống để thêm lịch mới')
  console.log('   3. ✓ Button "Lưu lịch" (save to localStorage)')
  console.log('   4. ✓ View mode buttons: Tuần/Tháng/Kanban/Timeline')
  console.log('   5. ✓ Theme buttons: Aurora/Minimal/Focus/Dark Pro')
  console.log('   6. ⚠ Drag & drop (works but doesn\'t update position)')
  console.log('   7. ✓ Search and filter')
  console.log('   8. ✓ Edit panel (scroll down to see)')
  console.log('\n⏸️  Browser will stay open - press Ctrl+C to close')
})()

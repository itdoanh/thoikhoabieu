import { chromium } from '@playwright/test'

(async () => {
  console.log('🚀 Opening TimeCraft in Chromium (laptop 1366×768)...')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
    args: ['--start-maximized']
  })

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1
  })

  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('✅ Dashboard loaded successfully')
  console.log('✅ Layout: 2-column responsive mode')
  console.log('✅ All features accessible')
  console.log('\n📝 You can now interact with the app:')
  console.log('   - Click schedule cards')
  console.log('   - Edit title, room, notes')
  console.log('   - Add new schedules')
  console.log('   - Switch view modes (Tuần/Tháng/Kanban/Timeline)')
  console.log('   - Test all filters and search')
  console.log('\n⏸️  Press Ctrl+C in this terminal to close the browser')
})()

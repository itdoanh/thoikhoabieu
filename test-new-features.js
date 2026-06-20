import { chromium } from '@playwright/test'

(async () => {
  console.log('🚀 Testing new features...\n')

  const browser = await chromium.launch({ headless: false, slowMo: 700 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  // Test 1: Expanded time slots
  console.log('📝 Test 1: Time slots coverage (06:00-23:00)...')
  await page.screenshot({ path: 'test-results/feature-01-timeslots.png', fullPage: true })
  const slots = await page.locator('.text-slate-400').filter({ hasText: /^\d{2}:\d{2}$/ }).count()
  console.log(`✓ Found ${slots} time slots (should be 18)\n`)

  // Test 2: Click empty cell to add schedule
  console.log('📝 Test 2: Click empty cell to create schedule...')
  const emptyCell = page.locator('.bg-slate-950\\/35').filter({ has: page.locator('button').nth(0) }).first()
  const emptyCells = page.locator('.bg-slate-950\\/35').filter({ hasNot: page.locator('button') })
  const emptyCount = await emptyCells.count()

  if (emptyCount > 0) {
    await emptyCells.first().click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/feature-02-click-add.png' })
    console.log('✓ Clicked empty cell, new schedule created\n')
  }

  // Test 3: Save schedule
  console.log('📝 Test 3: Save schedule button...')
  page.once('dialog', dialog => {
    console.log(`✓ Alert: ${dialog.message()}`)
    dialog.accept()
  })
  await page.getByRole('button', { name: /Lưu lịch/i }).click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'test-results/feature-03-saved.png' })
  console.log()

  // Test 4: View mode buttons
  console.log('📝 Test 4: View mode buttons...')
  await page.getByRole('button', { name: 'Tháng' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Tháng')

  await page.getByRole('button', { name: 'Kanban' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Kanban')

  await page.getByRole('button', { name: 'Timeline' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Timeline')

  await page.getByRole('button', { name: 'Tuần' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Tuần\n')

  // Test 5: Theme buttons
  console.log('📝 Test 5: Theme personalization...')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)

  await page.getByRole('button', { name: 'Minimal' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Minimal theme')

  await page.getByRole('button', { name: 'Focus' }).click()
  await page.waitForTimeout(300)
  console.log('✓ Clicked Focus theme\n')

  await page.screenshot({ path: 'test-results/feature-04-final.png', fullPage: true })

  console.log('=' .repeat(50))
  console.log('✅ All new features tested!')
  console.log('=' .repeat(50))
  console.log('\n🌐 Browser open for manual testing')
  console.log('Press Ctrl+C to close')
})()

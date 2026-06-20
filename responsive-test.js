import { chromium } from '@playwright/test'
import { writeFileSync } from 'fs'

(async () => {
  const viewports = [
    { name: 'laptop-1366', width: 1366, height: 768 },
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'tablet-1024', width: 1024, height: 768 },
  ]

  const log = []

  for (const vp of viewports) {
    log.push(`\n=== Testing ${vp.name} (${vp.width}×${vp.height}) ===`)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await context.newPage()

    await page.goto('http://127.0.0.1:5173/')
    await page.waitForLoadState('networkidle')

    const hasHScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
    log.push(`Horizontal scroll: ${hasHScroll ? '❌ YES' : '✓ NO'}`)

    await page.screenshot({ path: `test-results/responsive-${vp.name}.png`, fullPage: false })

    // Test add schedule
    await page.getByRole('button', { name: /Thêm lịch mới/i }).click()
    await page.waitForTimeout(300)
    log.push('✓ Add button works')

    // Test edit title
    const titleInput = page.getByLabel('Tiêu đề')
    const isVisible = await titleInput.isVisible()
    if (isVisible) {
      await titleInput.fill(`Test ${vp.name}`)
      log.push('✓ Edit panel visible and works')
    } else {
      log.push('⚠ Edit panel hidden (need scroll on small screen)')
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)
      const nowVisible = await titleInput.isVisible()
      if (nowVisible) {
        await titleInput.fill(`Test ${vp.name} scrolled`)
        log.push('✓ Edit panel accessible after scroll')
      } else {
        log.push('❌ Edit panel not accessible')
      }
    }

    await page.screenshot({ path: `test-results/responsive-${vp.name}-edited.png`, fullPage: false })

    await browser.close()
  }

  log.push('\n=== RESPONSIVE TEST COMPLETE ===')
  writeFileSync('test-results/responsive-test-log.txt', log.join('\n'))
  console.log(log.join('\n'))
})()

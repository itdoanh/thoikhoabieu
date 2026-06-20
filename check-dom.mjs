import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);

// Check container heights
const calendarHeight = await page.evaluate(() => {
  const cal = document.querySelector('.rbc-calendar');
  const timeContent = document.querySelector('.rbc-time-content');
  const daySlot = document.querySelector('.rbc-day-slot');
  
  return {
    calendar: cal ? cal.offsetHeight : 0,
    timeContent: timeContent ? timeContent.offsetHeight : 0,
    daySlot: daySlot ? daySlot.offsetHeight : 0,
    daySlotScroll: daySlot ? daySlot.scrollTop : 0
  };
});

console.log('Heights:', calendarHeight);

// Check first event parent
const parentInfo = await page.evaluate(() => {
  const event = document.querySelector('.rbc-event');
  if (!event) return 'No event';
  
  const parent = event.parentElement;
  const rect = parent.getBoundingClientRect();
  
  return {
    parentTag: parent.tagName,
    parentClass: parent.className,
    parentTop: rect.top,
    eventTop: event.getBoundingClientRect().top,
    eventStyle: event.getAttribute('style')
  };
});

console.log('Event parent info:', parentInfo);

await browser.close();

// Test different Temporal formats
import { Temporal } from '@js-temporal/polyfill';

console.log('1. PlainDate:');
const pd = Temporal.PlainDate.from('2026-06-20');
console.log('  ', pd.toString());

console.log('\n2. ZonedDateTime:');
const zdt = Temporal.ZonedDateTime.from('2026-06-20T08:00:00+07:00[Asia/Bangkok]');
console.log('  ', zdt.toString());

console.log('\n3. PlainDateTime (current):');
const pdt = Temporal.PlainDateTime.from({ year: 2026, month: 6, day: 20, hour: 8, minute: 0 });
console.log('  ', pdt.toString());

// Quick test of Temporal API
import { Temporal } from '@js-temporal/polyfill';

const dt = Temporal.PlainDateTime.from({
  year: 2026, month: 6, day: 20,
  hour: 8, minute: 0
});

console.log('PlainDateTime:', dt.toString());
console.log('Type:', typeof dt);
console.log('Constructor:', dt.constructor.name);

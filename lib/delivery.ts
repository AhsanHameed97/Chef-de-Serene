// Delivery calendar helpers. All dates are calendar days in Los Angeles,
// represented as UTC-midnight Date objects (matches the @db.Date column).

export const TIME_ZONE = 'America/Los_Angeles'
export const MIN_LEAD_DAYS = 3 // selections must be confirmed at least 3 days before delivery

export type DeliveryDayName = 'MONDAY' | 'THURSDAY'
const WEEKDAY_INDEX: Record<DeliveryDayName, number> = { MONDAY: 1, THURSDAY: 4 }

export function todayInLA(now = new Date()): Date {
  const iso = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now) // YYYY-MM-DD
  return new Date(`${iso}T00:00:00.000Z`)
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

/** Next delivery date for the given weekday that is at least MIN_LEAD_DAYS away. */
export function nextDeliveryDate(day: DeliveryDayName, now = new Date()): Date {
  const start = addDays(todayInLA(now), MIN_LEAD_DAYS)
  const offset = (WEEKDAY_INDEX[day] - start.getUTCDay() + 7) % 7
  return addDays(start, offset)
}

export function formatDeliveryDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: style === 'long' ? 'long' : 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function fromISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Whole days from today (LA) until the given calendar date. */
export function daysFromToday(date: Date, now = new Date()): number {
  return Math.round((date.getTime() - todayInLA(now).getTime()) / 86_400_000)
}

export function greetingInLA(now = new Date()): string {
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', hourCycle: 'h23' }).format(now))
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

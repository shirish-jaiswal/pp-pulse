export type RelativeTimeUnit = "minutes" | "hours" | "days" | "weeks"

export interface DateRangeValue {
  from: Date
  to: Date
}

export function buildDateTime(date: Date, timeStr: string) {
  const next = new Date(date)
  const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number)

  next.setUTCHours(hours, minutes, seconds, 0)
  return next
}

export function calculateQuickPreset(preset: string): DateRangeValue | null {
  const now = new Date() // Native UTC baseline via timestamps

  switch (preset) {
    case "1h":
      return { from: new Date(now.getTime() - 1 * 60 * 60 * 1000), to: now }
    case "6h":
      return { from: new Date(now.getTime() - 6 * 60 * 60 * 1000), to: now }
    case "12h":
      return { from: new Date(now.getTime() - 12 * 60 * 60 * 1000), to: now }
    case "24h":
      return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now }
    case "today": {
      const start = new Date(now)
      start.setUTCHours(0, 0, 0, 0)
      return { from: start, to: now }
    }
    case "yesterday": {
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      start.setUTCHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setUTCHours(23, 59, 59, 999)
      return { from: start, to: end }
    }
    case "1w":
      return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: now }
    case "1m":
      return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), to: now }
    default:
      return null
  }
}

export function calculateRelativeRange(value: number, unit: RelativeTimeUnit): DateRangeValue {
  const now = new Date()
  const msMap: Record<RelativeTimeUnit, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
  }
  return {
    from: new Date(now.getTime() - value * msMap[unit]),
    to: now,
  }
}

export function validateDateRange(start: Date, end: Date) {
  if (start.getTime() > end.getTime()) {
    return { valid: false, message: "End date cannot be earlier than start date." }
  }
  return { valid: true }
}
import { RelativeTimeUnit } from "../types"

// Helper to reliably capture the precise current timestamp in UTC coordinates
function getNowUTC() {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
}

export function calculateRelativeRange(
  value: number,
  unit: RelativeTimeUnit
) {
  const now = getNowUTC()

  // Define static millisecond maps to ensure pure time-delta math
  const msMap: Record<RelativeTimeUnit, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
  }

  const duration = value * msMap[unit]

  return {
    from: new Date(now.getTime() - duration),
    to: now,
  }
}
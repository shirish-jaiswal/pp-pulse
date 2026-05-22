// Helper to reliably capture the precise current timestamp in UTC coordinates
function getNowUTC() {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
}

// Emulates a pure UTC startOfDay by zeroing UTC components manually
function getStartOfUTCDay(date: Date) {
  const next = new Date(date)
  next.setUTCHours(0, 0, 0, 0)
  return next
}

export function calculateQuickPreset(preset: string) {
  const now = getNowUTC()

  switch (preset) {
    case "1h":
      return {
        from: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        to: now,
      }

    case "6h":
      return {
        from: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        to: now,
      }

    case "12h":
      return {
        from: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        to: now,
      }

    case "24h":
      return {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        to: now,
      }

    case "today":
      return {
        from: getStartOfUTCDay(now),
        to: now,
      }

    case "yesterday": {
      // Step back exactly 24 hours in milliseconds to find yesterday's UTC anchor
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const start = getStartOfUTCDay(yesterday)
      const end = new Date(start)

      // Explicitly set the precise final millisecond of the UTC day
      end.setUTCHours(23, 59, 59, 999)

      return {
        from: start,
        to: end,
      }
    }

    case "1w":
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      }

    case "1m":
      return {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: now,
      }

    default:
      return null
  }
}
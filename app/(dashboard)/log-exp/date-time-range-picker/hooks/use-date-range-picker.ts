"use client"

import * as React from "react"
import { DateRangeValue } from "../types"

// Helper to reliably construct a pristine UTC baseline for "now"
function getNowUTC() {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
}

// Fixed-timezone format routine avoiding third-party dependency bugs
function formatUTC(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return formatter.format(date)
}

export function useDateRangePicker(
  value?: DateRangeValue,
  onChange?: (value: DateRangeValue) => void
) {
  const [open, setOpen] = React.useState(false)

  // 1. Establish the fallback initial state in clear UTC coordinates
  const [internalRange, setInternalRange] = React.useState<DateRangeValue>(() => {
    const now = getNowUTC()
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)
    return {
      from: sixHoursAgo,
      to: now,
    }
  })

  const range = value || internalRange

  const applyRange = React.useCallback(
    (next: DateRangeValue) => {
      if (onChange) {
        onChange(next)
      } else {
        setInternalRange(next)
      }
      setOpen(false)
    },
    [onChange]
  )

  // 2. Format labels explicitly reflecting the UTC value properties
  const triggerLabel = React.useMemo(() => {
    if (range.from && range.to) {
      return `${formatUTC(range.from)} — ${formatUTC(range.to)} (UTC)`
    }
    return "Select range"
  }, [range])

  return {
    open,
    setOpen,
    range,
    applyRange,
    triggerLabel,
  }
}
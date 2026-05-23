"use client"

import * as React from "react"
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types"

// Fixed-timezone format routine using native UTC options securely
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

  // 1. Establish the fallback initial state using standard absolute timestamps
  const [internalRange, setInternalRange] = React.useState<DateRangeValue>(() => {
    const now = new Date()
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

  // 2. Format labels explicitly reflecting the UTC properties safely
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
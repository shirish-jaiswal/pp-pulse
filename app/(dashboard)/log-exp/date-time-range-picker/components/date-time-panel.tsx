"use client"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React from "react"

interface Props {
  label: string
  date?: Date
  time: string // Expected format: "HH:mm:ss"
  onDateChange: (date?: Date) => void
  onTimeChange: (value: string) => void
  disabled?: (date: Date) => boolean
}

export function DateTimePanel({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  disabled,
}: Props) {

  // 1. Convert incoming UTC Date to Local Date for calendar display
  const localCalendarDate = React.useMemo(() => {
    if (!date) return undefined
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  }, [date])

  // 2. Intercept calendar selection and convert to UTC Date object
  const handleSelectDate = (selectedLocalDate?: Date) => {
    if (!selectedLocalDate) {
      onDateChange(undefined)
      return
    }

    const strictUTCDate = new Date(
      Date.UTC(
        selectedLocalDate.getFullYear(),
        selectedLocalDate.getMonth(),
        selectedLocalDate.getDate()
      )
    )
    onDateChange(strictUTCDate)
  }

  // 3. Adapt the custom disabled function for calendar cells
  const handleIsDisabled = React.useCallback(
    (cellDate: Date) => {
      if (!disabled) return false
      const strictUTCCell = new Date(
        Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate())
      )
      return disabled(strictUTCCell)
    },
    [disabled]
  )

  // 4. Generate 30-minute interval choices array (with seconds included)
  const timeSlots = React.useMemo(() => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let min of ["00", "30"]) {
        const hh = String(hour).padStart(2, "0")
        slots.push(`${hh}:${min}:00`)
      }
    }
    return slots
  }, [])

  // 5. Hard mask the manual text input to strictly behave like a 24h clock (HH:mm:ss)
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and colons
    let value = e.target.value.replace(/[^0-9:]/g, "")

    // Keep length restricted to HH:mm:ss max (8 characters)
    if (value.length > 8) {
      value = value.slice(0, 8)
    }

    // Auto-formatting colons seamlessly while the user types
    const clearNums = value.replace(/:/g, "")
    if (clearNums.length >= 2 && value.indexOf(":") === -1) {
      value = value.slice(0, 2) + ":" + value.slice(2)
    }
    if (clearNums.length >= 4 && value.split(":").length === 2) {
      value = value.slice(0, 5) + ":" + value.slice(5)
    }

    onTimeChange(value)
  }

  // Fallback sanity check when the user clicks away, ensuring valid 24h limits
  const handleInputBlur = () => {
    const segments = time.split(":")

    let h = parseInt(segments[0] || "12", 10)
    let m = parseInt(segments[1] || "00", 10)
    let s = parseInt(segments[2] || "00", 10)

    // Bound check against genuine 24-hour maximums
    if (isNaN(h) || h < 0 || h > 23) h = 12
    if (isNaN(m) || m < 0 || m > 59) m = 0
    if (isNaN(s) || s < 0 || s > 59) s = 0

    const cleanHH = String(h).padStart(2, "0")
    const cleanMM = String(m).padStart(2, "0")
    const cleanSS = String(s).padStart(2, "0")

    onTimeChange(`${cleanHH}:${cleanMM}:${cleanSS}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>

      {/* Side-by-side grid interface */}
      <div className="flex flex-col sm:flex-row gap-4 items-start border rounded-md p-3 w-fit bg-popover">

        {/* Left column: Calendar component */}
        <div className="border-r pr-2 last:border-r-0">
          <Calendar
            mode="single"
            selected={localCalendarDate}
            onSelect={handleSelectDate}
            defaultMonth={localCalendarDate}
            disabled={handleIsDisabled}
            className="p-0"
          />
        </div>

        {/* Right column: Formatted Text Input & Scroll Area */}
        <div className="flex flex-col gap-3 h-[300px] w-full sm:w-[170px]">
          <Field>
            <FieldLabel className="text-xs text-muted-foreground mb-1 block">
              Time (24h format)
            </FieldLabel>

            <Input
              type="text"
              value={time}
              onChange={handleManualInputChange}
              onBlur={handleInputBlur}
              placeholder="HH:mm:ss"
              className="text-center font-mono tracking-wider"
            />
          </Field>

          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-1">
            Quick Select
          </div>

          {/* Quick-select options panel */}
          <div className="flex-1 overflow-y-auto pr-1 border rounded-md p-1 gap-1 flex flex-col scrollbar-thin">
            {timeSlots.map((slot) => {
              const isSelected = time === slot
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={`w-full text-center py-1.5 font-mono text-xs rounded transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
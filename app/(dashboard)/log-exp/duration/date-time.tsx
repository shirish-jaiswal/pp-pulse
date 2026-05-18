"use client"

import * as React from "react"
import { format, isAfter, isBefore, startOfDay, subHours, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const PRESETS = [
  { label: "Last 1 Hour", value: "1h" },
  { label: "Last 6 Hours", value: "6h" },
  { label: "Last 12 Hours", value: "12h" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 1 Week", value: "1w" },
  { label: "Last 1 Month", value: "1m" },
]

interface IntegratedDateRangePickerProps {
  value?: { from?: Date; to?: Date }
  onChange?: (range: { from?: Date; to?: Date }) => void
}

export function IntegratedDateRangePicker({ value, onChange }: IntegratedDateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Fallback internal range: Defaults to Last 6 Hours on initialization if props are missing
  const [internalRange, setInternalRange] = React.useState<{ from?: Date; to?: Date }>(() => {
    const now = new Date()
    return {
      from: subHours(now, 6),
      to: now,
    }
  })

  const confirmedRange = value || internalRange

  // Draft states active while editing inside the popover
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = React.useState("10:30:00")
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = React.useState("11:30:00")

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      // Prioritize confirmed ranges, safely fallback to instant values to prevent form layout breaks
      const baseFrom = confirmedRange.from || subHours(new Date(), 6)
      const baseTo = confirmedRange.to || new Date()

      setStartDate(baseFrom)
      setEndDate(baseTo)
      setStartTime(format(baseFrom, "HH:mm:ss"))
      setEndTime(format(baseTo, "HH:mm:ss"))
    }
  }

  // Helper method to commit a confirmed state upstream
  const commitRange = (from: Date, to: Date) => {
    const updatedRange = { from, to }
    if (onChange) {
      onChange(updatedRange)
    } else {
      setInternalRange(updatedRange)
    }
    setOpen(false)
  }

  // Handle preset selections with instant application logic
  const handleSelectPreset = (presetValue: string) => {
    const now = new Date()
    let from = new Date()
    let to = new Date()

    switch (presetValue) {
      case "1h":
        from = subHours(now, 1)
        break
      case "6h":
        from = subHours(now, 6)
        break
      case "12h":
        from = subHours(now, 12)
        break
      case "24h":
        from = subHours(now, 24)
        break
      case "today":
        from = startOfDay(now)
        break
      case "yesterday":
        const yesterday = subDays(now, 1)
        from = startOfDay(yesterday)
        to = new Date(yesterday)
        to.setHours(23, 59, 59, 999)
        break
      case "1w":
        from = subDays(now, 7)
        break
      case "1m":
        from = subDays(now, 30)
        break
      default:
        return
    }

    // Directly apply preset value configurations immediately
    commitRange(from, to)
  }

  // Handle manual calendar and time form submission
  const handleManualApply = () => {
    if (!startDate || !endDate) {
      alert("Please select both a start date and an end date.")
      return
    }

    const finalFrom = new Date(startDate)
    const [sHours, sMins, sSecs = 0] = startTime.split(":").map(Number)
    finalFrom.setHours(sHours, sMins, sSecs, 0)

    const finalTo = new Date(endDate)
    const [eHours, eMins, eSecs = 0] = endTime.split(":").map(Number)
    finalTo.setHours(eHours, eMins, eSecs, 0)

    if (isAfter(finalFrom, finalTo)) {
      alert("End date & time cannot be chronologically before the start date & time.")
      return
    }

    commitRange(finalFrom, finalTo)
  }

  const getDisplayLabel = () => {
    if (confirmedRange.from && confirmedRange.to) {
      return `${format(confirmedRange.from, "PP p")} — ${format(confirmedRange.to, "PP p")}`
    }
    return "Select start and end date/time ranges..."
  }

  return (
    <FieldGroup className="max-w-sm">
      <Field className="w-full">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              id="integrated-range-picker"
              variant="outline"
              className="max-w-lg justify-start text-left font-normal gap-3 h-10 border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground"
            >
              <CalendarIcon className="h-4 w-4 opacity-60 shrink-0" />
              <span className="truncate text-foreground">{getDisplayLabel()}</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-190 p-4" align="start">
            <div className="flex gap-4">

              {/* LEFTMOST COLUMN: PRESETS SHORTCUT LIST */}
              <div className="flex flex-col gap-1 w-40 shrink-0 border-r pr-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Quick Ranges
                </span>
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal text-xs h-8 text-slate-700 hover:bg-slate-100"
                    onClick={() => handleSelectPreset(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              {/* CENTER COLUMN: START SELECTION */}
              <div className="flex flex-col gap-2 flex-1 border-r pr-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Start Date
                </span>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  defaultMonth={startDate}
                />
                <Field className="mt-1">
                  <FieldLabel className="text-xs text-muted-foreground">Start Time</FieldLabel>
                  <Input
                    type="time"
                    step="1"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none text-center"
                  />
                </Field>
              </div>

              {/* RIGHT COLUMN: END SELECTION */}
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  End Date
                </span>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  defaultMonth={endDate || startDate}
                  disabled={(date) => startDate ? isBefore(startOfDay(date), startOfDay(startDate)) : false}
                />
                <Field className="mt-1">
                  <FieldLabel className="text-xs text-muted-foreground">End Time</FieldLabel>
                  <Input
                    type="time"
                    step="1"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none text-center"
                  />
                </Field>
              </div>

            </div>

            {/* LOWER ACTIONS BAR */}
            <div className="flex justify-end gap-2 border-t pt-3 mt-3">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleManualApply}>
                Apply Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  )
}
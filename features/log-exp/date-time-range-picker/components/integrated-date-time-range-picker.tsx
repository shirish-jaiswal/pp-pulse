"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldGroup } from "@/components/ui/field"
import { DateRangeValue, RelativeTimeUnit } from "@/features/log-exp/date-time-range-picker/types"
import { useDateRangePicker } from "@/features/log-exp/date-time-range-picker/hooks/use-date-range-picker"
import {
  buildDateTime,
  calculateQuickPreset,
} from "@/features/log-exp/date-time-range-picker/utils/index"
import { TriggerButton } from "@/features/log-exp/date-time-range-picker/components/trigger-button"
import { RelativeRangePanel } from "@/features/log-exp/date-time-range-picker/components/relative-range-panel"
import { QuickPresets } from "@/features/log-exp/date-time-range-picker/components/quick-presets"
import { DateTimePanel } from "@/features/log-exp/date-time-range-picker/components/date-time-panel"
import { FooterActions } from "@/features/log-exp/date-time-range-picker/components/footer-actions"
import { calculateRelativeRange } from "@/features/log-exp/date-time-range-picker/utils/calculate-relative-range"

interface Props {
  value?: DateRangeValue
  onChange?: (range: DateRangeValue) => void
}

function formatUTCTime(date: Date | undefined) {
  if (!date) return "00:00:00"
  return [
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
    String(date.getUTCSeconds()).padStart(2, "0"),
  ].join(":")
}

export function IntegratedDateTimeRangePicker({ value, onChange }: Props) {
  const picker = useDateRangePicker(value, onChange)
  const [mounted, setMounted] = React.useState(false)

  const [activeTab, setActiveTab] = React.useState<"start" | "end">("start")
  const [relativeValue, setRelativeValue] = React.useState("15")
  const [relativeUnit, setRelativeUnit] = React.useState<RelativeTimeUnit>("minutes")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const startDate = picker.range.from
  const endDate = picker.range.to

  const startTime = React.useMemo(() => formatUTCTime(startDate), [startDate])
  const endTime = React.useMemo(() => formatUTCTime(endDate), [endDate])

  const handleApplyRelative = () => {
    const numeric = Number(relativeValue)
    if (Number.isNaN(numeric) || numeric <= 0) return
    picker.applyRange(calculateRelativeRange(numeric, relativeUnit))
  }

  const handlePresetSelect = (preset: string) => {
    const range = calculateQuickPreset(preset)
    if (!range) return
    picker.applyRange(range)
  }

  const handleStartUpdate = (newDate: Date | undefined, newTimeStr: string) => {
    const baseDate = newDate || startDate || new Date()
    const computedDateTime = buildDateTime(baseDate, newTimeStr)

    if (endDate && computedDateTime.getTime() > endDate.getTime()) {
      picker.applyRange({ from: computedDateTime, to: computedDateTime })
    } else {
      picker.applyRange({ from: computedDateTime, to: endDate })
    }
  }

  const handleEndUpdate = (newDate: Date | undefined, newTimeStr: string) => {
    const baseDate = newDate || endDate || new Date()
    const computedDateTime = buildDateTime(baseDate, newTimeStr)

    if (startDate && computedDateTime.getTime() < startDate.getTime()) {
      picker.applyRange({ from: computedDateTime, to: computedDateTime })
    } else {
      picker.applyRange({ from: startDate, to: computedDateTime })
    }
  }

  const formatButtonLabel = (date: Date | undefined, timeStr: string, fallback: string) => {
    if (!mounted || !date) return fallback
    const localDateString = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    ).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    })

    return `${localDateString} ${timeStr}`
  }

  return (
    <FieldGroup className="w-full">
      <Field className="w-full">
        <Popover open={picker.open} onOpenChange={picker.setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-1 w-full cursor-pointer">
              {/* Flex child grows evenly to minimize dead margin space */}
              <div className="flex-1 min-w-0">
                <TriggerButton
                  label={formatButtonLabel(startDate, startTime, "Select Start Time")}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab("start")
                    if (!picker.open) picker.setOpen(true)
                  }}
                  className={`w-full text-xs px-2 h-9 ${
                    picker.open && activeTab === "start" ? "ring-2 ring-primary border-transparent" : ""
                  }`}
                />
              </div>

              <span className="text-xs font-normal text-muted-foreground shrink-0 select-none px-0.5">
                to
              </span>

              {/* Flex child grows evenly */}
              <div className="flex-1 min-w-0">
                <TriggerButton
                  label={formatButtonLabel(endDate, endTime, "Select End Time")}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab("end")
                    if (!picker.open) picker.setOpen(true)
                  }}
                  className={`w-full text-xs px-2 h-9 ${
                    picker.open && activeTab === "end" ? "ring-2 ring-primary border-transparent" : ""
                  }`}
                />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-fit p-2 gap-0"
            align="start"
            onPointerDownOutside={(e) => {
              if (e.target instanceof Element && e.target.closest('[data-radix-popper-content-wrapper]')) {
                e.preventDefault()
              }
            }}
          >
            <div className="flex gap-4">
              <div className="w-56 shrink-0 border-r pr-3">
                <RelativeRangePanel
                  value={relativeValue}
                  unit={relativeUnit}
                  onValueChange={setRelativeValue}
                  onUnitChange={setRelativeUnit}
                  onApply={handleApplyRelative}
                />
                <QuickPresets onSelect={handlePresetSelect} />
              </div>

              <div className="flex-1">
                {activeTab === "start" ? (
                  <DateTimePanel
                    label="Start Date"
                    date={startDate}
                    time={startTime}
                    onDateChange={(d) => handleStartUpdate(d, startTime)}
                    onTimeChange={(t) => handleStartUpdate(startDate, t)}
                  />
                ) : (
                  <DateTimePanel
                    label="End Date"
                    date={endDate}
                    time={endTime}
                    onDateChange={(d) => handleEndUpdate(d, endTime)}
                    onTimeChange={(t) => handleEndUpdate(endDate, t)}
                    disabled={(date: Date) =>
                      startDate ? date.getTime() < startDate.getTime() : false
                    }
                  />
                )}
              </div>
            </div>

            <FooterActions onClose={() => picker.setOpen(false)} />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  )
}
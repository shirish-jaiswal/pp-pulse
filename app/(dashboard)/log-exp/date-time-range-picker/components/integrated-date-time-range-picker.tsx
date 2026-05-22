"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldGroup } from "@/components/ui/field"
import { DateRangeValue, RelativeTimeUnit } from "../types"
import { useDateRangePicker } from "../hooks/use-date-range-picker"
import {
  buildDateTime,
  calculateQuickPreset,
  calculateRelativeRange,
  validateDateRange,
} from "../utils/index"
import { TriggerButton } from "./trigger-button"
import { RelativeRangePanel } from "./relative-range-panel"
import { QuickPresets } from "./quick-presets"
import { DateTimePanel } from "./date-time-panel"
import { FooterActions } from "./footer-actions"

interface Props {
  value?: DateRangeValue
  onChange?: (range: DateRangeValue) => void
}

function getNowUTC() {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000)
}

function formatUTCTime(date: Date) {
  return [
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
    String(date.getUTCSeconds()).padStart(2, "0"),
  ].join(":")
}

export function IntegratedDateTimeRangePicker({ value, onChange }: Props) {
  const picker = useDateRangePicker(value, onChange)

  // Tracks exactly which panel should be shown inside the popover ("start" or "end")
  const [activeTab, setActiveTab] = React.useState<"start" | "end">("start")

  const [relativeValue, setRelativeValue] = React.useState("15")
  const [relativeUnit, setRelativeUnit] = React.useState<RelativeTimeUnit>("minutes")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [startTime, setStartTime] = React.useState("10:30:00")
  const [endTime, setEndTime] = React.useState("11:30:00")

  React.useEffect(() => {
    if (!picker.open) return

    const currentNow = getNowUTC()
    const from = picker.range.from || currentNow
    const to = picker.range.to || currentNow

    setStartDate(from)
    setEndDate(to)
    setStartTime(formatUTCTime(from))
    setEndTime(formatUTCTime(to))
  }, [picker.open, picker.range.from, picker.range.to])

  const handleApplyRelative = () => {
    const numeric = Number(relativeValue)

    if (Number.isNaN(numeric) || numeric <= 0) {
      alert("Invalid value")
      return
    }

    picker.applyRange(calculateRelativeRange(numeric, relativeUnit))
  }

  const handlePresetSelect = (preset: string) => {
    const range = calculateQuickPreset(preset)
    if (!range) return

    picker.applyRange(range)
  }

  const handleApplyManual = () => {
    if (!startDate || !endDate) {
      alert("Select both dates")
      return
    }

    const start = buildDateTime(startDate, startTime)
    const end = buildDateTime(endDate, endTime)

    const validation = validateDateRange(start, end)

    if (!validation.valid) {
      alert(validation.message)
      return
    }

    picker.applyRange({
      from: start,
      to: end,
    })
  }

  const formatButtonLabel = (date: Date | undefined, timeStr: string, fallback: string) => {
    if (!date) return fallback
    const localDateString = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    return `${localDateString} ${timeStr}`
  }

  return (
    <FieldGroup className="max-w-2xl w-4xl">
      <Field className="max-w-xl">
        <Popover open={picker.open} onOpenChange={picker.setOpen}>

          {/* Two separate trigger buttons side-by-side */}
          <div className="flex items-center gap-2 max-w-4xl">
            <PopoverTrigger asChild>
              <TriggerButton
                label={formatButtonLabel(startDate, startTime, "Select Start Time")}
                onClick={() => {
                  setActiveTab("start")
                  picker.setOpen(true)
                }}
                className={picker.open && activeTab === "start" ? "ring-2 ring-primary border-transparent" : ""}
              />
            </PopoverTrigger>

            <span className="text-sm font-medium text-muted-foreground shrink-0">to</span>

            <PopoverTrigger asChild>
              <TriggerButton
                label={formatButtonLabel(endDate, endTime, "Select End Time")}
                onClick={() => {
                  setActiveTab("end")
                  picker.setOpen(true)
                }}
                className={picker.open && activeTab === "end" ? "ring-2 ring-primary border-transparent" : ""}
              />
            </PopoverTrigger>
          </div>

          <PopoverContent className="w-fit p-4" align="start">
            <div className="flex gap-4">

              {/* Left presets side menu */}
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

              {/* Workspace Container: Strictly displays only the clicked target panel */}
              <div className="flex-1">
                {activeTab === "start" ? (
                  <DateTimePanel
                    label="Start Date"
                    date={startDate}
                    time={startTime}
                    onDateChange={setStartDate}
                    onTimeChange={setStartTime}
                  />
                ) : (
                  <DateTimePanel
                    label="End Date"
                    date={endDate}
                    time={endTime}
                    onDateChange={setEndDate}
                    onTimeChange={setEndTime}
                    disabled={
                      startDate
                        ? (date: Date) => date.getTime() < startDate.getTime()
                        : undefined
                    }
                  />
                )}
              </div>

            </div>

            <FooterActions
              onCancel={() => picker.setOpen(false)}
              onApply={handleApplyManual}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  )
}
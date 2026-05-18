"use client"

import * as React from "react"
// Highlight-start
import { format, isAfter, isBefore, startOfDay } from "date-fns"
// Highlight-end
import { CalendarIcon, ClockIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Step = "START_DATE" | "START_TIME" | "END_DATE" | "END_TIME"

export function GuidedDateRangePicker() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("START_DATE")

  // Finalized values confirmed only on "Apply"
  const [confirmedRange, setConfirmedRange] = React.useState<{ from?: Date; to?: Date }>({})

  // Draft working states inside the popover lifetime
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = React.useState("10:30:00")
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = React.useState("11:30:00")

  // Reset steps and pull from confirmed data when opening
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setStep("START_DATE")
      setStartDate(confirmedRange.from)
      setEndDate(confirmedRange.to)
      if (confirmedRange.from) setStartTime(format(confirmedRange.from, "HH:mm:ss"))
      if (confirmedRange.to) setEndTime(format(confirmedRange.to, "HH:mm:ss"))
    }
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return
    setStartDate(date)
    setStep("START_TIME")
  }

  const handleStartTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("END_DATE")
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return
    setEndDate(date)
    setStep("END_TIME")
  }

  const handleFinalApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    const finalFrom = new Date(startDate)
    const [sHours, sMins, sSecs = 0] = startTime.split(":").map(Number)
    finalFrom.setHours(sHours, sMins, sSecs, 0)

    const finalTo = new Date(endDate)
    const [eHours, eMins, eSecs = 0] = endTime.split(":").map(Number)
    finalTo.setHours(eHours, eMins, eSecs, 0)

    // Safety fallback validation
    if (isAfter(finalFrom, finalTo)) {
      alert("End date/time cannot be before start date/time.")
      return
    }

    setConfirmedRange({ from: finalFrom, to: finalTo })
    setOpen(false)
  }

  // Display label on the main trigger button
  const getTriggerLabel = () => {
    if (confirmedRange.from && confirmedRange.to) {
      return `${format(confirmedRange.from, "LLL dd, yyyy HH:mm")} - ${format(confirmedRange.to, "LLL dd, yyyy HH:mm")}`
    }
    return "Pick Start & End Date/Time"
  }

  return (
    <FieldGroup className="mx-auto max-w-xs">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal gap-2">
            <CalendarIcon className="h-4 w-4 opacity-60" />
            <span className="truncate">{getTriggerLabel()}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-4" align="start">
          {/* Top Wizard Indicator Bar */}
          <div className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-semibold text-muted-foreground">
            <span className={step.startsWith("START") ? "text-foreground font-bold" : ""}>1. Start</span>
            <ChevronRightIcon className="h-3 w-3" />
            <span className={step.startsWith("END") ? "text-foreground font-bold" : ""}>2. End</span>
          </div>

          {/* Step 1: Select Start Date */}
          {step === "START_DATE" && (
            <div>
              <div className="text-sm font-medium mb-2">Select Start Date</div>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </div>
          )}

          {/* Step 2: Select Start Time */}
          {step === "START_TIME" && (
            <form onSubmit={handleStartTimeSubmit} className="space-y-4">
              <div className="text-sm font-medium flex items-center gap-2">
                <ClockIcon className="h-4 w-4" /> Set Start Time
              </div>
              <p className="text-xs text-muted-foreground">Date: {startDate ? format(startDate, "PP") : ""}</p>
              <Input
                type="time"
                step="1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
              <Button type="submit" className="w-full">
                Next: Select End Date
              </Button>
            </form>
          )}

          {/* Step 3: Select End Date */}
          {step === "END_DATE" && (
            <div>
              <div className="text-sm font-medium mb-2">Select End Date</div>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                // Prevent picking an end date earlier than the start date
                disabled={(date) => startDate ? isBefore(startOfDay(date), startOfDay(startDate)) : false}
                initialFocus
              />
            </div>
          )}

          {/* Step 4: Select End Time */}
          {step === "END_TIME" && (
            <form onSubmit={handleFinalApply} className="space-y-4">
              <div className="text-sm font-medium flex items-center gap-2">
                <ClockIcon className="h-4 w-4" /> Set End Time
              </div>
              <p className="text-xs text-muted-foreground">Date: {endDate ? format(endDate, "PP") : ""}</p>
              <Input
                type="time"
                step="1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("END_DATE")}>
                  Back
                </Button>
                <Button type="submit" className="flex-1 variant-default">
                  Apply Range
                </Button>
              </div>
            </form>
          )}
        </PopoverContent>
      </Popover>
    </FieldGroup>
  )
}
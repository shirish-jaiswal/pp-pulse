"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RelativeTimeUnit } from "@/features/log-exp/date-time-range-picker/types"

interface Props {
  value: string
  unit: RelativeTimeUnit
  onValueChange: (value: string) => void
  onUnitChange: (unit: RelativeTimeUnit) => void
  onApply: () => void
}

export function RelativeRangePanel({
  value,
  unit,
  onValueChange,
  onUnitChange,
  onApply,
}: Props) {
  return (
    <>
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Relative Range (UTC)
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Last
          </span>

          <Input
            type="number"
            min="1"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className="h-8 w-18 text-xs"
          />

          <select
            value={unit}
            onChange={(event) => onUnitChange(event.target.value as RelativeTimeUnit)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </select>
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={onApply}
        >
          Apply Relative Range
        </Button>
      </div>
    </>
  )
}
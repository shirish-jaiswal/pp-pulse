"use client"

import { Button } from "@/components/ui/button"
import { QUICK_RANGE_PRESETS } from "@/features/log-exp/date-time-range-picker/constants"

interface Props {
  onSelect: (preset: string) => void
}

export function QuickPresets({ onSelect }: Props) {
  return (
    <>
      <div className="mb-2 border-t pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Quick Presets (UTC)
      </div>

      <div className="flex flex-col gap-1">
        {QUICK_RANGE_PRESETS.map((preset) => (
          <Button
            key={preset.value}
            variant="ghost"
            size="sm"
            className="justify-start text-xs font-normal"
            onClick={() => onSelect(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </>
  )
}
"use client"

import { Button } from "@/components/ui/button"

interface Props {
  onCancel: () => void
  onApply: () => void
}

export function FooterActions({ onCancel, onApply }: Props) {
  return (
    <div className="mt-3 flex justify-end gap-2 border-t pt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
      >
        Cancel
      </Button>

      <Button
        size="sm"
        onClick={onApply}
      >
        Apply Range (UTC)
      </Button>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"

interface Props {
  onClose: () => void
}

export function FooterActions({ onClose }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        onClick={onClose}
      >
        Done
      </Button>
    </div>
  )
}
"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const TriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className={`inline-flex h-10 max-w-lg items-center justify-start gap-3 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ${className || ""}`}
      >
        <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
        <span className="truncate">{label}</span>
      </button>
    )
  }
)

TriggerButton.displayName = "TriggerButton"
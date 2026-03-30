import * as React from "react"
import { cn } from "@/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base: 1px border
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm",
        
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        
        // Placeholder
        "placeholder:text-muted-foreground",
        
        // Focus State: Keep border 1px, remove the heavy ring
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        
        // Disabled State
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // Invalid/Error State
        "aria-invalid:border-destructive aria-invalid:ring-destructive/50",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }
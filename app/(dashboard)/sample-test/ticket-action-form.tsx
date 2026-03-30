"use client"

import * as React from "react"
import { Ticket, ChevronDown, Check, SendHorizontal, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { c_getTicketById } from "@/lib/server/fresh-desk/get-by-id"

const ACTION_OPTIONS = [
  "Game Enable", "Game Disable", "Late Bet", "Void Ticket", "Manual Payout", "Flag for Review"
]

export function TicketActionForm({ onTicketLoaded }: { onTicketLoaded: (data: any) => void }) {
  const [ticketNumber, setTicketNumber] = React.useState("")
  const [selectedActions, setSelectedActions] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  const toggleAction = (action: string) => {
    setSelectedActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await c_getTicketById(ticketNumber as string)
      if (response.success) {
        onTicketLoaded(response)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 border-dashed bg-muted/30 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Ticket Managemen
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[200px]">
            <Ticket className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Ticket #"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed text-xs bg-background">
                <ChevronDown className="mr-2 h-3 w-3 opacity-50" />
                Actions
                {selectedActions.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal text-[10px]">
                      {selectedActions.length}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start">
              <div className="space-y-1">
                {ACTION_OPTIONS.map((option) => (
                  <div
                    key={option}
                    onClick={() => toggleAction(option)}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-sm cursor-pointer text-xs"
                  >
                    <span>{option}</span>
                    {selectedActions.includes(option) && <Check className="h-3 w-3 text-primary" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            size="sm" 
            className="h-8 ml-auto px-4 gap-2"
            disabled={!ticketNumber || selectedActions.length === 0 || loading}
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SendHorizontal className="h-3.5 w-3.5" />}
            Process Ticket
          </Button>
        </div>
      </div>
    </Card>
  )
}
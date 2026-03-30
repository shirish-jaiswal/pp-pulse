"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  User, 
  Calendar, 
  Hash, 
  AlertCircle, 
  Info,
  Clock
} from "lucide-react"
import { format } from "date-fns"

export function TicketDetailsTab({ data }: { data: any }) {
  // If no ticket has been processed yet
  if (!data) {
    return (
      <Card className="p-12 border-dashed flex flex-col items-center justify-center bg-muted/50">
        <div className="p-3 bg-background rounded-full mb-3 shadow-sm">
          <Info className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground font-medium text-center">
          Waiting for ticket input... <br />
          <span className="font-normal opacity-70">Enter a ticket ID above to load details.</span>
        </p>
      </Card>
    )
  }

  // Formatting the status based on Freshdesk mapping (2 = Open)
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 2: return <Badge className="bg-blue-500 hover:bg-blue-600">Open</Badge>
      case 3: return <Badge variant="secondary">Pending</Badge>
      case 4: return <Badge className="bg-yellow-500 hover:bg-yellow-600">Resolved</Badge>
      case 5: return <Badge variant="outline">Closed</Badge>
      default: return <Badge variant="outline">Status {status}</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
      
      {/* COLUMN 1: Metadata & Background Fields */}
      <div className="flex flex-col gap-4">
        <Card className="p-4 shadow-none border bg-muted/10">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Hash className="h-3 w-3" /> Core Identifiers
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Casino ID (Read in Background)</p>
              <p className="text-xs font-mono font-bold text-primary">
                {data.custom_fields?.cf_casino_id || "Not Linked"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Round ID</p>
              <p className="text-xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 inline-block">
                {data.custom_fields?.cf_round_id || "N/A"}
              </p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Status</span>
              {getStatusBadge(data.status)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Severity</span>
              <span className="text-[10px] font-semibold">{data.custom_fields?.cf_severity || "Low"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-none border bg-muted/10">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock className="h-3 w-3" /> Timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px]">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{format(new Date(data.created_at), "MMM dd, HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">{format(new Date(data.updated_at), "MMM dd, HH:mm")}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* COLUMN 2 & 3: Subject & Content */}
      <Card className="md:col-span-2 p-5 shadow-none border">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-3">
            <div className="mt-1 p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-none mb-1">{data.subject}</h3>
              <p className="text-xs text-muted-foreground">Ticket #{data.id} • {data.type}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px]">{data.detected_language?.toUpperCase()}</Badge>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-md border border-dashed">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Requester Description</span>
            </div>
            {/* Using dangerouslySetInnerHTML because Freshdesk sends HTML descriptions */}
            <div 
              className="text-xs leading-relaxed prose prose-sm max-w-none text-foreground/90"
              dangerouslySetInnerHTML={{ __html: data.description }} 
            />
          </div>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 h-4">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Simple Activity icon helper if Lucide Activity isn't imported
function Activity({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  )
}
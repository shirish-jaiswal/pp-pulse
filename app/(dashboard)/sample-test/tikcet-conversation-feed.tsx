"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, Lock, User, MessageSquare, ShieldCheck, CornerDownRight } from "lucide-react"
import { cn } from "@/utils/cn"

interface Conversation {
    id: number
    body: string
    body_text: string
    created_at: string
    private: boolean
    incoming: boolean
    user_id: number
}

export function TicketConversationFeed({ conversations }: { conversations: Conversation[] | null }) {
    if (!conversations || conversations.length === 0) return null;

    return (
        <div className="mt-10 mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Activity Log</h3>
                        <p className="text-[11px] text-muted-foreground">{conversations.length} total messages</p>
                    </div>
                </div>
            </div>

            {/* Conversation Thread */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
                {conversations.map((convo) => (
                    <div key={convo.id} className="relative flex items-start gap-4 group">
                        
                        {/* Status Icon/Timeline Dot */}
                        <div className={cn(
                            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm",
                            convo.private ? "bg-amber-50 border-amber-200 text-amber-600" : 
                            convo.incoming ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-background border-border text-foreground"
                        )}>
                            {convo.private ? <Lock className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>

                        <div className="flex flex-col gap-1.5 w-full">
                            {/* Metadata */}
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground">
                                        {convo.private ? "Internal Note" : convo.incoming ? "Customer" : "Agent"}
                                    </span>
                                    {convo.private && (
                                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase bg-amber-100 text-amber-700 border-none">
                                            Private
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {new Date(convo.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className={cn(
                                "relative text-sm p-4 rounded-2xl border transition-all duration-200",
                                convo.private 
                                    ? "bg-amber-50/40 border-amber-100/60 rounded-tl-none italic text-amber-950" 
                                    : convo.incoming 
                                        ? "bg-muted/30 border-border/50 rounded-tl-none" 
                                        : "bg-background border-border shadow-sm rounded-tl-none"
                            )}>
                                {/* Tooltip arrow effect (Optional) */}
                                <div className={cn(
                                    "absolute top-0 -left-1.5 w-3 h-3 rotate-45 border-l border-t",
                                    convo.private ? "bg-amber-50/40 border-amber-100/60" : 
                                    convo.incoming ? "bg-muted/30 border-border/50" : "bg-background border-border"
                                )} />

                                <div 
                                    className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900"
                                    dangerouslySetInnerHTML={{ __html: convo.body }} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
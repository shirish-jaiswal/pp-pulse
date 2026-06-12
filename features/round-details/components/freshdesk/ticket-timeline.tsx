"use client";

import { useState } from "react";
import MessageCard from "./MessageCard";
import Section from "./Section";
import { ArrowUpDown, Clock } from "lucide-react";
import { useTicketContext } from "./ticket-context";

type SortOrder = "asc" | "desc";

export default function TicketTimeline() {
    const { ticketData } = useTicketContext();
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const description = ticketData?.ticket?.description || "";
    const conversations = ticketData?.conversations || [];

    // Unified sorter
    const unifiedTimeline = [...conversations].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return (
        <div className="p-4 space-y-6">
            {/* TIMELINE CONTROL PANEL */}
            <div className="flex items-center justify-between border-b pb-3 bg-background shrink-0">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Unified Activity Feed</span>
                </div>
                
                <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors shadow-sm"
                >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    {sortOrder === "desc" ? "Sort: Newest First" : "Sort: Oldest First"}
                </button>
            </div>

            {/* ISSUE DESCRIPTION */}
            <Section title="Issue Context">
                <div className="border rounded-md p-3 bg-white dark:bg-muted/10">
                    <div
                        className="text-sm prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
            </Section>

            {/* UNIFIED STREAM */}
            <Section title="Ticket Activity History">
                <div className="space-y-3">
                    {unifiedTimeline.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic pl-1">
                            No activities or communication records found for this ticket.
                        </p>
                    ) : (
                        unifiedTimeline.map((c) => (
                            <MessageCard
                                key={c.id}
                                type={c.private ? "internal" : "customer"}
                                body={c.body}
                                time={c.created_at}
                                email={c.from_email}
                            />
                        ))
                    )}
                </div>
            </Section>
        </div>
    );
}
"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

import EmptyState from "./empty-state";
import TicketHeader from "./ticket-header";
import TicketTimeline from "./ticket-timeline";

import { s_getFreshdeskTicket } from "@/lib/api/freshdesk/s_getFreshdeskTicket";
import { toast } from "sonner";
import { useTicketContext } from "./ticket-context";

type WorkspaceProps = {
    sharedTicketNumber: string;
    onTicketNumberChange: (value: string) => void;
};

export const FreshdeskWorkspace = forwardRef<{ triggerSearch: (id: string) => void }, WorkspaceProps>(
    ({ sharedTicketNumber, onTicketNumberChange }, ref) => {
        const [loading, setLoading] = useState(false);
        const { ticketData, setTicketData, setTicketId } = useTicketContext();

        // Core data loader function
        const executeSearch = async (targetId: string) => {
            const cleanNumber = targetId.trim();
            if (!cleanNumber) return;

            try {
                setLoading(true);
                const res = await s_getFreshdeskTicket(cleanNumber);

                if (res.success && res.ticket) {
                    setTicketData(res);
                    setTicketId(cleanNumber);
                    toast.success(`Ticket #${cleanNumber} loaded`);
                } else {
                    setTicketData(null);
                    setTicketId(null);
                    toast.error("Ticket not found");
                }
            } catch (e) {
                setTicketData(null);
                setTicketId(null);
                toast.error("Failed to load ticket");
            } finally {
                setLoading(false);
            }
        };

        // Exposes the search action mechanism directly to the header search action
        useImperativeHandle(ref, () => ({
            triggerSearch: (id: string) => {
                executeSearch(id);
            },
        }));

        return (
            <div className="flex flex-col h-full min-h-0">
                {/* SEARCH BAR PANEL */}
                <div className="shrink-0 border-b p-2 flex gap-2 bg-muted/30">
                    <Input
                        placeholder="Search ticket..."
                        value={sharedTicketNumber}
                        onChange={(e) => {
                            onTicketNumberChange(e.target.value);
                            if (!e.target.value.trim()) {
                                setTicketData(null);
                                setTicketId(null);
                            }
                        }}
                        onKeyDown={(e) => e.key === "Enter" && executeSearch(sharedTicketNumber)}
                    />

                    <Button onClick={() => executeSearch(sharedTicketNumber)} disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {!ticketData ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* HEADER (fixed) */}
                        <div className="shrink-0">
                            <TicketHeader />
                        </div>

                        {/* TIMELINE */}
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <TicketTimeline />
                        </div>
                    </>
                )}
            </div>
        );
    }
);

FreshdeskWorkspace.displayName = "FreshdeskWorkspace";
export default FreshdeskWorkspace;
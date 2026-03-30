"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketActionForm } from "./ticket-action-form"
import { CasinoTablesTab } from "./casino-table-tabs"
import { TicketDetailsTab } from "./ticket-details-tab"
import { TableStatusSummaryTab } from "./table-status-summary-tab"
import { TicketConversationFeed } from "./tikcet-conversation-feed"

export default function TicketDashboard() {
    const [ticketData, setTicketData] = React.useState<any>(null)
    const [ticketConvo, setTicketConvo] = React.useState<any>(null);
    console.log("ticketCOnvo ::", ticketConvo)
    const ticketId = ticketData?.id?.toString() || "";
    const extractedData = React.useMemo(() => {
        if (!ticketData?.description_text) return { casinoId: null, tables: [] };

        const text = ticketData.description_text;

        // 1. Extract Casino Id
        const casinoMatch = text.match(/Casino\s*Id:\s*([a-z0-9]+)/i);

        // 2. Extract Table IDs (The alphanumeric codes)
        const tableIdRegex = /\b([a-z0-9]{3,10})\b/gi;
        const allMatches = text.match(tableIdRegex) || [];

        const casinoId = casinoMatch ? casinoMatch[1].trim() : null;
        const tableList = allMatches.filter((id: string) =>
            /\d/.test(id) && id.toLowerCase() !== casinoId?.toLowerCase()
        );

        return {
            casinoId: casinoId,
            tables: tableList
        };
    }, [ticketData]);

    const setData = (data: any) => {
        console.log(data)
        setTicketData(data.ticket);
        setTicketConvo(data.conversations)
    }
    return (
        <div className="flex flex-col gap-4 w-full p-4 mx-auto">
            <TicketActionForm onTicketLoaded={(data) => setData(data)} />

            <Tabs defaultValue="ticket" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-9">
                    <TabsTrigger value="ticket" className="text-xs font-semibold">
                        1. Ticket Information
                    </TabsTrigger>
                    <TabsTrigger value="tables" className="text-xs font-semibold">
                        2. All Casino Tables
                    </TabsTrigger>
                    <TabsTrigger value="status" className="text-xs font-semibold">
                        3. Status Analysis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ticket" className="mt-4">
                    <TicketDetailsTab data={ticketData} />
                    <TicketConversationFeed conversations={ticketConvo} />
                </TabsContent>

                <TabsContent value="tables" className="mt-4">
                    <CasinoTablesTab
                        casinoId={extractedData.casinoId}
                        ticketData={{ table_ids: extractedData.tables }}
                        gameId={extractedData.tables[0] || null}
                    />
                </TabsContent>

                <TabsContent value="status" className="mt-4">
                    <TableStatusSummaryTab
                        casinoId={extractedData.casinoId}
                        targetTableIds={extractedData.tables}
                        ticketId={ticketId}
                    />
                </TabsContent>
            </Tabs>

            {extractedData.casinoId && (
                <div className="text-[10px] text-muted-foreground mt-2 px-1 italic">
                    Background Parser: Found Casino "{extractedData.casinoId}" and {extractedData.tables.length} tables.
                </div>
            )}
        </div>
    )
}
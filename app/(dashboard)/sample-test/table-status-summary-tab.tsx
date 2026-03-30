"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Loader2, 
    RefreshCcw,
    SendHorizonal 
} from "lucide-react"
import { c_getAssignedUnassignedTables } from "@/lib/server/cmd-center/get-assigned-unassigned-tables"
import { cn } from "@/utils/cn"
import { c_postPrivateNote } from "@/lib/server/fresh-desk/post-note"

export function TableStatusSummaryTab({ 
    casinoId, 
    targetTableIds,
    ticketId // Ensure you pass ticketId as a prop to this component
}: { 
    casinoId: string | null, 
    targetTableIds: string[],
    ticketId: string 
}) {
    const [rawData, setRawData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [syncing, setSyncing] = React.useState(false)
    
    // Track if we've already posted the summary for this specific data set
    const hasPostedNote = React.useRef(false);

    const fetchStatus = React.useCallback(async () => {
        if (!casinoId) return;
        setLoading(true)
        try {
            const response = await c_getAssignedUnassignedTables(casinoId)
            if (response?.success) setRawData(response.data)
        } finally {
            setLoading(false)
        }
    }, [casinoId])

    React.useEffect(() => { fetchStatus() }, [fetchStatus])

    const analysis = React.useMemo(() => {
        if (!targetTableIds.length || !rawData.length) return null;

        const tableResults = targetTableIds.map(id => {
            const table = rawData.find(t => t["Game Id"]?.toLowerCase() === id.toLowerCase());
            const isEnabled = table?.["Enabled At LC"] === "Yes" && table?.["Enabled At Platform"] === "Yes";
            
            return {
                id,
                name: table?.["Table Name"] || "Unknown Table",
                isEnabled,
                lcStatus: table?.["Enabled At LC"] === "Yes",
                platStatus: table?.["Enabled At Platform"] === "Yes",
                exists: !!table
            }
        });

        const allEnabled = tableResults.every(r => r.isEnabled);
        const missingTables = tableResults.filter(r => !r.exists);

        return { tableResults, allEnabled, missingTables };
    }, [rawData, targetTableIds]);

    // --- AUTOMATIC PRIVATE NOTE LOGIC ---
    React.useEffect(() => {
        const postAnalysisToFreshdesk = async () => {
            // Only post if we have analysis, haven't posted yet, and aren't loading
            if (!analysis || hasPostedNote.current || loading || !ticketId) return;

            hasPostedNote.current = true; // Lock immediately to prevent double-calls

            const statusEmoji = analysis.allEnabled ? "✅" : "⚠️";
            
            // Format HTML for Freshdesk Note
            const htmlBody = `
                <div>
                    <strong>${statusEmoji} Table Status Analysis Summary</strong><br/>
                    <p>Analysis for ${targetTableIds.length} tables completed.</p>
                    <ul>
                        ${analysis.tableResults.map(res => `
                            <li>
                                <code>${res.id}</code>: ${res.name} - 
                                <strong>${res.isEnabled ? "ENABLED" : "DISABLED"}</strong> 
                                ${!res.exists ? "(<span style='color:red'>Not found in system</span>)" : ""}
                            </li>
                        `).join('')}
                    </ul>
                    <hr/>
                    <p><em>Auto-generated via PP Pulse Tool</em></p>
                </div>
            `;

            try {
                await c_postPrivateNote(ticketId, htmlBody);
                console.log("Analysis summary posted to Freshdesk.");
            } catch (err) {
                console.error("Failed to auto-post note:", err);
                hasPostedNote.current = false; // Allow retry on failure
            }
        };

        postAnalysisToFreshdesk();
    }, [analysis, loading, ticketId, targetTableIds.length]);

    const handleTriggerEnable = async () => {
        setSyncing(true)
        // Simulate triggering another API (e.g., c_enableTables)
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log("Triggering enable for:", targetTableIds)
        await fetchStatus()
        setSyncing(false)
    }

    if (!casinoId) return (
        <div className="p-12 text-center text-xs text-muted-foreground border-dashed border rounded-lg">
            No Casino ID identified from ticket.
        </div>
    )

    return (
        <div className="space-y-4">
            {/* Status Overview Card */}
            <Card className={cn(
                "border-2 shadow-none transition-colors",
                analysis?.allEnabled ? "border-green-100 bg-green-50/30" : "border-amber-100 bg-amber-50/30"
            )}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold">Requirement Analysis</CardTitle>
                            <CardDescription className="text-[11px]">
                                Checking status for {targetTableIds.length} tables found in ticket description.
                            </CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchStatus} 
                            disabled={loading}
                            className="h-8 text-[10px]"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw className="h-3 w-3" />}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-4 text-center text-xs text-muted-foreground">Analyzing table states...</div>
                    ) : analysis ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                {analysis.allEnabled ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                )}
                                <div>
                                    <p className={cn("text-xs font-bold", analysis.allEnabled ? "text-green-800" : "text-amber-800")}>
                                        {analysis.allEnabled ? "Tables are Enabled" : "Action Required: Tables Disabled"}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {analysis.allEnabled 
                                            ? "All detected tables are currently active on both LC and Platform." 
                                            : "One or more tables from the ticket are currently offline or misconfigured."}
                                    </p>
                                </div>
                            </div>

                            {!analysis.allEnabled && (
                                <Button 
                                    size="sm" 
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-[11px] h-8"
                                    onClick={handleTriggerEnable}
                                    disabled={syncing}
                                >
                                    {syncing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <SendHorizonal className="h-3 w-3 mr-2" />}
                                    Trigger Sync/Enable for {targetTableIds.length} Tables
                                </Button>
                            )}
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* Individual Table List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis?.tableResults.map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-mono font-bold truncate">{res.id}</span>
                            <span className="text-[9px] text-muted-foreground truncate">{res.name}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                             <Badge 
                                variant="outline" 
                                className={cn(
                                    "text-[9px] h-4 border-none font-bold",
                                    res.isEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}
                            >
                                {res.isEnabled ? "ENABLED" : "DISABLED"}
                            </Badge>
                            {!res.exists && <span className="text-[8px] text-red-500 italic font-medium">Not found in system</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
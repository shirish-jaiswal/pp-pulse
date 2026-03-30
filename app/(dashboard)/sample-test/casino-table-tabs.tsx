"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Loader2,
    TableIcon,
    Search,
    ArrowUpDown,
    FilterX
} from "lucide-react"
import { c_getAssignedUnassignedTables } from "@/lib/server/cmd-center/get-assigned-unassigned-tables"
import { cn } from "@/utils/cn"

type TableData = {
    "Casino Id": string
    "Game Id": string
    "Table Name": string
    "Enabled At LC": string
    "Enabled At Platform": string
}

export function CasinoTablesTab({ 
  casinoId, 
  gameId: initialGameId,
  ticketData 
}: { 
  casinoId: string | null, 
  gameId: string | any, // Changed to any to prevent prop-type crashes
  ticketData?: any 
}) {
    const [rawData, setRawData] = React.useState<TableData[]>([])
    const [loading, setLoading] = React.useState(false)
    
    // Safety 1: Always initialize as an empty string
    const [searchQuery, setSearchQuery] = React.useState("")
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof TableData, direction: 'asc' | 'desc' } | null>(null)

    // Sync Search Query when ticketData or initialGameId changes
    React.useEffect(() => {
        if (ticketData?.table_ids && Array.isArray(ticketData.table_ids)) {
            setSearchQuery(ticketData.table_ids.join(", "))
        } else if (initialGameId) {
            // Safety 2: Ensure if an array is accidentally passed to initialGameId, we stringify it
            setSearchQuery(Array.isArray(initialGameId) ? initialGameId.join(", ") : String(initialGameId))
        }
    }, [ticketData, initialGameId])

    // Fetch Data
    React.useEffect(() => {
        if (casinoId) {
            const fetchTables = async () => {
                setLoading(true)
                try {
                    const response = await c_getAssignedUnassignedTables(casinoId)
                    if (response?.success) setRawData(response.data)
                } finally {
                    setLoading(false)
                }
            }
            fetchTables()
        }
    }, [casinoId])

    React.useEffect(() => {
        const fetchTables = async () => {
            if (!casinoId) return; // Don't fetch if id is null or empty
            
            setLoading(true)
            try {
                const response = await c_getAssignedUnassignedTables(casinoId)
                if (response?.success) {
                    setRawData(response.data)
                } else {
                    console.error("Failed to fetch tables:", response?.error)
                }
            } catch (err) {
                console.error("API Error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchTables()
    }, [casinoId])
    
    const handleSort = (key: keyof TableData) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc'
        setSortConfig({ key, direction })
    }

    // Filter & Sort Logic
    const filteredAndSortedData = React.useMemo(() => {
        let result = [...rawData]
        
        // Safety 3: Force searchQuery to string before calling trim()
        const currentQuery = String(searchQuery || "")
        const cleanQuery = currentQuery.trim().toLowerCase()

        if (cleanQuery) {
            const terms = cleanQuery.split(/[\s,]+/).filter(Boolean)
            
            result = result.filter(item => {
                const tableId = String(item["Game Id"] || "").toLowerCase()
                const tableName = String(item["Table Name"] || "").toLowerCase()

                return terms.some(term => {
                    if (term.length >= 5) {
                        return tableId === term || tableName.includes(term)
                    }
                    return tableId.includes(term) || tableName.includes(term)
                })
            })
        }

        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = String(a[sortConfig.key] || "")
                const bVal = String(b[sortConfig.key] || "")
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return result
    }, [rawData, searchQuery, sortConfig])

    if (!casinoId) return <div className="p-12 text-center text-xs text-muted-foreground border-dashed border rounded-lg">No Casino ID provided.</div>

    return (
        <Card className="overflow-hidden shadow-none border bg-background">
            <div className="p-3 border-b bg-muted/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TableIcon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-tight">Assigned Tables ({filteredAndSortedData.length})</span>
                    </div>
                    {initialGameId && (
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                            Target: {Array.isArray(initialGameId) ? initialGameId[0] : initialGameId}
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search by Name or Game ID..."
                            className="pl-8 h-9 text-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="h-9 px-2">
                        <FilterX className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative overflow-auto max-h-[500px]">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                        <TableRow>
                            <TableHead onClick={() => handleSort("Game Id")} className="cursor-pointer h-9 text-[10px] uppercase group">
                                Game ID <ArrowUpDown className="inline ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TableHead>
                            <TableHead onClick={() => handleSort("Table Name")} className="cursor-pointer h-9 text-[10px] uppercase group">
                                Table Name <ArrowUpDown className="inline ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TableHead>
                            <TableHead className="h-9 text-[10px] uppercase">Status (LC / Plat)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((table, idx) => {
                                // Logic to check if this row is part of the initial highlight
                                const isTarget = Array.isArray(initialGameId) 
                                    ? initialGameId.includes(table["Game Id"])
                                    : table["Game Id"] === initialGameId

                                return (
                                    <TableRow key={idx} className={cn(
                                        "hover:bg-muted/10 transition-colors",
                                        isTarget && "bg-blue-50/50"
                                    )}>
                                        <TableCell className="py-2 text-xs font-mono font-bold">{table["Game Id"]}</TableCell>
                                        <TableCell className="py-2 text-xs font-medium">
                                            {table["Table Name"]}
                                            {isTarget && <Badge className="ml-2 text-[9px] h-4 bg-blue-500">Ticket Subject</Badge>}
                                        </TableCell>
                                        <TableCell className="py-2 text-xs">
                                            <div className="flex gap-1">
                                                <StatusBadge label="LC" enabled={table["Enabled At LC"] === "Yes"} />
                                                <StatusBadge label="PL" enabled={table["Enabled At Platform"] === "Yes"} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-xs text-muted-foreground italic">
                                    No tables matching filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}

function StatusBadge({ label, enabled }: { label: string, enabled: boolean }) {
    return (
        <Badge variant="outline" className={cn(
            "text-[9px] px-1 py-0 h-4 border-none font-bold",
            enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
            {label}: {enabled ? "ON" : "OFF"}
        </Badge>
    )
}
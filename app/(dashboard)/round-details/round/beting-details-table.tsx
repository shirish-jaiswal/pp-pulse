"use client";

import React from "react";
import { Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Bet {
    betCode: string;
    betCodeId: string;
    megaSlot?: string | number;
    megaPayout?: string | number;
    betAmount: string;
    winAmount: string;
    betStatus: string;
    betInitiatedOn: string;
    settlementTime: string;
}

interface BettingDetailsTableProps {
    bets: any[];
    gameMode?: string;
    tableId?: string;
}

export function BettingDetailsTable({ bets, gameMode, tableId }: BettingDetailsTableProps) {
    const hasMega = bets.some((b) => b.megaSlot || b.megaPayout);

    return (
        <Card className="border-none shadow-xl ring-1 ring-border overflow-hidden py-0 gap-0">
            <CardHeader className="p-2 bg-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" /> Betting & Placement Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {bets.length > 0 ? (
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="text-[11px] uppercase font-bold text-slate-500">Bet Code</TableHead>
                                {hasMega && (
                                    <TableHead className="text-center text-[11px] uppercase font-bold text-slate-500">
                                        Mega Slot/Mult
                                    </TableHead>
                                )}
                                <TableHead className="text-[11px] uppercase font-bold text-slate-500">Stake/Win</TableHead>
                                <TableHead className="text-[11px] uppercase font-bold text-slate-500">Status</TableHead>
                                <TableHead className="text-right text-[11px] uppercase font-bold text-slate-500">
                                    Initiated/Settled
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bets.map((bet, i) => (
                                <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-slate-900">{bet.betCode}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">Code ID: {bet.betCodeId}</span>
                                        </div>
                                    </TableCell>

                                    {hasMega && (
                                        <TableCell className="text-center">
                                            {bet.megaSlot ? (
                                                <div className="inline-flex flex-col items-center bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                    <span className="text-[10px] font-black text-indigo-700">{bet.megaPayout}x</span>
                                                    <span className="text-[8px] uppercase text-indigo-500 font-bold">Slot {bet.megaSlot}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono font-bold">
                                                Bet: {parseFloat(bet.betAmount).toFixed(2)}
                                            </span>
                                            <span
                                                className={`text-xs font-mono font-bold ${parseFloat(bet.winAmount) > 0 ? "text-emerald-600" : "text-slate-400"
                                                    }`}
                                            >
                                                Win: {parseFloat(bet.winAmount).toFixed(2)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-[9px] font-bold py-0 h-5 border-none shadow-none ring-1 ${bet.betStatus === "Settled"
                                                ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                                                : "bg-slate-100 text-slate-600 ring-slate-200"
                                                }`}
                                        >
                                            {bet.betStatus?.toUpperCase()}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex flex-col text-[10px] font-mono text-slate-500">
                                            <span>In: {bet.betInitiatedOn?.split(" ")[1]}</span>
                                            <span>Out: {bet.settlementTime?.split(" ")[1]}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-8 text-center text-sm text-slate-400 italic">
                        No detailed betting records found.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
"use client";

import React from "react";
import { CalculationDetail } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/utils/cn";

interface Props {
  winningDescription: string;
  selectedResultBc: string;
  winningRatio: string;
  details: CalculationDetail[]; // These are the filtered bets processed by the strategy
  totalWager: number;
  totalPayout: number;
}

export function CalculationTable({
  winningDescription,
  selectedResultBc,
  winningRatio,
  details,
  totalWager,
  totalPayout,
}: Props) {
  const netWin = totalPayout - totalWager;
  const isLoss = netWin <= 0;

  return (
    <div className="space-y-2 mt-2 border-t border-slate-200 pt-3">
      {/* Meta context bar */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="uppercase font-semibold tracking-wider text-slate-400">Audit Summary</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">{winningDescription} (BC: {selectedResultBc})</span>
        </div>
        <span className="font-mono text-slate-400">Ratio: {winningRatio}</span>
      </div>

      {/* High-density layout data grid */}
      <div className="rounded border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="h-7 py-0.5 text-[11px] font-semibold text-slate-500 w-[90px]">Bet Code</TableHead>
              <TableHead className="h-7 py-0.5 text-[11px] font-semibold text-slate-500">Placement Description</TableHead>
              <TableHead className="h-7 py-0.5 text-[11px] font-semibold text-slate-500 text-right w-[110px]">Wager</TableHead>
              <TableHead className="h-7 py-0.5 text-[11px] font-semibold text-slate-500 text-center w-[80px]">Evaluation</TableHead>
              <TableHead className="h-7 py-0.5 text-[11px] font-semibold text-slate-500 text-right w-[120px]">Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((item, idx) => (
              <TableRow 
                key={idx} 
                className={cn(
                  "border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors",
                  item.isWinner && "bg-emerald-50/40 hover:bg-emerald-50/60"
                )}
              >
                <TableCell className="py-1 font-mono text-xs text-slate-600">{item.betCode}</TableCell>
                <TableCell className={cn("py-1 text-xs", item.isWinner ? "font-medium text-slate-900" : "text-slate-600")}>
                  {item.betDescription}
                </TableCell>
                <TableCell className={cn("py-1 text-right font-mono text-xs", item.amountPlaced > 0 ? "text-slate-800 font-medium" : "text-slate-400")}>
                  {item.amountPlaced > 0 ? `$${item.amountPlaced.toFixed(2)}` : "—"}
                </TableCell>
                <TableCell className="py-1 text-center">
                  <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-wider",
                    item.isWinner ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {item.isWinner ? "Hit" : "Miss"}
                  </span>
                </TableCell>
                <TableCell className={cn(
                  "py-1 text-right font-mono text-xs", 
                  item.isWinner ? "font-semibold text-emerald-600" : "text-slate-400"
                )}>
                  {item.winAmount > 0 ? `$${item.winAmount.toFixed(2)}` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Financial Metric Bar */}
      <div className="flex justify-end items-center gap-6 px-1 py-1.5 border-t border-dashed border-slate-200 text-xs select-none">
        
        {/* Total Wagered */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] uppercase font-medium tracking-wider text-slate-400">Total Bet:</span>
          <span className="font-mono font-medium text-slate-700"> ${totalWager.toFixed(2)}</span>
        </div>

        {/* Gross Win Metric */}
        <div className="flex items-baseline gap-1.5 border-l pl-5 border-slate-200">
          <span className={cn(
            "text-[10px] uppercase font-semibold tracking-wider transition-colors", 
            isLoss ? "text-slate-800" : "text-slate-400"
          )}>
            Gross Win:
          </span>
          <span className={cn(
            "font-mono font-bold text-sm transition-colors", 
            isLoss ? "text-slate-900" : "text-slate-700"
          )}>
            ${totalPayout.toFixed(2)}
          </span>
        </div>

        {/* Net Win Metric */}
        <div className="flex items-baseline gap-1.5 border-l pl-5 border-slate-200">
          <span className={cn(
            "text-[10px] uppercase font-semibold tracking-wider transition-colors", 
            !isLoss ? "text-slate-800" : "text-slate-400"
          )}>
            Net Win:
          </span>
          <span className={cn(
            "font-mono font-bold text-sm tracking-tight transition-colors",
            !isLoss ? "text-emerald-600" : "text-rose-600"
          )}>
            {netWin > 0 ? "+" : ""}${netWin.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  );
}
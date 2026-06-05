"use client";

import React from "react";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { HighflyerBetType } from "@/features/round-details/types/highflyer";

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toUTCString();
};

const formatCurrency = (amount?: number | null) => {
  return Number(amount || 0).toLocaleString();
};

const HighflyerGameResult = () => {
  const { roundDetails } = useRoundDetails();
  
  // Extract highflyer data array from context
  const bets: HighflyerBetType[] = roundDetails?.highflyerData || [];
  
  const gameCrashedAt = roundDetails?.gameDetails?.[0]?.state_indicator 
    ? (Number(roundDetails.gameDetails[0].state_indicator) / 100).toFixed(2) 
    : null;

  // Reference first item for common metadata elements
  const commonMeta = bets[0] || null;

  if (bets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        No highflyer crash game investigation data found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full text-sm">
      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
        
        {/* UNIFIED MASTER HEADER (COMMON ELEMENTS) */}
        <div className="px-5 py-4 border-b border-border bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            {/* LEFT */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-6 px-2 flex items-center rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600">
                  HIGHFLYER ACTIVITY TRACKED
                </span>
                <span className="h-6 px-2 flex items-center rounded-md text-xs font-medium bg-muted text-muted-foreground font-mono">
                  {bets.length} ACTIVE {bets.length === 1 ? "BET POSITION" : "BET POSITIONS"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-foreground">
                  User ID: {commonMeta?.user_id || "—"}
                </span>
                <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-muted-foreground">
                  Game ID: {commonMeta?.game_id || "—"}
                </span>
                <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-muted-foreground">
                  Table ID: {commonMeta?.table_id || "—"}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Game Crashed</p>
              <p className="text-lg font-bold font-mono text-red-600">
                {gameCrashedAt ? `${gameCrashedAt}x` : "BUST"}
              </p>
            </div>
          </div>
        </div>

        {/* WORKSPACE BODY - SPLIT CARD VIEW FOR PARALLEL BETSPOTS */}
        <div className="p-5">
          <div className={`grid grid-cols-1 gap-4 ${bets.length > 1 ? "md:grid-cols-2" : ""}`}>
            {bets.map((bet: HighflyerBetType, index: number) => {
              // --- 1. DATA AND MULTIPLIER RESOLUTION ---
              const wageredAmount = bet.bet_amount ?? 0;
              const mainMultiplier = bet.multiplier ?? 0;
              const isBusted = mainMultiplier === -1 || mainMultiplier <= 0;

              // --- 2. CONFIGURATION STRINGS ---
              const rawTarget = bet.auto_cash_out ?? bet.requested_cash_out ?? bet.force_cash_out;
              const targetConfigDisplay = rawTarget && rawTarget !== -1 ? `${Number(rawTarget).toFixed(2)}x` : null;

              // --- 3. PAYOUT CALCULATION ---
              const totalPayout = isBusted ? 0 : wageredAmount * mainMultiplier;

              // --- 4. EXECUTED CASHOUT SCHEME TYPE ---
              let cashOutTypeDisplay = "Not Settled";
              if (isBusted) cashOutTypeDisplay = "Bust / Lost";
              else if (bet.force_cash_out) cashOutTypeDisplay = "Force Cashout";
              else if (bet.auto_cash_out) cashOutTypeDisplay = "Auto Cashout";
              else if (bet.requested_cash_out) cashOutTypeDisplay = "Requested Cashout";
              else if (mainMultiplier > 0) cashOutTypeDisplay = "Manual Cashout";

              const isDisconnected = bet.is_disconnected === true;

              return (
                <div 
                  key={bet.bet_id || index} 
                  className="rounded-xl border border-border bg-muted/5 p-4 flex flex-col gap-4 shadow-sm"
                >
                  {/* Spot Label Header */}
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">
                      Spot Position #0{index + 1}
                    </h3>
                    <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {cashOutTypeDisplay}
                    </span>
                  </div>

                  {/* FINANCIAL KPI SUBROW */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Bet Amount</p>
                      <p className="text-base font-semibold mt-1">
                        IDR {formatCurrency(wageredAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Payout Received</p>
                      <p className={`text-base font-semibold mt-1 ${totalPayout > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                        IDR {formatCurrency(totalPayout)}
                      </p>
                    </div>
                  </div>

                  {/* SETTLEMENT TRACK MATRIX CARD */}
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/10 p-4 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto Target Setup</span>
                        <span className="font-mono font-medium">{targetConfigDisplay ? targetConfigDisplay : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed Multiplier</span>
                        <span className={`font-mono font-bold ${isBusted ? "text-red-500" : "text-indigo-600"}`}>
                          {isBusted ? "Bust" : `${mainMultiplier.toFixed(2)}x`}
                        </span>
                      </div>
                    </div>

                    {/* ACTION TIMELINE SEQUENCES LOGS */}
                    <div className="pt-3 border-t border-indigo-100/40 text-xs text-indigo-950/70 bg-indigo-50/40 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                      <p className="font-sans font-bold text-indigo-800/80 uppercase text-[10px] tracking-wide mb-1.5">Sequence Logs</p>
                      <div className="flex justify-between"><span>Committed:</span> <span>{formatDate(bet.created_time)}</span></div>
                      {bet.auto_cash_out_initiated_time && (
                        <div className="flex justify-between"><span>Auto Init:</span> <span>{formatDate(bet.auto_cash_out_initiated_time)}</span></div>
                      )}
                      {bet.requested_cash_out_initiated_time && (
                        <div className="flex justify-between"><span>Req Init:</span> <span>{formatDate(bet.requested_cash_out_initiated_time)}</span></div>
                      )}
                      {bet.force_cash_out_initiated_time && (
                        <div className="flex justify-between"><span>Force Override:</span> <span>{formatDate(bet.force_cash_out_initiated_time)}</span></div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-dashed border-indigo-100 flex justify-between items-center text-xs">
                      <span className="text-indigo-900/60 font-medium">Spot Return:</span>
                      <span className="text-emerald-600 font-bold text-sm">IDR {formatCurrency(totalPayout)}</span>
                    </div>
                  </div>

                  {/* DISCONNECTION TELEMETRY DIAGNOSTICS */}
                  <div className="grid grid-cols-1 gap-2 text-xs bg-background p-3 rounded-xl border border-border font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Network Interrupted:</span>
                      <span className={isDisconnected ? "text-amber-600 font-bold" : "text-emerald-600"}>
                        {isDisconnected ? "Yes" : "No"}
                      </span>
                    </div>
                    {bet.disconnected_time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans">Interruption Time:</span>
                        <span>{formatDate(bet.disconnected_time)}</span>
                      </div>
                    )}
                  </div>

                  {/* IDENTIFIER HASH FOOTER */}
                  <div className="bg-muted/40 p-2 rounded-lg border border-border/60 flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-muted-foreground">Bet ID</span>
                    <span className="text-foreground select-all break-all">{bet.bet_id || "—"}</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HighflyerGameResult;
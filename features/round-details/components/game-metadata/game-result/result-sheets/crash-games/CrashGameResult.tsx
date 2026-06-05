"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toUTCString();
};

const formatCurrency = (amount?: number | null) => {
  return Number(amount || 0).toLocaleString();
};

// Helper function to translate API cashout type strings into human-readable text
const parseCashoutTypeName = (typeString: string | null) => {
  if (!typeString) return "Not Settled";
  const normalized = typeString.trim().toUpperCase();
  if (normalized === "OD") return "On Demand Cashout";
  if (normalized === "AU") return "Auto Cashout";
  return typeString; // Fallback to raw type if something else arrives
};

const CrashGameResult = () => {
  const { roundDetails } = useRoundDetails();
  const bets = roundDetails?.crashGamesData || [];
  const gameCrashedAt = roundDetails?.gameDetails?.[0]?.state_indicator 
    ? (Number(roundDetails.gameDetails[0].state_indicator) / 100).toFixed(2) 
    : null;
    console.log("Round Details in CrashGameResult:", roundDetails);
  return (
    <div className="flex flex-col gap-3 w-full text-sm">
      {bets.map((bet: any, index: number) => {
        // --- 1. CORE DATA RESOLUTION (HYBRID KEYS) ---
        const wageredAmount = bet.betAmount ?? bet.bet_amount ?? 0;
        const mainMultiplier = bet.multiplier ?? 0;
        
        // Multiplier validation (-1 or <= 0 indicates a loss/bust)
        const isMainBusted = mainMultiplier === -1 || mainMultiplier <= 0;
        const isHalfBusted = bet.HC_MUL === -1 || bet.HC_MUL <= 0;
        const isCompleteBusted = bet.CO_MUL === -1 || bet.CO_MUL <= 0;

        // --- 2. MULTIPLIER CALCULATIONS ---
        // Half Cashout Target configuration (e.g. halfmultiplier: 2 means auto-half at 2.00x)
        const halfTargetConfig = bet.halfmultiplier && bet.halfmultiplier !== -1 
          ? Number(bet.halfmultiplier).toFixed(2) 
          : (bet.HC_Requested ? Number(bet.HC_Requested).toFixed(2) : null);
        
        // Complete/Full Cashout Target configuration (auto_cash_out or requested fields)
        const rawFullTarget = bet.auto_cash_out ?? bet.requested_cash_out ?? bet.requestedCashout ?? bet.FC_Requested;
        const fullTargetConfig = rawFullTarget && rawFullTarget !== -1
          ? (rawFullTarget > 10 ? rawFullTarget / 100 : rawFullTarget).toFixed(2) 
          : null;

        // --- 3. PAYOUT RESOLUTION ---
        const explicitHalfPayout = bet.HC_CashPayOut ?? 0;
        const explicitCompletePayout = bet.FC_CashPayOut ?? 0;
        const totalPayout = explicitHalfPayout + explicitCompletePayout;

        // --- 4. EXECUTED CASHOUT SCHEME TYPE ---
        let cashOutTypeDisplay = parseCashoutTypeName(bet.CO_TYPE);
        if (cashOutTypeDisplay === "Not Settled") {
          if (bet.force_cash_out) cashOutTypeDisplay = "Force Cashout";
          else if (bet.requested_cash_out || bet.requestedCashout) cashOutTypeDisplay = "Auto Cashout";
          else if (bet.processedCashout) cashOutTypeDisplay = "Manual Cashout";
          else if (isCompleteBusted) cashOutTypeDisplay = "Bust / Lost";
          else if (!isCompleteBusted) cashOutTypeDisplay = "Complete Cashout";
        }

        // --- 5. STRING VS BOOLEAN DISCONNECTION SAFEGUARD ---
        const isDisconnected = bet.is_disconnected === true || 
                               bet.is_disconnected === "true" || 
                               bet.Disconnected === true || 
                               bet.Disconnected === "true";

        return (
          <div
            key={bet.bet_id || index}
            className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-5 py-4 border-b border-border bg-muted/20">
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`h-6 px-2 flex items-center rounded-md text-xs font-medium ${
                        isMainBusted && isHalfBusted && isCompleteBusted
                          ? "bg-red-500/10 text-red-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}
                    >
                      {isMainBusted && isHalfBusted && isCompleteBusted ? "ROUND BUSTED" : "CASHOUT ACTIVITY RECORDED"}
                    </span>

                    <span className="h-6 px-2 flex items-center rounded-md text-xs font-medium bg-muted text-muted-foreground font-mono">
                      BET #{index + 1}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-foreground">
                      User ID: {bet.userId || bet.user_id || "—"}
                    </span>
                    <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-muted-foreground">
                      Game ID: {bet.gameId || bet.game_id || "—"}
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

            {/* BODY */}
            <div className="p-5 flex flex-col gap-4">
              
              {/* PRIMARY FINANCIAL KPI SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Initial Bet Amount</p>
                  <p className="text-base font-semibold mt-1">
                    IDR {formatCurrency(wageredAmount)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Total Payout Received</p>
                  <p className={`text-base font-semibold mt-1 ${totalPayout > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                    IDR {formatCurrency(totalPayout)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Split Setup Status</p>
                  <p className="text-sm font-medium mt-1">
                    {bet.HC_BetAmount > 0 ? (
                      <span className="text-indigo-600 font-semibold">Active Split Session</span>
                    ) : (
                      <span className="text-muted-foreground">Single Cashout Only</span>
                    )}
                  </p>
                </div>
              </div>

              {/* SIDE-BY-SIDE SPLIT EXECUTION VIEW WITH RESIDENCY LOGS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 50% HALF CASHOUT CARD */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/10 p-4 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2 mb-3">
                      <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        1. Half Cashout (HC)
                      </h3>
                      <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {parseCashoutTypeName(bet.HC_TYPE)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto Target Multiplier</span>
                        <span className="font-mono font-medium">{halfTargetConfig ? `${halfTargetConfig}x` : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wager Allocation</span>
                        <span className="font-medium">IDR {formatCurrency(bet.HC_BetAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed Multiplier</span>
                        <span className={`font-mono font-bold ${isHalfBusted ? "text-red-500" : "text-indigo-600"}`}>
                          {isHalfBusted ? "Bust" : `${bet.HC_MUL?.toFixed(2)}x`}
                        </span>
                      </div>
                    </div>

                    {/* HC-SPECIFIC INTERNAL LOGS */}
                    <div className="mt-4 pt-3 border-t border-indigo-100/40 text-xs text-indigo-950/70 bg-indigo-50/40 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                      <p className="font-sans font-bold text-indigo-800/80 uppercase text-[10px] tracking-wide mb-1.5">HC Sequence Logs</p>
                      <div className="flex justify-between"><span>Requested:</span> <span className="font-sans">{bet.HC_Requested ? `${bet.HC_Requested}x` : "No"}</span></div>
                      <div className="flex justify-between"><span>Req Time:</span> <span>{formatDate(bet.HC_RequestTime)}</span></div>
                      <div className="flex justify-between"><span>Settle Time:</span> <span>{formatDate(bet.HC_SettleTime)}</span></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-indigo-100 flex justify-between items-center text-xs">
                    <span className="text-indigo-900/60 font-medium">HC Split Return:</span>
                    <span className="text-emerald-600 font-bold text-sm">IDR {formatCurrency(explicitHalfPayout)}</span>
                  </div>
                </div>

                {/* 100% COMPLETE / FULL / FINAL CASHOUT CARD */}
                <div className="rounded-xl border border-violet-100 bg-violet-50/10 p-4 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-violet-100/50 pb-2 mb-3">
                      <h3 className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                        2. Complete / Full Cashout (CO)
                      </h3>
                      <span className="text-xs font-medium bg-violet-50 text-violet-700 px-2 py-0.5 rounded">
                        {cashOutTypeDisplay}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto Target Multiplier</span>
                        <span className="font-mono font-medium">{fullTargetConfig ? `${fullTargetConfig}x` : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wager Allocation</span>
                        <span className="font-medium">IDR {formatCurrency(bet.FC_BetAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed Multiplier</span>
                        <span className={`font-mono font-bold ${isCompleteBusted ? "text-red-500" : "text-violet-600"}`}>
                          {isCompleteBusted ? "Bust" : `${bet.CO_MUL?.toFixed(2)}x`}
                        </span>
                      </div>
                    </div>

                    {/* CO-SPECIFIC INTERNAL LOGS */}
                    <div className="mt-4 pt-3 border-t border-violet-100/40 text-xs text-violet-950/70 bg-violet-50/40 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                      <p className="font-sans font-bold text-violet-800/80 uppercase text-[10px] tracking-wide mb-1.5">CO Sequence Logs</p>
                      <div className="flex justify-between"><span>Requested:</span> <span className="font-sans">{bet.FC_Requested ? `${bet.FC_Requested}x` : "No"}</span></div>
                      <div className="flex justify-between"><span>Req Time:</span> <span>{formatDate(bet.FC_RequestTime)}</span></div>
                      <div className="flex justify-between"><span>Settle Time:</span> <span>{formatDate(bet.FC_SettleTime)}</span></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-violet-100 flex justify-between items-center text-xs">
                    <span className="text-violet-900/60 font-medium">CO Final Return:</span>
                    <span className="text-emerald-600 font-bold text-sm">IDR {formatCurrency(explicitCompletePayout)}</span>
                  </div>
                </div>

              </div>

              {/* TIMELINES, CONTEXTS, AND SYSTEM LOGS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/10 p-3 rounded-xl border border-border">
                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  <p className="font-sans font-semibold text-muted-foreground">Timeline Specifications</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created Timestamp:</span>
                    <span>{formatDate(bet.createdOn || bet.created_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Context Check (ck):</span>
                    <span>{formatDate(bet.ck)}</span>
                  </div>
                  {bet.Updated_on && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated Timestamp:</span>
                      <span>{formatDate(bet.Updated_on)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  <p className="font-sans font-semibold text-muted-foreground">Technical Specifications</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processed Value:</span>
                    <span>{bet.processedCashout || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Interrupted:</span>
                    <span className={isDisconnected ? "text-amber-600 font-bold" : "text-emerald-600"}>
                      {isDisconnected ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* TRACKING IDENTIFIER FOOTER */}
              <div className="bg-muted/40 p-2 rounded-lg border border-border/60 flex flex-col gap-1 text-[11px] font-mono">
                <span className="text-muted-foreground">System Transaction Hash (Bet ID)</span>
                <span className="text-foreground select-all break-all">{bet.bet_id || "—"}</span>
              </div>

            </div>
          </div>
        );
      })}

      {bets.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          No crash game investigation data found.
        </div>
      )}
    </div>
  );
};

export default CrashGameResult;
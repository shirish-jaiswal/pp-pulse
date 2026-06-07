"use client";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { CrashGameBetType, CrashGameData } from "@/features/round-details/types/crash-games";
import { formatCurrency, formatDate } from "./helper";

// Helper function to translate API cashout type strings into human-readable text
const parseCashoutTypeName = (typeString: string | null) => {
  if (!typeString) return "Not Settled";
  const normalized = typeString.trim().toUpperCase();
  if (normalized === "OD") return "On Demand Cashout";
  if (normalized === "AU") return "Auto Cashout";
  return typeString;
};

const CrashGameResult = () => {
  const { roundDetails } = useRoundDetails();

  const bets: CrashGameData = (roundDetails?.crashGamesData || []) as CrashGameData;

  const gameCrashedAt = roundDetails?.gameDetails?.[0]?.state_indicator
    ? (Number(roundDetails.gameDetails[0].state_indicator) / 100).toFixed(2)
    : null;

  return (
    <div className="flex flex-col gap-3 w-full text-sm">
      {bets.map((bet: CrashGameBetType, index: number) => {
        const currency = (roundDetails?.tptInfo?.[0]?.currency_code || "") as string;

        const total_bet_amount = formatCurrency(currency, bet.betAmount);

        const full_cashout_opted_enabled = bet.multiplier > 0 ? bet.multiplier + 'x' : '-';
        const half_cashout_opted_enabled = bet.halfmultiplier > 0 ? bet.halfmultiplier + 'x' : '-';

        const full_cashout_executed_at = bet.CO_MUL > 0 ? bet.CO_MUL + 'x' : '-';
        const half_cashout_executed_at = bet.HC_MUL > 0 ? bet.HC_MUL + 'x' : '-';

        const full_cashout_bet_amount = formatCurrency(currency, bet.FC_BetAmount);
        const half_cashout_bet_amount = formatCurrency(currency, bet.HC_BetAmount);

        // --- PAYOUT RESOLUTION ---
        const half_cashout_pay_out = formatCurrency(currency, bet.HC_CashPayOut);
        const full_cashout_pay_out = formatCurrency(currency, bet.FC_CashPayOut);
        const total_payout = formatCurrency(
          currency,
          (bet.HC_CashPayOut || 0) + (bet.FC_CashPayOut || 0)
        );

        const half_cashout_requested_at = bet.HC_Requested ? bet.HC_Requested + 'x' : '-';
        const full_cashout_requested_at = bet.FC_Requested ? bet.FC_Requested + 'x' : '-';

        // --- EXECUTED CASHOUT SCHEME TYPE ---
        const full_cashout_type = parseCashoutTypeName(bet.CO_TYPE);
        const half_cashout_type = parseCashoutTypeName(bet.HC_TYPE);

        // --- STRING VS BOOLEAN DISCONNECTION SAFEGUARD ---
        const isDisconnected = bet.Disconnected ? "YES" : "NO";

        console.log("isDIsco", isDisconnected)
        return (
          <div
            key={bet.bet_id || index}
            className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-5 py-2 border-b border-border bg-muted/20">
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-foreground">
                      User ID: {bet.userId}
                    </span>
                    <span className="h-6 px-2 flex items-center rounded-md text-xs font-mono bg-muted text-muted-foreground">
                      Game ID: {bet.gameId}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Initial Bet Amount</p>
                  <p className="text-base font-semibold mt-1">{total_bet_amount}</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Total Payout Received</p>
                  <p className="text-base font-semibold mt-1 text-emerald-600">{total_payout}</p>
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
                        {half_cashout_type}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Auto Cashout Enabled at</span>
                        <span
                          className={`font-mono font-semibold text-xs ${half_cashout_opted_enabled ? "text-indigo-600" : "text-muted-foreground"
                            }`}
                        >
                          {half_cashout_opted_enabled}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Requested Cashout Multiplier</span>
                        <span className="font-mono font-medium">
                          {half_cashout_requested_at}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed Cashout Multiplier</span>
                        <span className="font-mono font-medium">
                          {half_cashout_executed_at}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">BET Amount</span>
                        <span className="font-medium">{half_cashout_bet_amount}</span>
                      </div>
                    </div>

                    {/* HC-SPECIFIC INTERNAL LOGS */}
                    <div className="mt-4 pt-3 border-t border-indigo-100/40 text-xs text-indigo-950/70 bg-indigo-50/40 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                      <p className="font-sans font-bold text-indigo-800/80 uppercase text-[10px] tracking-wide mb-1.5">
                        HC Sequence Logs
                      </p>
                      <div className="flex justify-between">
                        <span>Req Time:</span> <span>{formatDate(bet.HC_RequestTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settle Time:</span> <span>{formatDate(bet.HC_SettleTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-indigo-100 flex justify-between items-center text-xs">
                    <span className="text-indigo-900/60 font-medium">Payout :</span>
                    <span className="text-emerald-600 font-bold text-sm">{half_cashout_pay_out}</span>
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
                        {full_cashout_type}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Auto Cashout Enabled at</span>
                        <span
                          className={`font-mono font-semibold text-xs ${full_cashout_opted_enabled ? "text-violet-600" : "text-red-500"
                            }`}
                        >
                          {full_cashout_opted_enabled}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Requested Cashout Multiplier</span>
                        <span className="font-mono font-medium">
                          {full_cashout_requested_at}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed Cashout Multiplier</span>
                        <span className="font-mono font-medium">
                          {full_cashout_executed_at}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">BET Amount</span>
                        <span className="font-medium">{full_cashout_bet_amount}</span>
                      </div>
                    </div>

                    {/* CO-SPECIFIC INTERNAL LOGS */}
                    <div className="mt-4 pt-3 border-t border-violet-100/40 text-xs text-violet-950/70 bg-violet-50/40 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                      <p className="font-sans font-bold text-violet-800/80 uppercase text-[10px] tracking-wide mb-1.5">
                        CO Sequence Logs
                      </p>
                      <div className="flex justify-between">
                        <span>Req Time:</span> <span>{formatDate(bet.FC_RequestTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settle Time:</span> <span>{formatDate(bet.FC_SettleTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-violet-100 flex justify-between items-center text-xs">
                    <span className="text-violet-900/60 font-medium">Payout :</span>
                    <span className="text-emerald-600 font-bold text-sm">{full_cashout_pay_out}</span>
                  </div>
                </div>
              </div>

              {/* TIMELINES, CONTEXTS, AND SYSTEM LOGS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timeline Specifications */}
                <div className="bg-muted/20 rounded-xl border border-border/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Timeline Specifications
                  </p>
                  <div className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-4 text-xs">
                    <span className="text-muted-foreground py-1">Created Timestamp</span>
                    <span className="font-mono text-right bg-background/50 px-2 py-1 rounded border border-border/40">
                      {formatDate(bet.createdOn)}
                    </span>

                    <span className="text-muted-foreground py-1">Context Check (ck)</span>
                    <span className="font-mono text-right bg-background/50 px-2 py-1 rounded border border-border/40">
                      {formatDate(bet.ck)}
                    </span>

                    {bet.Updated_on && (
                      <>
                        <span className="text-muted-foreground py-1">Updated Timestamp</span>
                        <span className="font-mono text-right bg-background/50 px-2 py-1 rounded border border-border/40">
                          {formatDate(bet.Updated_on)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="bg-muted/20 rounded-xl border border-border/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Technical Specifications
                  </p>
                  <div className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-4 text-xs items-center">
                    <span className="text-muted-foreground py-1">Processed Value</span>
                    <span className="font-mono text-right bg-background/50 px-2 py-1 rounded border border-border/40">
                      {bet.processedCashout || "—"}
                    </span>

                    <span className="text-muted-foreground py-1">Network Interrupted</span>
                    <span
                      className={`text-right font-semibold px-2 py-1 rounded border`}
                    >
                      {isDisconnected}
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
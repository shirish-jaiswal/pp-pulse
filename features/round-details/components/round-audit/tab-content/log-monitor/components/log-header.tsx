// @/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header.tsx
"use client";

import { Search, Activity, RefreshCw, AlertCircle, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface LogHeaderProps {
  availableTabs: string[];
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
  query: string;
  setQuery: (val: string) => void;
  roundId: string;
  refetchRoundLogs: () => Promise<void>;
  isLoading: boolean;
  hasTxnError?: boolean;
  hasGameError?: boolean;
  txnIsLoading?: boolean;
  gameIsLoading?: boolean;
  txnIsSuccess?: boolean;
  gameIsSuccess?: boolean;
}

export function LogHeader({
  availableTabs,
  activeTab,
  setActiveTab,
  query,
  setQuery,
  roundId,
  refetchRoundLogs,
  isLoading,
  hasTxnError = false,
  hasGameError = false,
  txnIsLoading = false,
  gameIsLoading = false,
  txnIsSuccess = false,
  gameIsSuccess = false,
}: LogHeaderProps) {
  
  return (
    <header className="h-10 flex items-center border-b border-border px-3 bg-muted/60">
      
      {/* LEFT: Tabs with customized status badges */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {availableTabs.map((tab: string) => {
          const isGameLogsTab = tab === "gameLogs";
          const isPlatformOrTxnTab = tab === "platformLogs" || tab === "lcTransactionLogs";
          
          const tabHasFailed = (isGameLogsTab && hasGameError) || (isPlatformOrTxnTab && hasTxnError);
          const tabIsLoading = (isGameLogsTab && gameIsLoading) || (isPlatformOrTxnTab && txnIsLoading);
          const tabIsSuccess = (isGameLogsTab && gameIsSuccess) || (isPlatformOrTxnTab && txnIsSuccess);

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative flex items-center gap-1.5 px-2 py-1 text-[11px] uppercase tracking-wide font-medium border-b-2 transition select-none h-8",
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                tabHasFailed && "text-destructive hover:text-destructive/80",
                tabIsLoading && "text-primary/80"
              )}
              title={
                tabHasFailed 
                  ? "Warning: Failed to fetch records for this segment round query" 
                  : tabIsLoading 
                    ? "Streaming records..." 
                    : undefined
              }
            >
              <span>{tab}</span>
              
              {/* Animated Refresh Spinner inside Loading Tab */}
              {tabIsLoading && (
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-primary" />
              )}

              {/* Minimal Checkmark Variant for Loaded Stream Confirmation */}
              {tabIsSuccess && !tabIsLoading && (
                <Check className="w-2.5 h-2.5 text-emerald-500 animate-in fade-in zoom-in-75 duration-200" />
              )}

              {/* Pulsing Red Status Indicator Dot for Errors */}
              {tabHasFailed && !tabIsLoading && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CENTER: Filter Input */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-3xl">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter logs..."
            className="w-full h-8 pl-7 pr-2 bg-background border border-border text-sm outline-none rounded-md"
          />
        </div>
      </div>

      {/* RIGHT: Status Tracking */}
      <div className="flex items-center gap-3 text-xs flex-shrink-0 text-muted-foreground">
        {(hasGameError || hasTxnError) && (
          <div className="flex items-center gap-1 text-red-500 font-medium font-mono text-[11px] animate-pulse">
            <AlertCircle className="w-3 h-3" />
            <span>PARTIAL ROUND FETCH ERROR</span>
          </div>
        )}

        <button
          onClick={refetchRoundLogs}
          disabled={isLoading || !roundId}
          className="flex items-center justify-center h-7 w-7 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          title="Bypass cache & force refresh current active query stream"
        >
          <RefreshCw 
            className={cn(
              "w-3 h-3 text-muted-foreground transition-colors", 
              isLoading && "animate-spin text-primary"
            )} 
          />
        </button>

        <span className="flex items-center gap-1 text-foreground font-medium">
          <Activity className="w-3 h-3" />
        </span>
        <span className="font-mono text-[11px]">ID: {roundId || "N/A"}</span>
      </div>
    </header>
  );
}
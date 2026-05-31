"use client";

import { Search, Activity, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

interface LogHeaderProps {
  availableTabs: string[];
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
  query: string;
  setQuery: (val: string) => void;
  roundId: string;
  refetchRoundLogs: () => Promise<void>; // ✅ New prop
  isLoading: boolean;                     // ✅ New prop
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
}: LogHeaderProps) {
  return (
    <header className="h-10 flex items-center border-b border-border px-3 bg-muted/60">
      
      {/* LEFT: Tabs */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {availableTabs.map((tab: string) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-2 py-1 text-[11px] uppercase tracking-wide font-medium border-b-2 transition",
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CENTER: Search (properly isolated) */}
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

      {/* RIGHT: Status & Targeted Actions */}
      <div className="flex items-center gap-3 text-xs flex-shrink-0 text-muted-foreground">
        <button
          onClick={refetchRoundLogs}
          disabled={isLoading || !roundId}
          className={cn(
            "flex items-center justify-center h-7 w-7 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Bypass cache & force refresh current round logs"
        >
          <RefreshCw 
            className={cn(
              "w-3 h-3 text-muted-foreground transition-colors group-hover:text-foreground", 
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
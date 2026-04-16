import { Search, Activity } from "lucide-react";
import { cn } from "@/utils/cn";

export function LogHeader({
  availableTabs,
  activeTab,
  setActiveTab,
  query,
  setQuery,
  roundId,
}: any) {
  return (
    <header className="h-10 flex items-center border-b border-border px-3 gap-3 bg-muted/60">
      {/* Tabs */}
      <div className="flex items-center gap-1">
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

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter logs..."
          className="w-full h-8 pl-7 pr-2 bg-background border border-border text-sm outline-none rounded-md"
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 text-xs ml-auto text-muted-foreground">
        <span className="flex items-center gap-1 text-foreground font-medium">
          <Activity className="w-3 h-3" /> LIVE
        </span>
        <span>ID: {roundId || "N/A"}</span>
      </div>
    </header>
  );
}
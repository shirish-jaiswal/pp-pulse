"use client";

import * as React from "react";
import { ListTree, Loader2, Database, Layers, ChevronRight, CornerDownRight } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INSERT_LOGS_COMMAND } from "@/components/custom/text-editor/toolbar/logs/log-command";
import { truncateLogs } from "@/components/custom/text-editor/toolbar/logs/log-utils";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { cn } from "@/utils/cn";

/**
 * Formats dirty strings (camelCase, kebab-case, snake_case) into readable text.
 * Example: "LcTransactionLogs" -> "Lc Transaction Logs"
 */
const formatTabName = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
};

export function LogTogglePlugin() {
  const [editor] = useLexicalComposerContext();

  const {
    availableTabs,
    activeTab,
    setActiveTab,
    visibleColumns,
    isLoading,
    allAccumulatedLogs,
  } = useLogState();

  const { selectedRoundDetailsMap } = useRoundDetails();
  const checkedIds = React.useMemo(() => Object.keys(selectedRoundDetailsMap || {}), [selectedRoundDetailsMap]);

  const [open, setOpen] = React.useState(false);

  const allSelectedRoundsLogs = React.useMemo(() => {
    if (!allAccumulatedLogs || !activeTab) return [];

    const combined: any[] = [];
    const targetIds = checkedIds.length > 0 ? checkedIds : Object.keys(allAccumulatedLogs);

    targetIds.forEach((id) => {
      const roundData = allAccumulatedLogs[id];
      const tabLogs = roundData?.[activeTab];
      if (Array.isArray(tabLogs)) {
        combined.push(...truncateLogs(tabLogs, 20));
      }
    });

    return combined;
  }, [allAccumulatedLogs, activeTab, checkedIds]);

  const hasLogs = allSelectedRoundsLogs.length > 0;

  const insertLogs = () => {
    if (!hasLogs) return;

    editor.dispatchCommand(INSERT_LOGS_COMMAND, {
      activeTab: activeTab || "logs",
      logs: allSelectedRoundsLogs,
      columns: visibleColumns,
    });

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-zinc-200 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950 transition-all rounded-md"
        >
          <ListTree className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">Insert Logs</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-105 p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl bg-white dark:bg-zinc-950"
        align="start"
        sideOffset={6}
      >
        <div className="flex max-h-60">

          {/* LEFT SIDEBAR: Log Selection */}
          <div className="w-45 bg-zinc-50/50 dark:bg-zinc-900/30 border-r border-zinc-100 dark:border-zinc-800 p-2.5 flex flex-col justify-between">
            <div>
              <div className="px-2 pb-2 pt-1 flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <Layers className="h-3 w-3 text-zinc-400" />
                Log Stream
              </div>

              <div className="space-y-0.5 overflow-y-auto max-h-47.5 pr-1">
                {availableTabs.map((tab) => {
                  const isSelected = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all relative font-medium group",
                        isSelected
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      <span className="truncate">{formatTabName(tab)}</span>
                      <ChevronRight className={cn(
                        "h-3 w-3 opacity-0 transform -translate-x-1 transition-all",
                        isSelected ? "opacity-100 translate-x-0" : "group-hover:opacity-40"
                      )} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Dynamic Info & Quick Action Button */}
          <div className="flex-1 p-4 flex flex-col justify-between bg-white dark:bg-zinc-950">

            {/* Top Info section */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                  Status Pane
                </span>
                <div className="flex items-start gap-1.5 mt-2.5">
                  <CornerDownRight className="h-3.5 w-3.5 text-zinc-400 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {activeTab ? formatTabName(activeTab) : "No Stream Selected"}
                    </h5>
                    {/* ✅ Jargon replaced with helpful contextual round metrics */}
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                      {checkedIds.length > 0 ? (
                        <>
                          Aggregating logs across{" "}
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {checkedIds.length} selected {checkedIds.length === 1 ? "round" : "rounds"}
                          </span>
                          .
                        </>
                      ) : (
                        "1 Round logs"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {!isLoading && (
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-2 border border-zinc-100 dark:border-zinc-800/60">
                  <Database className={cn("h-4 w-4 shrink-0", hasLogs ? "text-emerald-500" : "text-zinc-400")} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-none">Log Count</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                      {hasLogs ? `${allSelectedRoundsLogs.length} entries queued` : "0 logs matching filters"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions based on States */}
            <div className="pt-2">
              {isLoading ? (
                <div className="w-full flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-dashed rounded-lg py-2.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                  <span>Scanning rows...</span>
                </div>
              ) : hasLogs ? (
                <Button
                  className="w-full text-xs font-semibold h-9 shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-md transition-colors"
                  onClick={insertLogs}
                >
                  Confirm & Insert Logs
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full text-xs font-medium h-9 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 rounded-md cursor-not-allowed"
                >
                  Empty Target Stream
                </Button>
              )}
            </div>

          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}
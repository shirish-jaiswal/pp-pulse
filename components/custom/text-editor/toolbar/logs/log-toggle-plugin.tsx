"use client";

import * as React from "react";
import { ListTree, Loader2 } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createRangeSelection,
  $setSelection,
} from "lexical";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INSERT_LOGS_COMMAND } from "@/components/custom/text-editor/toolbar/logs/log-command";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { cn } from "@/utils/cn";

const formatTabName = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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

  const {
    activeId,
    selectedRoundDetailsMap,
    selectedRowsMap = {},
  } = useRoundDetails();

  const [open, setOpen] = React.useState(false);

  // Hard-cached reference container for user selection snapshot
  const cachedSelectionRef = React.useRef<{
    anchorKey: string;
    anchorOffset: number;
    anchorType: "text" | "element";
    focusKey: string;
    focusOffset: number;
    focusType: "text" | "element";
  } | null>(null);

  // Unified target round IDs execution layer
  const targetRoundIds = React.useMemo(() => {
    const checkedIds = Object.keys(selectedRoundDetailsMap || {});
    const rawTargetIds =
      checkedIds.length > 0
        ? checkedIds
        : activeId
          ? [activeId]
          : Object.keys(allAccumulatedLogs || {});

    return rawTargetIds.filter(
      (id): id is string => typeof id === "string" && id !== ""
    );
  }, [selectedRoundDetailsMap, activeId, allAccumulatedLogs]);

  // FIXED: Robust ID Extractor properly matching selections by processing top-level ISO timestamps
  const getLogId = React.useCallback((log: any, fallbackIdx: number): string => {
    if (!log) return String(fallbackIdx);

    const timestamp = log.timestamp || log.raw?.["@timestamp"];
    if (timestamp) {
      return `${String(timestamp)}-${fallbackIdx}`;
    }

    const id = log.id || log.logId || log.raw?.id || log.raw?.logId;
    return id ? `${String(id)}-${fallbackIdx}` : String(fallbackIdx);
  }, []);

  const getSelectedRowsForTab = React.useCallback((roundId: string, tabName: string) => {
    const rows = selectedRowsMap?.[roundId]?.[tabName];
    return Array.isArray(rows) ? rows.filter((r) => r !== undefined && r !== null) : [];
  }, [selectedRowsMap]);

  // Synchronized grouping calculation pipeline
  const groupedRoundLogs = React.useMemo(() => {
    if (!allAccumulatedLogs || !activeTab) return [];

    const isGameLogTab = activeTab.toLowerCase().includes("game");

    return targetRoundIds
      .map((id) => {
        const roundLogs = allAccumulatedLogs[id];
        const tabLogs = roundLogs?.[activeTab];

        if (!Array.isArray(tabLogs) || tabLogs.length === 0) return null;

        const sortedTabLogs = [...tabLogs].sort((a, b) => {
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeA - timeB;
        });

        const selectedRows = getSelectedRowsForTab(id, activeTab).length > 0
          ? getSelectedRowsForTab(id, activeTab)
          : getSelectedRowsForTab("", activeTab);

        const hasSelections = selectedRows.length > 0;

        const filteredLogs = hasSelections
          ? sortedTabLogs.filter((log, idx) => {
            const logId = getLogId(log, idx);
            return selectedRows.includes(logId);
          })
          : sortedTabLogs;

        return filteredLogs.length > 0
          ? { roundId: id, logs: filteredLogs }
          : null;
      })
      .filter((g): g is { roundId: string; logs: any[] } => g !== null);
  }, [allAccumulatedLogs, activeTab, targetRoundIds, getSelectedRowsForTab, getLogId]);

  const totalLogCount = React.useMemo(() => {
    return groupedRoundLogs.reduce((acc, curr) => acc + curr.logs.length, 0);
  }, [groupedRoundLogs]);

  const hasLogs = totalLogCount > 0;

  // Track popover openings to clone selection vector state safely
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          cachedSelectionRef.current = {
            anchorKey: selection.anchor.key,
            anchorOffset: selection.anchor.offset,
            anchorType: selection.anchor.type,
            focusKey: selection.focus.key,
            focusOffset: selection.focus.offset,
            focusType: selection.focus.type,
          };
        }
      });
    }

    setOpen(nextOpen);
  };

  const insertLogs = () => {
    if (!hasLogs) return;

    editor.update(() => {
      const snapshot = cachedSelectionRef.current;

      if (snapshot) {
        const selection = $createRangeSelection();

        selection.anchor.set(
          snapshot.anchorKey,
          snapshot.anchorOffset,
          snapshot.anchorType
        );

        selection.focus.set(
          snapshot.focusKey,
          snapshot.focusOffset,
          snapshot.focusType
        );
        $setSelection(selection);
      }
    });

    editor.dispatchCommand(INSERT_LOGS_COMMAND, {
      activeTab: activeTab || "logs",
      groupedLogs: groupedRoundLogs,
      columns: visibleColumns,
    });

    setOpen(false);
    cachedSelectionRef.current = null;
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-zinc-200 shadow-sm"
        >
          <ListTree className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Insert Logs</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-105 p-0" align="start">
        <div className="flex max-h-60">
          {/* LEFT SIDEBAR PANEL */}
          <div className="w-45 p-2.5 border-r overflow-y-auto max-h-60">
            <div className="text-[10px] uppercase font-bold mb-2 text-zinc-400 tracking-wider">
              Log Stream
            </div>

            <div className="space-y-0.5">
              {availableTabs.map((tab) => {
                const tabLogCount = targetRoundIds.reduce((sum, id) => {
                  const tabLogs = allAccumulatedLogs?.[id]?.[tab] || [];
                  const selectedRows = getSelectedRowsForTab(id, tab).length > 0
                    ? getSelectedRowsForTab(id, tab)
                    : getSelectedRowsForTab("", tab);
                  return sum + (selectedRows.length > 0 ? selectedRows.length : tabLogs.length);
                }, 0);

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "w-full text-left px-2 py-1 text-xs rounded flex items-center justify-between transition-colors",
                      tab === activeTab
                        ? "bg-black text-white font-medium"
                        : "hover:bg-zinc-100 text-zinc-700"
                    )}
                  >
                    <span className="truncate">{formatTabName(tab)}</span>
                    {tabLogCount > 0 && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-mono",
                        tab === activeTab ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-500"
                      )}>
                        {tabLogCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT ACTION PANEL */}
          <div className="flex-1 p-4 flex flex-col justify-between bg-zinc-50/50 max-h-60 overflow-y-auto">
            <div>
              <h4 className="text-xs font-semibold text-zinc-900">
                {activeTab ? formatTabName(activeTab) : "No Tab Selected"}
              </h4>

              <p className="text-[11px] text-zinc-500 mt-1">
                {targetRoundIds.length > 0
                  ? `Active Scope: ${targetRoundIds.length} round(s)`
                  : "No data available"}
              </p>

              <div className="mt-4 p-2 bg-white border border-zinc-100 rounded-md shadow-2xs">
                <div className="flex justify-between items-center text-xs text-zinc-600">
                  <span>Logs to Insert:</span>
                  <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
                    {totalLogCount}
                  </span>
                </div>
              </div>
            </div>

            <Button
              disabled={!hasLogs || isLoading}
              onClick={insertLogs}
              className="mt-4 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Loading...
                </>
              ) : (
                `Insert Logs (${totalLogCount})`
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
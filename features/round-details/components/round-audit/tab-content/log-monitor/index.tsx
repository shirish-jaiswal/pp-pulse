"use client";

import { useMemo } from "react";
import { LogHeader } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header";
import { LogSidebar } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-sidebar";
import { LogTable } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-table";
import { LogFooter } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-footer";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useLogState } from "./hooks/use-log-state";

interface PremiumLogMonitorProps {
  roundId: string;
  timeStamp: string;
  sharedState?: ReturnType<typeof useLogState>;
}

export default function PremiumLogMonitor({ roundId, timeStamp, sharedState }: PremiumLogMonitorProps) {
  const state = sharedState || useLogState();
  const { selectedRowsMap } = useRoundDetails();

  const currentTab = state.activeTab ?? "default";
  const currentSelectedIds = selectedRowsMap?.[roundId]?.[currentTab] || [];

  const logsToCopy = useMemo(() => {
    // If user has selected specific rows, intersect with currently filtered logs
    if (currentSelectedIds.length > 0) {
      return state.filteredLogs.filter((log) => currentSelectedIds.includes(log.id));
    }
    // Otherwise, copy exactly what the user sees (filtered/searched/sorted)
    return state.filteredLogs;
  }, [state.filteredLogs, currentSelectedIds]);

  return (
    <div className="h-[calc(100vh-2.5rem)] w-full flex flex-col text-[13px] overflow-hidden rounded-xl border">
      <LogHeader {...state} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LogSidebar
          sidebarKeys={state.sidebarKeys}
          visibleColumns={state.visibleColumns}
          setVisibleColumns={state.setVisibleColumns}
          resetToDefault={state.resetToDefault}
          filteredLogs={logsToCopy} 
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <LogTable
            filteredLogs={state.filteredLogs}
            visibleColumns={state.visibleColumns}
            activeTab={currentTab}
            isLoading={state.isLoading}
            isError={state.isTabError}
            onRetry={state.refetchRoundLogs}
          />
        </main>
      </div>
      <LogFooter {...state} />
    </div>
  );
}
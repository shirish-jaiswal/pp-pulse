// @/features/round-details/components/round-audit/tab-content/log-monitor/PremiumLogMonitor.tsx
"use client";

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

export default function PremiumLogMonitor({ sharedState }: PremiumLogMonitorProps) {
  const localState = useLogState();
  const state = sharedState || localState;
  
  const { roundDetails, selectedRowsMap, activeId } = useRoundDetails();

  const targetRoundId = activeId || roundDetails?.tptInfo?.[0]?.round_id || "";
  const currentTab = state.activeTab ?? "default";
  const currentSelectedIds = selectedRowsMap?.[targetRoundId]?.[currentTab] || [];

  const getLogId = (log: any, fallbackIdx: number): string => {
    if (!log) return String(fallbackIdx);
    const timestamp = log.timestamp || log.raw?.["@timestamp"];
    if (timestamp) return `${String(timestamp)}-${fallbackIdx}`;
    const id = log.id || log.logId || log.raw?.id || log.raw?.logId;
    return id ? `${String(id)}-${fallbackIdx}` : String(fallbackIdx);
  };

  const logsToPassToSidebar = currentSelectedIds.length > 0
    ? state.filteredLogs.filter((log: any, idx: number) => currentSelectedIds.includes(getLogId(log, idx)))
    : state.filteredLogs;

  return (
    <div className="h-[calc(100vh-2.5rem)] w-full flex flex-col text-[13px] overflow-hidden rounded-xl border">
      <LogHeader {...state} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LogSidebar {...state} logs={logsToPassToSidebar} />

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
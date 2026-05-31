// @/features/round-details/components/round-audit/tab-content/log-monitor/PremiumLogMonitor.tsx
"use client";

import { LogHeader } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header";
import { LogSidebar } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-sidebar";
import { LogTable } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-table";
import { LogFooter } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-footer";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { LogSkeleton } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-skeleton";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

interface PremiumLogMonitorProps {
  roundId: string;
  timeStamp: string;
  sharedState?: ReturnType<typeof useLogState>;
}

export default function PremiumLogMonitor({ sharedState }: PremiumLogMonitorProps) {
  const localState = useLogState();
  const state = sharedState || localState;
  
  // 1. Consume the global selection maps to filter down copying data
  const { roundDetails, selectedRowsMap, activeId } = useRoundDetails();

  if (state.isLoading) {
    return <LogSkeleton />;
  }

  // 2. Resolve target round context keys identically to the LogTable component
  const targetRoundId = activeId || roundDetails?.tptInfo?.[0]?.round_id || "";
  const currentTab = state.activeTab ?? "default";
  const currentSelectedIds = selectedRowsMap?.[targetRoundId]?.[currentTab] || [];

  // 3. Helper to build unique IDs for log matches
  const getLogId = (log: any, fallbackIdx: number): string => {
    if (!log) return String(fallbackIdx);
    const timestamp = log.timestamp || log.raw?.["@timestamp"];
    if (timestamp) return `${String(timestamp)}-${fallbackIdx}`;
    const id = log.id || log.logId || log.raw?.id || log.raw?.logId;
    return id ? `${String(id)}-${fallbackIdx}` : String(fallbackIdx);
  };

  // 4. Compute the specific subset to pass down to the copy utilities
  // Default back to entire array fallback logic if no items are checkmarked yet
  const logsToPassToSidebar = currentSelectedIds.length > 0
    ? state.filteredLogs.filter((log: any, idx: number) => currentSelectedIds.includes(getLogId(log, idx)))
    : state.filteredLogs;

  return (
    <div className="h-[calc(100vh-2.5rem)] w-full flex flex-col text-[13px] overflow-hidden">
      <LogHeader {...state} />

      {/* Main layout track: min-h-0 containerizes children */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Overwriting 'logs' hook data with our filtered tracking array */}
        <LogSidebar {...state} logs={logsToPassToSidebar} />

        {/* min-w-0 stops a wide table from bleeding horizontally into the sidebar track */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <LogTable
            filteredLogs={state.filteredLogs}
            visibleColumns={state.visibleColumns}
            activeTab={currentTab}
          />
        </main>
      </div>

      <LogFooter {...state} />
    </div>
  );
}
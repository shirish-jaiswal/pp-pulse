// @/features/round-details/components/round-audit/tab-content/log-monitor/PremiumLogMonitor.tsx
"use client";

import { LogHeader } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header";
import { LogSidebar } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-sidebar";
import { LogTable } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-table";
import { LogFooter } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-footer";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { LogSkeleton } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-skeleton";

interface PremiumLogMonitorProps {
  roundId: string;
  timeStamp: string;
  sharedState?: ReturnType<typeof useLogState>;
}

export default function PremiumLogMonitor({ roundId, timeStamp, sharedState }: PremiumLogMonitorProps) {
  const localState = useLogState();
  const state = sharedState || localState;

  if (state.isLoading) {
    return <LogSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-2.5rem)] w-full flex flex-col text-[13px] overflow-hidden">
      <LogHeader {...state} />

      {/* Main layout track: min-h-0 containerizes children */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LogSidebar {...state} />

        {/* min-w-0 stops a wide table from bleeding horizontally into the sidebar track */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <LogTable
            filteredLogs={state.filteredLogs}
            visibleColumns={state.visibleColumns}
            activeTab={state.activeTab ?? "default"}
          />
        </main>
      </div>

      <LogFooter {...state} />
    </div>
  );
}
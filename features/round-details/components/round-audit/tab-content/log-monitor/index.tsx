"use client";

import { LogHeader } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header";
import { LogSidebar } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-sidebar";
import { LogTable } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-table";
import { LogFooter } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-footer";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { LogSkeleton } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-skeleton";

export default function PremiumLogMonitor({ roundId, timeStamp }: any) {
  const state = useLogState();

  if (state.isLoading) {
    return <LogSkeleton />;
  }

  return (
    <div className="h-screen w-full flex flex-col text-[13px] overflow-hidden">
      <LogHeader {...state} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LogSidebar {...state} />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <LogTable {...state} />
        </main>
      </div>

      <LogFooter {...state} />
    </div>
  );
}
"use client";

import { LogHeader } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-header";
import { LogSidebar } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-sidebar";
import { LogTable } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-table";
import { LogFooter } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-footer";
import { useLogState } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-log-state";
import { LogSkeleton } from "@/features/round-details/components/round-audit/tab-content/log-monitor/components/log-skeleton";

export default function PremiumLogMonitor({ roundId, timeStamp }: any) {
  const state = useLogState(roundId, timeStamp);

  if (state.isLoading) {
    return <LogSkeleton />;
  }

  return (
    <div className="h-fit w-full flex flex-col text-[13px]">
      <LogHeader {...state} />

      <div className="flex flex-1 overflow-hidden">
        <LogSidebar {...state} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <LogTable {...state} />
        </main>
      </div>

      <LogFooter {...state} />
    </div>
  );
}
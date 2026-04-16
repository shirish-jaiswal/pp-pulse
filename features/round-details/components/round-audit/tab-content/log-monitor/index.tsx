"use client";

import { LogHeader } from "./log-header";
import { LogSidebar } from "./log-sidebar";
import { LogTable } from "./log-table";
import { LogFooter } from "./log-footer";
import { useLogState } from "./use-log-state";

export default function PremiumLogMonitor({ roundId, timeStamp }: any) {
  const state = useLogState(roundId, timeStamp);

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
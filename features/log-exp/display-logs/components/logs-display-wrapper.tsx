"use client";

import { KibanaFieldsSidebar } from "./KibanaFieldsSidebar";
import { LogResultsDisplay } from "./LogResultsDisplay";
import { useKibanaResponseStore } from "../../context/kibana-response-context";

export function LogDisplayWrapper() {
  const { searchResults, isLoading } = useKibanaResponseStore();

  // All hooks and store evaluations are run consistently before rendering layout blocks

  return (
    <div className="flex w-full h-[85dvh] max-h-[85dvh] items-stretch gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">

      {/* 1. Left Side: Interactive Column Filter Panel (Stays mounted so fields aren't wiped out) */}
      <KibanaFieldsSidebar />

      {/* 2. Right Side: Responsive Logs Data Stage Area */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">

        {/* Conditional viewport render handles data empty states without breaking the hook lifecycle counts */}
        {!searchResults && !isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center shadow-inner h-full">
            <div className="rounded-full bg-slate-100 p-3 shadow-sm border border-slate-200">
              <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-800">Workspace Empty</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs px-4">
              Select a Data View index profile and hit Search above to populate index fields and live logs.
            </p>
          </div>
        ) : (
          <LogResultsDisplay />
        )}

      </div>

    </div>
  );
}
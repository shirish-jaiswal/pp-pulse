// components/LogExploreWorkspace.tsx
"use client";

import { useEffect } from "react";
import { Webhook } from "lucide-react";
import QueryBuilderPopup from "@/features/log-exp/query-builder/components/QueryBuilderPopup";
import { DataViewsDropdownSelector } from "@/features/log-exp/data-views/data-views-dropdown-selector";
import { SmartSearchBar } from "@/features/log-exp/search-bar/components/smart-search-bar";
import { Button } from "@/components/ui/button";
import { IntegratedDateTimeRangePicker } from "@/features/log-exp/date-time-range-picker/components/integrated-date-time-range-picker";
import { KibanaFormProvider, useKibanaFormStore } from "@/features/log-exp/context/kibana-form-context";
import { KibanaResponseProvider, useKibanaResponseStore } from "@/features/log-exp/context/kibana-response-context";
import { LogDisplayWrapper } from "@/features/log-exp/display-logs/components/logs-display-wrapper";
import { MultiFilterProvider, QueryBuilderProvider } from "@/features/log-exp/query-builder/context/QueryBuilderContext";
import { FilterManagerBar } from "@/features/log-exp/query-builder/components/applied-filters/FilterManagerBar";

function LogExploreWorkspace() {
  const { dateRange, setDateRange } = useKibanaFormStore();
  const { isLoading, searchError, fetchLogs } = useKibanaResponseStore();

  useEffect(() => {
    fetchLogs(true);
  }, []);

  return (
    <div className="mx-auto space-y-2 font-sans antialiased relative">
      <div className="flex w-full flex-row items-center gap-2">
        <DataViewsDropdownSelector />
        <QueryBuilderPopup />
        <SmartSearchBar
          onSearch={() => fetchLogs(false)}
          placeholder="round_id OR (game_id AND user_id)"
        />
        <div className="max-w-[23vw]">
          <IntegratedDateTimeRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <Button
          onClick={() => fetchLogs(false)}
          disabled={isLoading}
          type="button"
          className="h-10 shrink-0 rounded-lg px-4 font-semibold bg-[#00bfb3] hover:bg-[#009b91] text-white transition-colors"
        >
          <Webhook className={"h-4 w-4 " + (isLoading && "animate-spin")} />
        </Button>
      </div>

      {isLoading && (
        <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden select-none pointer-events-none relative">
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#00bfb3] rounded-full animate-kibana-line"
            style={{ width: "30%" }}
          />
        </div>
      )}
      <FilterManagerBar />
      {searchError && (
        <div className="rounded-lg border border-red-200 bg-red-50/70 p-3 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          {searchError}
        </div>
      )}
      <LogDisplayWrapper />
    </div>
  );
}

export default function GlobalLogExploreWrapper() {
  return (
    <QueryBuilderProvider>
      <MultiFilterProvider>
        <KibanaFormProvider>
          <KibanaResponseProvider>
            <LogExploreWorkspace />
          </KibanaResponseProvider>
        </KibanaFormProvider>
      </MultiFilterProvider>
    </QueryBuilderProvider>
  );
}
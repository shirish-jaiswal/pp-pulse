// components/LogExploreWorkspace.tsx
"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import QueryBuilderPopup from "./query-builder/components/QueryBuilderPopup";
import { DataViewsDropdownSelector } from "./data-views/data-views-dropdown-selector";
import { SmartSearchBar } from "./search-bar/components/smart-search-bar";
import { Button } from "@/components/ui/button";
import { IntegratedDateTimeRangePicker } from "./date-time-range-picker/components/integrated-date-time-range-picker";
import { KibanaFormProvider, useKibanaFormStore } from "./context/kibana-form-context";
import { KibanaResponseProvider, useKibanaResponseStore } from "./context/kibana-response-context";
import { LogDisplayWrapper } from "./display-logs/components/logs-display-wrapper";
import { MultiFilterProvider } from "./query-builder/context/QueryBuilderContext";
import { FilterManagerBar } from "./query-builder/components/applied-filters/FilterManagerBar";

function LogExploreWorkspace() {
  const { dateRange, setDateRange } = useKibanaFormStore();
  const { isLoading, searchError, fetchLogs } = useKibanaResponseStore();

  useEffect(() => {
    fetchLogs(true);
  }, []);

  return (
    <div className="mx-auto space-y-2 font-sans antialiased relative">

      {/* Search Input Control Row */}
      <div className="flex w-full flex-row items-center gap-2">
        <DataViewsDropdownSelector />
        <QueryBuilderPopup />
        <SmartSearchBar
          onSearch={() => fetchLogs(false)}
          placeholder="round_id OR (game_id AND user_id)"
        />
        <IntegratedDateTimeRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <Button
          onClick={() => fetchLogs(false)}
          disabled={isLoading}
          type="button"
          className="h-10 shrink-0 rounded-lg px-4 font-semibold bg-[#00bfb3] hover:bg-[#009b91] text-white transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
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
      {/* Global Query Operational Error Alert Block */}
      {searchError && (
        <div className="rounded-lg border border-red-200 bg-red-50/70 p-3 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          {searchError}
        </div>
      )}

      {/* Data Views/Table/Histogram Panels display surface */}
      <LogDisplayWrapper />
    </div>
  );
}

export default function GlobalLogExploreWrapper() {
  return (
    <KibanaFormProvider>
      <MultiFilterProvider>
        <KibanaResponseProvider>
          <LogExploreWorkspace />
        </KibanaResponseProvider>
      </MultiFilterProvider>
    </KibanaFormProvider>
  );
}
"use client";

import { useState } from "react";
import { searchLogs } from "./searchLogs";
import QueryBuilderPopup from "./query-builder/components/QueryBuilderPopup";
import { DataViewsDropdownSelector } from "./data-views/data-views-dropdown-selector";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SmartSearchBar } from "./search-bar/smart-search-bar";
import { IntegratedDateRangePicker } from "./duration/date-time";
import { KibanaFormProvider, useKibanaFormStore } from "./search-bar/KibanaFormContext";

function LogExploreWorkspace() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    searchValue,
    selectedDataView,
    setSelectedDataView,
    compiledDslQuery
  } = useKibanaFormStore();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await searchLogs(searchValue, compiledDslQuery);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mx-auto font-sans antialiased">
      {/* Action Row Component */}
      <div className="flex flex-row items-center gap-2 w-full">

        {/* Component 1: Controlled by Data View Store values */}
        <DataViewsDropdownSelector
          selectedValue={selectedDataView}
          onSelect={(value) => setSelectedDataView(value)}
        />

        <QueryBuilderPopup />

        {/* Component 3: Clean instance without explicit value props */}
        <SmartSearchBar
          onSearch={fetchLogs}
          placeholder="round_id OR (game_id AND user_id)"
        />

        <IntegratedDateRangePicker />

        <Button
          onClick={fetchLogs}
          disabled={loading}
          type="button"
          className="h-10 px-4 rounded-lg shrink-0 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Interface Feedback Panels */}
      {loading && (
        <div className="text-sm text-slate-400 pl-1 flex items-center gap-2 animate-pulse">
          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
          Searching system logs...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Structured Output Grid Layout Document View */}
      {data && (
        <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden max-w-[85vw]">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Indexed Search Hits</span>
            <span className="text-xs font-mono bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded">
              Hits: {data?.hits?.total?.value ?? 0}
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100">
            <pre className="text-xs font-mono overflow-auto max-h-[500px] scrollbar-thin wrap-break-word">
              {JSON.stringify(data.hits?.hits || data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// Global Export Container Wrapper
export default function GlobalLogExploreWrapper() {
  return (
    <KibanaFormProvider>
      <LogExploreWorkspace />
    </KibanaFormProvider>
  );
}
"use client";

import { Search, X, BarChart3, ArrowUpDown } from "lucide-react";
import { LogActionGroup } from "./action/LogActionGroup";

interface LogHeaderControlsProps {
  filteredDocumentsCount: number;
  documentsCount: number;
  totalHits: number;
  localQuery: string;
  setLocalQuery: (val: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  showHistogramViewer: boolean;
  setShowHistogramViewer: (show: boolean) => void;
  selectedFields: string[];
  checkedRecords: any[];
  allVisibleRecords: any[];
  onExportExcel: (records: any[]) => void;
}

export function LogHeaderControls({
  filteredDocumentsCount,
  documentsCount,
  totalHits,
  localQuery,
  setLocalQuery,
  sortOrder,
  setSortOrder,
  showHistogramViewer,
  setShowHistogramViewer,
  selectedFields,
  checkedRecords,
  allVisibleRecords,
  onExportExcel,
}: LogHeaderControlsProps) {
  const hasSelection = checkedRecords.length > 0;
  const isFallbackMode = !hasSelection;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-1.5 gap-2 shrink-0 select-none">
      {/* Metrics Counter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Indexed Search Hits
        </span>
        <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
          Loaded: {filteredDocumentsCount !== documentsCount ? `${filteredDocumentsCount}/` : ""}{documentsCount} of {totalHits}
        </span>
      </div>

      {/* Filter Search Bar & Actions */}
      <div className="flex w-full sm:flex-1 sm:max-w-3xl items-center gap-2">
        <div className="group relative flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 hover:border-slate-300">
          <div className="pointer-events-none absolute left-3 flex items-center justify-center text-slate-400 transition-colors group-focus-within:text-sky-500">
            <Search className="h-4 w-4" />
          </div>

          <input
            type="text"
            placeholder="Filter loaded logs..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="h-10 w-full bg-transparent pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none font-mono"
          />

          {localQuery && (
            <button
              type="button"
              onClick={() => setLocalQuery("")}
              className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              title="Clear filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          <LogActionGroup
            selectedFields={selectedFields}
            selectedRows={checkedRecords}
            allFilteredRows={allVisibleRecords}
            isFallbackMode={isFallbackMode}
          />
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Instant Sort Direction Toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold font-mono tracking-tight shadow-xs transition-all cursor-pointer active:scale-95"
          title={`Switch to ${sortOrder === "desc" ? "Ascending" : "Descending"}`}
        >
          <ArrowUpDown className="h-3 w-3 text-slate-400" />
          <span>{sortOrder.toUpperCase()}</span>
        </button>

        {/* Instant Histogram Toggle */}
        <button
          type="button"
          onClick={() => setShowHistogramViewer(!showHistogramViewer)}
          className={`flex items-center gap-1.5 h-7 px-3 rounded text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
            showHistogramViewer
              ? "bg-[#e6f9f8] border-[#00bfb3]/30 text-[#009b91] shadow-xs"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          {showHistogramViewer ? "Hide Histogram" : "View Histogram"}
        </button>
      </div>
    </div>
  );
}
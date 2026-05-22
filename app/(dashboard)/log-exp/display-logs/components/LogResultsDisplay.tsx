"use client";

import React from "react";
import { ChevronRight, ChevronDown, BarChart3, X, Loader2, Search } from "lucide-react";
import { getFieldValue } from "../utils/kibana-helpers";
import { LogDocumentInspector } from "./LogDocumentInspector";
import { LogHistogramChart } from "./LogHistogramChart";
import QuickFilterCreator from "../../query-builder/components/applied-filters/QuickFilterCreator";
import { EXTERNAL_LINKS, hasExternalLink } from "../utils/external-links";
import { useLogResults } from "../hook/use-log-result";

export function LogResultsDisplay() {
  const {
    searchResults,
    documents,
    filteredDocuments,
    isPaginationLoading,
    hasMore,
    selectedFields,
    histogramData,
    sortOrder,
    setSortOrder,
    expandedRows,
    toggleRow,
    showHistogramViewer,
    setShowHistogramViewer,
    localQuery,
    setLocalQuery,
    handleRemoveColumn,
    observerTargetRef,
    totalHits,
    standardColumnWidth
  } = useLogResults();

  if (!searchResults) return null;

  return (
    <div className="w-full h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col font-sans">

      {/* Top Controls Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-1 gap-2 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Indexed Search Hits
          </span>
          <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
            Loaded: {filteredDocuments.length !== documents.length ? `${filteredDocuments.length}/` : ""}{documents.length} of {totalHits}
          </span>
        </div>

        {/* Sub-Search Filtering Input Engine */}
        <div className="flex flex-1 max-w-md mx-1 relative items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder='Filter loaded rows... (e.g. "error AND auth" or status=500)'
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-7 py-1 bg-white border border-slate-200 rounded focus:outline-hidden focus:border-slate-400 focus:ring-1 focus:ring-slate-400 font-mono transition-all"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery("")}
              className="absolute right-2 text-slate-400 hover:text-slate-600 rounded p-0.5 cursor-pointer"
              title="Clear text filter"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="inline-flex rounded-md bg-white p-0.5 border border-slate-200 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSortOrder("desc")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                sortOrder === "desc"
                  ? "bg-slate-100 text-slate-990 border border-slate-200/60 shadow-xs"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Sort timestamp descending"
            >
              DESC
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("asc")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                sortOrder === "asc"
                  ? "bg-slate-100 text-slate-900 border border-slate-200/60 shadow-xs"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Sort timestamp ascending"
            >
              ASC
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHistogramViewer(!showHistogramViewer)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium border transition-all cursor-pointer ${showHistogramViewer
              ? "bg-[#e6f9f8] border-[#00bfb3]/30 text-[#009b91] shadow-xs"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
              }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {showHistogramViewer ? "Hide Histogram" : "View Histogram"}
          </button>
        </div>
      </div>

      {/* Smooth Expanding Animation wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden border-b border-slate-200 bg-slate-50/50 shrink-0 ${showHistogramViewer
          ? "max-h-[50dvh] opacity-100 p-1 invisible-scrollbar"
          : "max-h-0 opacity-0 p-0 pointer-events-none border-b-transparent"
          }`}
      >
        <LogHistogramChart data={histogramData} isVisible={showHistogramViewer} />
      </div>

      {/* Grid Container Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-slate-100 text-xs font-semibold text-slate-600 sticky top-0 shadow-[inset_0_-1px_0_rgba(226,232,240,1)] z-10 select-none">
              <tr>
                <th className="w-10 bg-slate-100 px-2 py-2"></th>
                {selectedFields.map((field) => (
                  <th
                    key={field}
                    style={{ width: field === "@timestamp" ? "180px" : standardColumnWidth }}
                    className="px-4 py-2 font-mono text-xs bg-slate-100"
                  >
                    <div className="flex items-center max-w-full gap-1.5">
                      <span className="truncate" title={field}>
                        {field}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(field)}
                        title={`Remove ${field} column`}
                        className="p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs font-mono text-slate-700">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={selectedFields.length + 1} className="px-4 py-8 text-center text-slate-400 bg-white italic">
                    No log items match the active query rules.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((hit: any, idx: number) => {
                  const uniqueRowKey = `${hit._index || "idx"}_${hit._id || "id"}_${idx}`;
                  const rowId = hit._id || String(idx);
                  const isExpanded = !!expandedRows[rowId];

                  return (
                    <React.Fragment key={uniqueRowKey}>
                      <tr className="hover:bg-slate-50/70 transition-colors align-top group border-b border-transparent">
                        <td className="px-2 py-2 text-center select-none">
                          <button
                            type="button"
                            onClick={() => toggleRow(rowId)}
                            className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                        </td>

                        {selectedFields.map((field) => {
                          const cellVal = getFieldValue(hit, field);
                          const isTime = field === "@timestamp";
                          const isLinkable = hasExternalLink(field);

                          return (
                            <td
                              key={field}
                              className={`px-4 py-2 text-xs overflow-hidden relative group/cell whitespace-pre-wrap break-all ${
                                isTime
                                  ? 'w-45 text-slate-500 font-mono'
                                  : 'text-slate-800 pr-16'
                              }`}
                            >
                              {isTime && cellVal !== "-" ? (
                                new Date(cellVal).toUTCString().replace(/(\d{4}\s)/, "$1\n")
                              ) : (
                                <>
                                  <div className="w-full block" title={String(cellVal)}>
                                    {isLinkable && cellVal !== "-" ? (
                                      <a
                                        href={EXTERNAL_LINKS[field](String(cellVal))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-sky-600 font-mono font-medium hover:text-sky-800 hover:underline truncate vertical-middle max-w-full"
                                      >
                                        <span className="truncate">{cellVal}</span>
                                      </a>
                                    ) : (
                                      cellVal
                                    )}
                                  </div>

                                  {cellVal !== "-" && (
                                    <QuickFilterCreator
                                      fieldKey={field}
                                      value={cellVal}
                                      className="absolute right-2 top-1.5 opacity-0 group-hover/cell:opacity-100 transition-opacity"
                                    />
                                  )}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {isExpanded && (
                        <LogDocumentInspector
                          hit={hit}
                          colSpan={selectedFields.length + 1}
                        />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>

          {hasMore && (
            <div
              ref={observerTargetRef}
              className="w-full h-12 flex items-center justify-center bg-slate-50 border-t border-slate-200"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 font-sans">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                Streaming next index segment blocks...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
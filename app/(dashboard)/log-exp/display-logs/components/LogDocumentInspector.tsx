"use client";

import React, { useState } from "react";
import { Table, Code } from "lucide-react";
import { flattenObject } from "../utils/kibana-helpers";
import QuickFilterCreator from "../../query-builder/components/applied-filters/QuickFilterCreator";

interface LogDocumentInspectorProps {
  hit: any;
  colSpan: number;
}

export function LogDocumentInspector({ hit, colSpan }: LogDocumentInspectorProps) {
  const [viewMode, setViewMode] = useState<"table" | "json">("table");

  const flattenedData = {
    "_index": hit._index,
    "_id": hit._id,
    "_score": hit._score ?? "-",
    ...flattenObject(hit._source || {})
  };

  return (
    <tr className="bg-slate-100 shadow-inner">
      <td colSpan={colSpan} className="p-4 border-t border-b border-slate-200">
        <div className="w-full rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col font-sans">

          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 select-none">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-200 border border-transparent"
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "json"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-200 border border-transparent"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                JSON Viewer
              </button>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-medium">
              Document ID: {hit._id}
            </span>
          </div>

          {/* Conditional View Panel Container */}
          <div className="p-0 bg-white max-h-80 overflow-y-auto scrollbar-thin">
            {viewMode === "table" ? (
              <table className="w-full text-left border-collapse table-fixed font-mono text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 font-sans">
                    <th className="w-1/4 px-4 py-2 border-r border-slate-100">Field Column</th>
                    <th className="w-3/4 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {Object.entries(flattenedData).map(([fieldKey, val]) => (
                    <tr key={fieldKey} className="hover:bg-slate-50/40 transition-colors align-top group/row">

                      {/* First Column: Field Key + Actions Container wrapper */}
                      <td className="px-4 py-2 border-r border-slate-100 font-medium text-slate-600 select-all break-all whitespace-pre-wrap relative pr-16">
                        <span className="block pr-2">{fieldKey}</span>

                        {/* The component renders nicely right inside the cell boundaries on row hover */}
                        <QuickFilterCreator
                          fieldKey={fieldKey}
                          value={val}
                          className="absolute right-2 top-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs pl-1 rounded-sm"
                        />
                      </td>

                      {/* Second Column: Value Field */}
                      <td className="px-4 py-2 text-slate-900 overflow-hidden">
                        <div className="w-full truncate block select-all" title={String(val)}>
                          {String(val)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-b-md overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all leading-relaxed">
                  {JSON.stringify(hit, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      </td>
    </tr>
  );
}
"use client";

import React from "react";
import { X } from "lucide-react";
import { COLUMN_LABELS } from "./LogResultsDisplay";

interface LogTableHeaderProps {
  selectedFields: string[];
  standardColumnWidth: string;
  handleRemoveColumn: (field: string) => void;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export function LogTableHeader({
  selectedFields,
  standardColumnWidth,
  handleRemoveColumn,
  isAllSelected,
  onToggleSelectAll,
}: LogTableHeaderProps) {
  return (
    <thead className="bg-slate-100 text-xs font-semibold text-slate-600 sticky top-0 shadow-[inset_0_-1px_0_rgba(226,232,240,1)] z-10 select-none">
      <tr>
        <th className="w-8 px-2 py-2 text-center bg-slate-100">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5 cursor-pointer accent-sky-600"
          />
        </th>
        <th className="w-8 bg-slate-100 px-1 py-2"></th>
        {selectedFields.map((field) => {
          const displayedLabel = COLUMN_LABELS[field] || field;

          return (
            <th
              key={field}
              style={{ width: field === "@timestamp" ? "180px" : standardColumnWidth }}
              className="px-4 py-2 font-mono text-xs bg-slate-100"
            >
              <div className="flex items-center max-w-full gap-1.5">
                <span className="truncate" title={field}>
                  {displayedLabel}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(field)}
                  title={`Remove ${displayedLabel} column`}
                  className="p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
"use client";

import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { getFieldValue } from "@/features/log-exp/display-logs/utils/kibana-helpers";
import { EXTERNAL_LINKS, hasExternalLink } from "@/features/log-exp/display-logs/utils/external-links";
import QuickFilterCreator from "@/features/log-exp/query-builder/components/applied-filters/QuickFilterCreator";
import { LogDocumentInspector } from "@/features/log-exp/display-logs/components/LogDocumentInspector";

interface LogTableRowProps {
  hit: any;
  idx: number;
  selectedFields: string[];
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function LogTableRow({
  hit,
  idx,
  selectedFields,
  isExpanded,
  toggleRow,
  isSelected,
  onToggleSelect,
}: LogTableRowProps) {
  const uniqueRowKey = `${hit._index || "idx"}_${hit._id || "id"}_${idx}`;
  const rowId = hit._id || String(idx);

  return (
    <React.Fragment key={uniqueRowKey}>
      <tr
        className={`transition-colors align-top group border-b border-transparent ${
          isSelected ? "bg-sky-50/40 hover:bg-sky-50/60" : "hover:bg-slate-50/70"
        }`}
      >
        {/* Row Selection Checkbox */}
        <td className="px-2 py-2 text-center select-none">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(rowId)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5 cursor-pointer accent-sky-600"
          />
        </td>

        <td className="px-1 py-2 text-center select-none">
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
                isTime ? "w-45 text-slate-500 font-mono" : "text-slate-800 pr-16"
              }`}
            >
              {isTime && cellVal !== "-" ? (
                new Date(cellVal).toUTCString().replace(/(\d{4}\s)/, "$1\n")
              ) : (
                <>
                  <div className="w-full block">
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
          colSpan={selectedFields.length + 2} // Account for checkbox column offset
        />
      )}
    </React.Fragment>
  );
}
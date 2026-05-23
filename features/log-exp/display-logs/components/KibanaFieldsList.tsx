// components/KibanaFieldsList.tsx
"use client";

import React, { useMemo } from "react";
import { Plus, Minus, LucideIcon, Flame } from "lucide-react";
import { KibanaFieldStatPopover } from "./KibanaFieldStatPopover";

type Props = {
  title: string;
  fields: string[];
  count: number;
  emptyText: string;

  actionIcon?: LucideIcon;
  actionTitle?: string;

  onAction?: () => void;
  actionVariant?: "primary" | "secondary";

  type: "selected" | "available" | "popular";
  profileDefaults?: string[];

  onToggle: (field: string) => void;

  /**
   * ALL LOGS FROM THE HIT TABLE
   */
  documents?: Record<string, any>[];
};

type FieldStat = {
  value: string;
  count: number;
  percentage: number;
};

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path
    .split(".")
    .reduce(
      (acc, key) =>
        acc && acc[key] !== undefined ? acc[key] : undefined,
      obj
    );
};

const calculateFieldDistribution = (
  documents: Record<string, any>[],
  field: string
): FieldStat[] => {
  if (!documents || documents.length === 0) return [];

  const counts = new Map<string, number>();
  let totalValidDocs = 0;

  const stringifyValue = (val: any): string => {
    return typeof val === "object" ? JSON.stringify(val) : String(val);
  };

  const len = documents.length;
  for (let i = 0; i < len; i++) {
    const doc = documents[i];
    const targetObj = doc._source ? doc._source : doc;
    const value = getNestedValue(targetObj, field);

    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      const arrLen = value.length;
      if (arrLen === 0) continue;
      for (let j = 0; j < arrLen; j++) {
        const normalized = stringifyValue(value[j]);
        counts.set(normalized, (counts.get(normalized) || 0) + 1);
      }
    } else {
      const normalized = stringifyValue(value);
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }

    totalValidDocs++;
  }

  if (totalValidDocs === 0) return [];

  const sortedEntries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  const TOP_LIMIT = 10;
  const topEntries = sortedEntries.slice(0, TOP_LIMIT);
  const otherEntries = sortedEntries.slice(TOP_LIMIT);

  const stats: FieldStat[] = topEntries.map(([value, count]) => ({
    value,
    count,
    percentage: (count / totalValidDocs) * 100,
  }));

  if (otherEntries.length > 0) {
    const otherCount = otherEntries.reduce((sum, entry) => sum + entry[1], 0);
    stats.push({
      value: "Other",
      count: otherCount,
      percentage: (otherCount / totalValidDocs) * 100,
    });
  }

  return stats;
};

export function KibanaFieldsList({
  title,
  fields,
  count,
  emptyText,
  actionIcon,
  actionTitle,
  onAction,
  actionVariant = "secondary",
  type,
  profileDefaults = [],
  onToggle,
  documents = [],
}: Props) {

  const fieldsStatsMap = useMemo(() => {
    const cache: Record<string, FieldStat[]> = {};
    fields.forEach((field) => {
      cache[field] = calculateFieldDistribution(documents, field);
    });
    return cache;
  }, [documents, fields]);

  // Helper helper function to resolve dynamic style hooks across the layout types
  const getBadgeStyles = () => {
    switch (type) {
      case "selected":
        return "bg-sky-100 text-sky-800";
      case "popular":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-200 text-slate-600";
    }
  };

  return (
    <div>
      {/* List Header */}
      <div className="flex items-center justify-between px-2 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>

          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getBadgeStyles()}`}>
            {count}
          </span>
        </div>

        {actionIcon && onAction && (
          <button
            type="button"
            onClick={onAction}
            title={actionTitle}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              actionVariant === "primary"
                ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {React.createElement(actionIcon, {
              className: "h-3.5 w-3.5",
            })}
          </button>
        )}
      </div>

      {/* Empty State Fallback */}
      {fields.length === 0 ? (
        <div className="px-2 py-1 text-xs italic text-slate-400">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-0.5">
          {fields.map((field) => {
            const isProfileDefault = profileDefaults.includes(field);
            const stats = fieldsStatsMap[field] || [];

            return (
              <div
                key={field}
                className={`group flex w-full items-center justify-between rounded px-2 py-1 text-left transition-colors hover:bg-slate-200/50 ${
                  type === "selected"
                    ? "text-sm font-medium text-slate-800"
                    : "text-sm text-slate-600"
                }`}
              >
                {/* Field Details & Trigger Area */}
                <div className="min-w-0 flex flex-1 items-center gap-1.5 overflow-hidden">

                  {/* Field Distribution Popover UI */}
                  <KibanaFieldStatPopover
                    field={field}
                    type={type === "popular" ? "available" : type} // Keeps internal popover behavior compatible
                    stats={stats}
                    totalSampleDocuments={documents.length}
                  />

                  {/* Active Profile Pin */}
                  {type === "selected" && isProfileDefault && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                      title="Default field"
                    />
                  )}

                  {/* Recommended Default System Badge */}
                  {type === "available" && isProfileDefault && (
                    <span
                      className="origin-left shrink-0 scale-90 whitespace-nowrap rounded bg-slate-200 px-1 text-[9px] text-slate-500 opacity-60 transition-opacity group-hover:opacity-100"
                      title="Recommended default field"
                    >
                      Recommended
                    </span>
                  )}
                </div>

                {/* Column Selection Actions */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(field);
                  }}
                  className={`shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-300 ${
                    type === "selected" ? "hover:text-red-500" : "hover:text-sky-600"
                  }`}
                  title={type === "selected" ? "Remove field" : "Add field"}
                >
                  {type === "selected" ? (
                    <Minus className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
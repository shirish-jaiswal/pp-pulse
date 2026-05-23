"use client";

import React, { useState, useMemo, useRef } from "react";
import { ChevronRight, Search, Copy, Check, Pin, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import QuickFilterCreator from "../../query-builder/components/applied-filters/QuickFilterCreator";
import { EXTERNAL_LINKS, hasExternalLink } from "../utils/external-links"; // Verify this path matches your project directory

type FieldStat = {
  value: string;
  count: number;
  percentage: number;
};

type KibanaFieldStatPopoverProps = {
  field: string;
  type: "selected" | "available";
  stats: FieldStat[];
  totalSampleDocuments: number;
};

export function KibanaFieldStatPopover({
  field,
  type,
  stats,
  totalSampleDocuments,
}: KibanaFieldStatPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [popoverSearch, setPopoverSearch] = useState("");
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const HOVER_DELAY_MS = 300;

  // Evaluates matching field-level mappings dynamically against the config file
  const isLinkable = hasExternalLink(field);

  const filteredStats = useMemo(() => {
    if (!popoverSearch) return stats;
    return stats.filter((item) =>
      item.value.toLowerCase().includes(popoverSearch.toLowerCase())
    );
  }, [stats, popoverSearch]);

  const handleCopy = (e: React.MouseEvent, val: string, percentage: number) => {
    e.stopPropagation();
    const formattedText = `${val} ${percentage.toFixed(1)}%`;
    navigator.clipboard.writeText(formattedText);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 1500);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    if (isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const handleMouseEnter = () => {
    if (isPinned) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!isPinned) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsPinned(false);
      setPopoverSearch("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleButtonClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`group/field flex min-w-0 flex-1 items-center justify-between rounded px-1.5 py-1 text-left transition-colors ${
            isPinned
              ? "bg-sky-100/80 hover:bg-sky-100"
              : "hover:bg-slate-200/60"
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {isPinned && <Pin className="h-3 w-3 text-sky-600 shrink-0 rotate-45 animate-in fade-in zoom-in-75 duration-150" />}
            <span
              className={`truncate font-mono text-xs transition-colors ${
                isPinned
                  ? "text-sky-900 font-bold"
                  : type === "selected"
                  ? "text-sky-700 font-semibold group-hover/field:text-sky-900"
                  : "text-slate-600 group-hover/field:text-slate-900"
              }`}
            >
              {field}
            </span>
          </div>
          <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-all ${
            isPinned ? "opacity-100 rotate-90 text-sky-600" : "opacity-0 group-hover/field:translate-x-0.5 group-hover/field:opacity-100"
          }`} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="right"
        sideOffset={8}
        onMouseLeave={handleMouseLeave}
        className={`max-w-[30dvh] rounded-xl border p-0 shadow-2xl bg-white z-50 pointer-events-auto transition-all gap-0 ${
          isPinned ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200"
        }`}
      >
        <div className={`border-b px-2 py-2 rounded-t-xl transition-colors ${
          isPinned ? "border-sky-100 bg-sky-50/40" : "border-slate-100 bg-slate-50/70"
        }`}>
          <div className="min-w-0">
            <div className={`truncate font-mono text-xs font-bold bg-slate-200/50 px-1.5 py-0.5 rounded border inline-block max-w-full transition-colors ${
              isPinned ? "border-sky-200 bg-sky-100/50 text-sky-900" : "border-slate-200/60 text-slate-800"
            }`}>
              {field}
            </div>
          </div>

          {stats.length > 5 && (
            <div className="relative mt-1">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter values..."
                value={popoverSearch}
                onChange={(e) => setPopoverSearch(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-1 pl-7 pr-3 text-xs placeholder-slate-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredStats.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              {popoverSearch ? "No values matching search criteria" : "No values available in data scope"}
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredStats.map((item) => (
                <div
                  key={`${field}-${item.value}`}
                  className="group/row relative rounded-lg border border-slate-100 bg-white p-2 transition-all hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-sm"
                >
                  {/* Metric Info Bar */}
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">

                      {/* Generates standard decoupled relative dynamic links without hardcoded domains */}
                      {isLinkable && item.value !== "Other" ? (
                        <a
                          href={EXTERNAL_LINKS[field](item.value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sky-600 font-mono text-[11px] font-medium hover:text-sky-800 hover:underline truncate"
                          title={`Navigate to details for ${item.value}`}
                        >
                          {item.value}
                          <ExternalLink className="h-2.5 w-2.5 shrink-0 text-sky-500" />
                        </a>
                      ) : (
                        <span
                          className={`truncate font-mono text-[11px] select-all ${
                            item.value === "Other"
                              ? "text-slate-400 italic font-sans"
                              : "text-slate-700 font-medium"
                          }`}
                          title={item.value}
                        >
                          {item.value}
                        </span>
                      )}

                      {/* Cleaned Hover Action Group Wrapper */}
                      {item.value !== "Other" && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-all shrink-0 ml-1">

                          {/* Dedicated premium layout button dock injection */}
                          <QuickFilterCreator
                            fieldKey={field}
                            value={item.value}
                          />

                          {/* Existing Copy Button */}
                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, item.value, item.percentage)}
                            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-slate-600 transition-all shadow-xs active:scale-95"
                            title="Copy formatted string"
                          >
                            {copiedValue === item.value ? (
                              <Check className="h-2.5 w-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-2.5 w-2.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 font-mono shrink-0">
                      {item.count}
                    </span>
                  </div>

                  {/* Distribution Rendering */}
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          item.value === "Other"
                            ? "bg-slate-400"
                            : "bg-gradient-to-r from-sky-400 to-sky-500"
                        }`}
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-10 text-right font-mono text-[10px] font-bold text-slate-500">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}

              <div className="mt-2.5 border-t border-slate-100 pt-2 text-center text-[10px] font-medium text-slate-400/80 tracking-wide uppercase select-none">
                Analyzed across all {totalSampleDocuments} records
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { COLUMN_LABELS } from "../LogResultsDisplay";
import { getFieldValue } from "../../utils/kibana-helpers";

interface LogCopyButtonProps {
  selectedFields: string[];
  recordsToCopy: any[];
  isFallbackMode: boolean;
  onCopyComplete?: () => void;
}

export function LogCopyButton({
  selectedFields,
  recordsToCopy,
  isFallbackMode,
  onCopyComplete,
}: LogCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (recordsToCopy.length === 0) return;

    const plainTextString = recordsToCopy
      .map((hit: any) =>
        selectedFields
          .map((field) => `${COLUMN_LABELS[field] || field}: ${getFieldValue(hit, field)}`)
          .join(" | ")
      )
      .join("\n");

    let tableHtml = `<table style="border-collapse: collapse; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px;">`;

    tableHtml += "<thead><tr>";
    selectedFields.forEach((field) => {
      const label = COLUMN_LABELS[field] || field;
      tableHtml += `<th style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #475569; padding: 12px 16px; text-align: left; font-weight: 600; white-space: nowrap; font-size: 12px; tracking-wide;">${label}</th>`;
    });
    tableHtml += "</tr></thead>";

    tableHtml += "<tbody>";
    recordsToCopy.forEach((hit: any) => {
      tableHtml += `<tr style="border-bottom: 1px solid #f1f5f9;">`;
      selectedFields.forEach((field) => {
        const value = String(getFieldValue(hit, field) ?? "-");
        const isTime = field === "@timestamp";

        let formattedValue = value;
        if (isTime && value !== "-") {
          formattedValue = new Date(value).toUTCString();
        }

        const isNumeric = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(formattedValue);
        const alignmentStyle = isNumeric ? "text-align: right;" : "text-align: left;";

        tableHtml += `<td style="padding: 12px 16px; vertical-align: top; color: #1e293b; line-height: 1.6; white-space: pre-wrap; max-width: 500px; word-break: break-word; font-size: 13px; ${alignmentStyle}">${formattedValue}</td>`;
      });
      tableHtml += "</tr>";
    });
    tableHtml += "</tbody></table>";

    const structuralDocumentHtml = `<html><head><meta charset="utf-8" /></head><body>${tableHtml.trim()}</body></html>`.trim();

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([structuralDocumentHtml], { type: "text/html" }),
          "text/plain": new Blob([plainTextString.trim()], { type: "text/plain" }),
        }),
      ]);

      setCopied(true);
      if (onCopyComplete) onCopyComplete();
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error("Rich table clipboard injection failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`
        relative group flex items-center gap-2.5 px-4 h-9 rounded-lg
        text-xs font-medium select-none transition-all duration-200
        cursor-pointer outline-none active:scale-[0.98] border
        ${
          copied
            ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50"
            : isFallbackMode
            ? "bg-slate-50/40 border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 shadow-2xs"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs"
        }
      `}
      title={isFallbackMode ? "Copy all visible rows matching filters to clipboard" : "Copy selected rows to clipboard"}
    >
      {copied ? (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Copied</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <Copy className={`h-3.5 w-3.5 transition-colors duration-150 ${isFallbackMode ? "text-slate-400 group-hover:text-slate-500" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span>{"Copy" }</span>
          </div>
        </>
      )}
    </button>
  );
}
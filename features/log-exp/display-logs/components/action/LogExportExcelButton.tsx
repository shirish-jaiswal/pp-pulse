"use client";

import { useState } from "react";
import { Check, FileSpreadsheet } from "lucide-react";
import { COLUMN_LABELS } from "../LogResultsDisplay";
import { getFieldValue } from "../../utils/kibana-helpers";

interface LogExportExcelButtonProps {
  selectedFields: string[];
  recordsToExport: any[];
  isFallbackMode: boolean;
  onExportComplete?: () => void;
}

export function LogExportExcelButton({
  selectedFields,
  recordsToExport,
  isFallbackMode,
  onExportComplete,
}: LogExportExcelButtonProps) {
  const [exported, setExported] = useState(false);

  const handleExportExcel = () => {
    if (recordsToExport.length === 0) return;

    let excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    excelHtml += `<head><meta charset="utf-8" /><style>`;
    excelHtml += `
      th { background-color: #f8fafc; color: #475569; font-weight: bold; border: 0.5pt solid #e2e8f0; padding: 6px; text-align: left; }
      td {
        border: 0.5pt solid #f1f5f9;
        padding: 6px;
        vertical-align: middle;
        white-space: normal;
        mso-number-format:"\\@";
      }
      .num { text-align: right; mso-number-format:"General"; }
    `;
    excelHtml += `</style></head><body><table><thead><tr>`;

    selectedFields.forEach((field) => {
      const label = COLUMN_LABELS[field] || field;
      excelHtml += `<th>${label}</th>`;
    });
    excelHtml += "</tr></thead><tbody>";

    recordsToExport.forEach((hit: any) => {
      excelHtml += "<tr>";
      selectedFields.forEach((field) => {
        const value = String(getFieldValue(hit, field) ?? "-");
        const isTime = field === "@timestamp";

        let formattedValue = value;
        if (isTime && value !== "-") {
          formattedValue = new Date(value).toUTCString();
        }

        const isNumeric = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(formattedValue);
        const cellClass = isNumeric ? 'class="num"' : "";

        // Strip carriage returns and raw block breaks before escaping tags to prevent massive vertical row layouts
        const safeValue = formattedValue
          .replace(/\r?\n|\r/g, " ")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        excelHtml += `<td ${cellClass}>${safeValue}</td>`;
      });
      excelHtml += "</tr>";
    });
    excelHtml += "</tbody></table></body></html>";

    try {
      const blob = new Blob([excelHtml.trim()], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // Generate identical YYYYMMDD-HHMMSS string payload
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const fileName = `pp-pulse-log-export-${timestamp}.xls`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(true);
      if (onExportComplete) onExportComplete();
      setTimeout(() => setExported(false), 2400);
    } catch (err) {
      console.error("Generating native Excel data worksheet payload failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportExcel}
      className={`
        relative group flex items-center gap-2.5 px-4 h-9 rounded-lg
        text-xs font-medium select-none transition-all duration-200
        cursor-pointer outline-none active:scale-[0.98] border
        ${
          exported
            ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50"
            : isFallbackMode
            ? "bg-slate-50/40 border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 shadow-2xs"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs"
        }
      `}
      title={isFallbackMode ? "Download all visible filtered rows as an Excel sheet" : "Download selected rows as an Excel sheet"}
    >
      {exported ? (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Saved!</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className={`h-3.5 w-3.5 transition-colors duration-150 ${isFallbackMode ? "text-slate-400 group-hover:text-slate-500" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span>{"Excel"}</span>
          </div>
        </>
      )}
    </button>
  );
}
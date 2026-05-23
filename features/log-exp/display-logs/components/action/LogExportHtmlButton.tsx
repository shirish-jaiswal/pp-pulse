"use client";

import React, { useState } from "react";
import { Aperture, Check } from "lucide-react";
import { COLUMN_LABELS } from "../LogResultsDisplay";
import { getFieldValue } from "../../utils/kibana-helpers";

interface LogExportHtmlButtonProps {
    selectedFields: string[];
    recordsToExport: any[];
    isFallbackMode: boolean;
    onExportComplete?: () => void;
}

export function LogExportHtmlButton({
    selectedFields,
    recordsToExport,
    isFallbackMode,
    onExportComplete,
}: LogExportHtmlButtonProps) {
    const [exported, setExported] = useState(false);

    const handleExportHtmlFile = () => {
        if (recordsToExport.length === 0) return;

        const timestampStr = new Date().toUTCString();

        // Build a fully self-contained HTML document with clean, enterprise-grade styles
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Export - PP Pulse</title>
    <style>
        :root {
            --bg-main: #fafbfe;
            --bg-card: #ffffff;
            --border-color: #e2e8f0;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --accent: #4f46e5;
            --accent-light: #f5f3ff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-main);
            color: var(--text-main);
            padding: 2rem 1.5rem;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        header {
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
        }
        .title-area h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; letter-spacing: -0.025em; }
        .title-area p { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }
        .meta-badge {
            background-color: var(--accent-light);
            color: var(--accent);
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .table-container {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
            overflow-x: auto;
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left; }
        th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
            padding: 0.875rem 1rem;
            border-bottom: 2px solid var(--border-color);
            white-space: nowrap;
        }
        tr { border-bottom: 1px solid #f1f5f9; }
        tr:last-child { border-bottom: none; }
        tr:hover { background-color: #f8fafc; }
        td {
            padding: 1rem;
            vertical-align: top;
            color: #334155;
            line-height: 1.6;
            word-break: break-word;
            white-space: pre-wrap;
            max-width: 500px;
        }
        .mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.75rem;
        }
        .num-val { text-align: right; }
        footer { margin-top: 2rem; text-align: center; font-size: 0.75rem; color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-area">
                <h1>PP Pulse Log Export</h1>
                <p>Generated on ${timestampStr}</p>
            </div>
            <div class="meta-badge">${recordsToExport.length} Records</div>
        </header>
        <div class="table-container">
            <table>
                <thead>
                    <tr>`;

        // 1. Generate Table Headers
        selectedFields.forEach((field) => {
            const label = COLUMN_LABELS[field] || field;
            htmlContent += `<th>${label}</th>`;
        });
        htmlContent += `</tr>
                </thead>
                <tbody>`;

        // 2. Generate Data Rows
        recordsToExport.forEach((hit: any) => {
            htmlContent += `<tr>`;
            selectedFields.forEach((field) => {
                const value = String(getFieldValue(hit, field) ?? "-");
                const isTime = field === "@timestamp";

                let formattedValue = value;
                if (isTime && value !== "-") {
                    formattedValue = new Date(value).toUTCString();
                }

                const isNumeric = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(formattedValue);

                let cellClasses = [];
                if (isTime || field === "id" || field === "status") cellClasses.push("mono");
                if (isNumeric) cellClasses.push("num-val");

                const classAttr = cellClasses.length > 0 ? `class="${cellClasses.join(" ")}"` : "";

                // Escape content safety boundaries
                const safeValue = formattedValue
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");

                htmlContent += `<td ${classAttr}>${safeValue}</td>`;
            });
            htmlContent += `</tr>`;
        });

        htmlContent += `</tbody>
            </table>
        </div>
        <footer>
            <p>End of log stream output • Powered by PP Pulse Tools</p>
        </footer>
    </div>
</body>
</html>`;

        try {
            const blob = new Blob([htmlContent.trim()], { type: "text/html;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            // Generate precise YYYYMMDD-HHMMSS timestamp matching the Excel format
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

            const fileName = `pp-pulse-log-export-${timestamp}.html`;

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
            console.error("Generating HTML data log report file failed:", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleExportHtmlFile}
            className={`
        relative group flex items-center gap-2.5 px-4 h-9 rounded-lg
        text-xs font-medium select-none transition-all duration-200
        cursor-pointer outline-none active:scale-[0.98] border
        ${exported
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100/50"
                    : isFallbackMode
                        ? "bg-slate-50/40 border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs"
                }
      `}
            title={isFallbackMode ? "Download all visible filtered rows as an HTML document" : "Download selected rows as an HTML document"}
        >
            {exported ? (
                <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Saved!</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-1.5">
                        <Aperture className={`h-3.5 w-3.5 transition-colors duration-150 ${isFallbackMode ? "text-slate-400 group-hover:text-slate-500" : "text-slate-400 group-hover:text-slate-600"}`} />
                        <span>{"HTML"}</span>
                    </div>
                </>
            )}
        </button>
    );
}
"use client";

import { LogCopyButton } from "./LogCopyButton";
import { LogExportHtmlButton } from "./LogExportHtmlButton";
import { LogExportExcelButton } from "./LogExportExcelButton";

interface LogActionGroupProps {
  selectedFields: string[];
  selectedRows: any[];
  allFilteredRows: any[];
  isFallbackMode: boolean;
  onActionComplete?: (type: "copy" | "export" | "export-html") => void;
}

export function LogActionGroup({
  selectedFields,
  selectedRows,
  allFilteredRows,
  isFallbackMode,
  onActionComplete,
}: LogActionGroupProps) {
  // If no explicit checkboxes are clicked, fallback to handling the entire active subset
  const recordsTarget = isFallbackMode ? allFilteredRows : selectedRows;

  // Disable all triggers safely if there is nothing currently loaded to capture
  const hasNoRecords = recordsTarget.length === 0;

  return (
    <div
      className={`
        flex items-center gap-1 transition-opacity duration-200
        ${hasNoRecords ? "opacity-40 pointer-events-none select-none" : "opacity-100"}
      `}
    >
      {/* Action Trigger 1: Clipboard Injection */}
      <LogCopyButton
        selectedFields={selectedFields}
        recordsToCopy={recordsTarget}
        isFallbackMode={isFallbackMode}
        onCopyComplete={() => onActionComplete?.("copy")}
      />

      {/* Action Trigger 2: System Excel Spreadsheet Compilation */}
      <LogExportExcelButton
        selectedFields={selectedFields}
        recordsToExport={recordsTarget}
        isFallbackMode={isFallbackMode}
        onExportComplete={() => onActionComplete?.("export")}
      />

      {/* Action Trigger 3: Standalone Document HTML Log File Generation */}
      <LogExportHtmlButton
        selectedFields={selectedFields}
        recordsToExport={recordsTarget}
        isFallbackMode={isFallbackMode}
        onExportComplete={() => onActionComplete?.("export-html")}
      />
    </div>
  );
}
"use client";

import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useLogResults } from "../hook/use-log-result";
import { getFieldValue } from "../utils/kibana-helpers";
import { LogHistogramChart } from "./LogHistogramChart";
import { LogHeaderControls } from "./LogHeaderControls";
import { LogTableHeader } from "./LogTableHeader";
import { LogTableRow } from "./LogTableRow";
import LoadMoreLogsLoading from "./action/load-more-logs-loading";

export const COLUMN_LABELS: Record<string, string> = {
  "@timestamp": "TIME",
  "app.serviceMethod": "METHOD",
  "app.url": "ENDPOINT",
  "app.requestLog.log": "REQUEST",
  "app.responseLog.log": "RESPONSE",
};

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
    standardColumnWidth,
  } = useLogResults();

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const visibleRowIds = useMemo(() => {
    return filteredDocuments.map((hit: any, idx: number) => hit._id || String(idx));
  }, [filteredDocuments]);

  const checkedRecords = useMemo(() => {
    return filteredDocuments.filter((hit: any, idx: number) =>
      selectedRowIds.includes(hit._id || String(idx))
    );
  }, [filteredDocuments, selectedRowIds]);

  const isAllSelected = useMemo(() => {
    if (visibleRowIds.length === 0) return false;
    return visibleRowIds.every((id) => selectedRowIds.includes(id));
  }, [visibleRowIds, selectedRowIds]);

  const handleToggleSelect = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds((prev) => prev.filter((id) => !visibleRowIds.includes(id)));
    } else {
      setSelectedRowIds((prev) => {
        const uniqueSet = new Set([...prev, ...visibleRowIds]);
        return Array.from(uniqueSet);
      });
    }
  };

  // =========================================================================
  // UNIFIED EXCEL EXPORT CONTROLLER
  // =========================================================================
  const handleExportToExcel = (targetsForExport: any[]) => {
    if (targetsForExport.length === 0) return;

    let excelTemplateHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    excelTemplateHtml += `<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Log Export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;
    excelTemplateHtml += `<table style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px;">`;

    // Headers
    excelTemplateHtml += "<thead><tr>";
    selectedFields.forEach((field) => {
      const titleLabel = COLUMN_LABELS[field] || field;
      excelTemplateHtml += `<th style="background-color: #f3f4f6; border: 1px solid #94a3b8; color: #334155; font-weight: bold; padding: 8px 12px; text-align: left;">${titleLabel}</th>`;
    });
    excelTemplateHtml += "</tr></thead><tbody>";

    // Row parsing iteration
    targetsForExport.forEach((hit: any) => {
      excelTemplateHtml += "<tr>";
      selectedFields.forEach((field) => {
        const cellValue = String(getFieldValue(hit, field) ?? "-");
        const isTime = field === "@timestamp";

        let displayString = cellValue;
        if (isTime && cellValue !== "-") {
          displayString = new Date(cellValue).toUTCString();
        }

        const isNumericValue = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(displayString);
        const textAlignment = isNumericValue ? "text-align: right;" : "text-align: left;";

        excelTemplateHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px; vertical-align: top; ${textAlignment}">${displayString}</td>`;
      });
      excelTemplateHtml += "</tr>";
    });

    excelTemplateHtml += "</tbody></table></body></html>";

    const documentBlob = new Blob([excelTemplateHtml], { type: "application/vnd.ms-excel" });
    const downloadBlobUrl = URL.createObjectURL(documentBlob);

    const operationalAnchor = document.createElement("a");
    operationalAnchor.href = downloadBlobUrl;
    operationalAnchor.download = `Log_Export_${new Date().toISOString().split("T")[0]}.xls`;

    document.body.appendChild(operationalAnchor);
    operationalAnchor.click();

    document.body.removeChild(operationalAnchor);
    URL.revokeObjectURL(downloadBlobUrl);
  };

  if (!searchResults) return null;

  return (
    <div className="w-full h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col font-sans">
      <LogHeaderControls
        filteredDocumentsCount={filteredDocuments.length}
        documentsCount={documents.length}
        totalHits={totalHits}
        localQuery={localQuery}
        setLocalQuery={setLocalQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showHistogramViewer={showHistogramViewer}
        setShowHistogramViewer={setShowHistogramViewer}
        selectedFields={selectedFields}
        checkedRecords={checkedRecords}
        allVisibleRecords={filteredDocuments}
        onExportExcel={handleExportToExcel}
      />

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden border-b border-slate-200 bg-slate-50/50 shrink-0 ${showHistogramViewer
            ? "max-h-[50dvh] opacity-100 p-1 invisible-scrollbar"
            : "max-h-0 opacity-0 p-0 pointer-events-none border-b-transparent"
          }`}
      >
        <LogHistogramChart data={histogramData} isVisible={showHistogramViewer} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <LogTableHeader
              selectedFields={selectedFields}
              standardColumnWidth={standardColumnWidth}
              handleRemoveColumn={handleRemoveColumn}
              isAllSelected={isAllSelected}
              onToggleSelectAll={handleToggleSelectAll}
            />

            <tbody className="divide-y divide-slate-200 text-xs font-mono text-slate-700">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan={selectedFields.length + 2}
                    className="px-4 py-8 text-center text-slate-400 bg-white italic"
                  >
                    No log items match the active query rules.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((hit: any, idx: number) => {
                  const rowId = hit._id || String(idx);
                  return (
                    <LogTableRow
                      key={`${hit._index || "idx"}_${hit._id || "id"}_${idx}`}
                      hit={hit}
                      idx={idx}
                      selectedFields={selectedFields}
                      isExpanded={!!expandedRows[rowId]}
                      toggleRow={toggleRow}
                      isSelected={selectedRowIds.includes(rowId)}
                      onToggleSelect={handleToggleSelect}
                    />
                  );
                })
              )}
            </tbody>
          </table>

          <>
            {hasMore && <div ref={observerTargetRef} className="h-2 w-full" />}
            {isPaginationLoading && (
              <LoadMoreLogsLoading />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
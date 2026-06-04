"use client";

import { Table } from "@/components/ui/table";

import { calculateTotals, exportTableCSV } from "./utils";

import { DataTableToolbar } from "./data-table-tool";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { DataTableFooter } from "./data-table-footer";
import { DataTablePagination } from "./data-table-pagination";
import { useDataTable } from "@/features/bet-history/hooks/use-player-bet-table";

export function DataTable({ columns, data }: any) {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    compact,
    setCompact,
  } = useDataTable({ data, columns });

  const rows = table.getFilteredRowModel().rows;
  const totals = calculateTotals(rows);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
        <DataTableToolbar
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          compact={compact}
          setCompact={setCompact}
          table={table}
          onExport={() => exportTableCSV(table)}
        />
        <DataTablePagination table={table} />
      </div>

      <div className="border rounded-md max-h-[75dvh] overflow-auto">
        <Table className="border-collapse separate border-spacing-0">
          <DataTableHeader table={table} className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]" />
          <DataTableBody table={table} compact={compact} columns={columns} />
          <DataTableFooter totals={totals} className="sticky bottom-0 z-10 bg-background shadow-[0_-1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.1)]" />
        </Table>
      </div>

    </div>
  );
}
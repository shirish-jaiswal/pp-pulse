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

      <DataTableToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        compact={compact}
        setCompact={setCompact}
        table={table}
        onExport={() => exportTableCSV(table)}
      />
      <DataTablePagination table={table} />

      <div className="border rounded-md max-h-[70vh] overflow-auto">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} compact={compact} columns={columns} />
          <DataTableFooter totals={totals} />
        </Table>
      </div>

    </div>
  );
}
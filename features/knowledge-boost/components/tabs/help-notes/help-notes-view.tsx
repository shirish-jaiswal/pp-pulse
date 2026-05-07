"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";
import { getHelpNotesColumns } from "@/features/knowledge-boost/components/tabs/help-notes/columns";

type Props = {
  data: HelpNotes[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: HelpNotes) => void;
  onDelete: (id: number) => void;
};

export function HelpNotesView({
  data,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getHelpNotesColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">Help Notes</div>

        <Button size="sm" onClick={onCreate}>
          New
        </Button>
      </div>

      {/* Table */}
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
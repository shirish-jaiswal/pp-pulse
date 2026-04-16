"use client";

import { useState } from "react";
import { Table2, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useDataGrid } from "@/features/excel-db/hooks/use-data-grid";
import { GridToolbar } from "@/features/excel-db/components/grid-toolbar";
import { EditRowDialog } from "@/features/excel-db/components/dialogs/edit-row-dialog";
import { GridPagination } from "@/features/excel-db/components/grid-pagination";
import { DeleteConfirmDialog } from "@/features/excel-db/components/shared/delete-confirm-dialog";

const SYSTEM_COLS = ["id", "created_at", "updated_at"];

export function DataGrid({
  dbName,
  tableName,
}: {
  dbName: string;
  tableName: string;
}) {
  const {
    columns,
    loading,
    search,
    setSearch,
    page,
    setPage,
    pagedRows,
    totalPages,
    filteredCount,
    submitting,
    load,
    handleInsert,
    handleUpdate,
    handleDelete,
    handleExport,
  } = useDataGrid(dbName, tableName);

  const [editState, setEditState] = useState<{
    open: boolean;
    row: any;
    isNew: boolean;
  }>({
    open: false,
    row: null,
    isNew: false,
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const userCols = columns.filter((c) => !SYSTEM_COLS.includes(c));

  if (!dbName || !tableName) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Table2 className="h-10 w-10 text-muted-foreground/20 mb-2" />
        <p className="text-xs font-medium text-muted-foreground">
          Select a table to view data
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden">

      {/* TOOLBAR */}
      <GridToolbar
        tableName={tableName}
        rowCount={filteredCount}
        search={search}
        onSearchChange={setSearch}
        onRefresh={load}
        onExport={handleExport}
        onInsert={() =>
          setEditState({ open: true, row: null, isNew: true })
        }
      />

      {/* GRID */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="min-w-max text-xs border-collapse">
            {/* HEADER */}
            <thead className="sticky top-0 z-20 bg-background border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
              <tr>

                {columns.map((col) => (
                  <th
                    key={col}
                    className="text-left font-semibold text-muted-foreground px-3 py-2 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">

                      <span className="truncate max-w-35">
                        {col}
                      </span>

                      {SYSTEM_COLS.includes(col) && (
                        <Badge
                          variant="outline"
                          className="text-[9px] h-3 px-1 leading-none"
                        >
                          sys
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}

                <th className="w-20 px-3 py-2 text-right font-semibold text-muted-foreground">
                  Actions
                </th>

              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-10 text-muted-foreground"
                  >
                    {search ? "No matching rows" : "No data yet"}
                  </td>
                </tr>
              ) : (
                pagedRows.map((row, i) => (
                  <tr
                    key={row.id || i}
                    className="group border-b border-border/50 hover:bg-muted/40"
                  >

                    {columns.map((col) => (
                      <td
                        key={col}
                        className="px-3 py-2 max-w-55"
                      >
                        <span
                          className="block truncate text-[11px]"
                          title={String(row[col] ?? "")}
                        >
                          {col === "id" ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] h-4 px-1.5"
                            >
                              {row[col]}
                            </Badge>
                          ) : row[col] != null ? (
                            String(row[col])
                          ) : (
                            <span className="text-muted-foreground/40 italic">
                              null
                            </span>
                          )}
                        </span>
                      </td>
                    ))}

                    {/* ACTIONS */}
                    <td className="px-3 py-2 text-right">

                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() =>
                            setEditState({
                              open: true,
                              row,
                              isNew: false,
                            })
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(row.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        )}

      </div>

      {/* PAGINATION */}
      <GridPagination
        page={page}
        total={totalPages}
        filteredCount={filteredCount}
        onPageChange={setPage}
      />

      {/* EDIT DIALOG */}
      <EditRowDialog
        open={editState.open}
        onOpenChange={(open: boolean) =>
          setEditState((prev) => ({ ...prev, open }))
        }
        row={editState.row}
        columns={userCols}
        isNew={editState.isNew}
        loading={submitting}
        onSave={async (data: any) => {
          const success = editState.isNew
            ? await handleInsert(data)
            : await handleUpdate(editState.row.id, data);

          if (success) {
            setEditState((prev) => ({ ...prev, open: false }));
          }
        }}
      />

      {/* DELETE */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={`Delete Row #${deleteId}?`}
        description="This action cannot be undone."
        loading={submitting}
        onConfirm={async () => {
          if (deleteId) {
            const success = await handleDelete(deleteId);
            if (success) setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
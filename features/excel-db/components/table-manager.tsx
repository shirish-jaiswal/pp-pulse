"use client";

import { useState } from "react";
import { Table2, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableManager } from "../hooks/use-table-manager";
import { TableListItem } from "./table-list-item";
import { SkeletonRows } from "./table-skeleton";
import { CreateTableDialog } from "./dialogs/create-table-dialog";
import { RenameDialog } from "./shared/rename-dialog";
import { DeleteConfirmDialog } from "./shared/delete-confirm-dialog";

interface TableManagerProps {
  dbName: string;
  selectedTable: string | null;
  onSelectTable: (name: string) => void;
}

export function TableManager({
  dbName,
  selectedTable,
  onSelectTable,
}: TableManagerProps) {
  const {
    tables,
    loading,
    submitting,
    load,
    handleCreate,
    handleRename,
    handleDelete,
  } = useTableManager(dbName, selectedTable, onSelectTable);

  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetTable, setTargetTable] = useState("");

  if (!dbName) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-2 text-center">
        <Table2 className="h-6 w-6 text-muted-foreground/20 mb-1" />
        <p className="text-[10px] text-muted-foreground">
          Select database
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* HEADER (status strip style) */}
      <header className="flex items-center justify-between px-2 py-1 border-b border-border bg-background">

        {/* LEFT: context */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Table2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

          <span className="text-xs font-semibold truncate">
            {dbName}
          </span>

          <span className="text-[10px] text-muted-foreground ml-1">
            {tables?.length ?? 0}
          </span>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-1">

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={load}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>

          <Button
            size="icon"
            className="h-5 w-5"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>

        </div>
      </header>

      {/* LIST (true high-density mode) */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">

        {loading ? (
          <SkeletonRows count={6} />
        ) : (
          tables.map((table) => (
            <TableListItem
              key={table.name}
              table={table}
              isSelected={selectedTable === table.name}
              onSelect={onSelectTable}
              onRename={() => {
                setTargetTable(table.name);
                setRenameOpen(true);
              }}
              onDelete={() => {
                setTargetTable(table.name);
                setDeleteOpen(true);
              }}
            />
          ))
        )}

      </div>

      {/* DIALOGS */}
      <CreateTableDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        loading={submitting}
      />

      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename Table"
        initialValue={targetTable}
        onConfirm={async (newName: string) => {
          const success = await handleRename(targetTable, newName);
          if (success) setRenameOpen(false);
        }}
        loading={submitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${targetTable}"?`}
        description="All data in this table will be wiped. This cannot be undone."
        onConfirm={async () => {
          await handleDelete(targetTable);
          setDeleteOpen(false);
        }}
        loading={submitting}
      />
    </div>
  );
}
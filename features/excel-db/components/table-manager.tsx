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

export function TableManager({ dbName, selectedTable, onSelectTable }: TableManagerProps) {
  // 1. Hook Logic
  const { 
    tables, 
    loading, 
    submitting, 
    load, 
    handleCreate, 
    handleRename, 
    handleDelete 
  } = useTableManager(dbName, selectedTable, onSelectTable);

  // 2. Local UI States for Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetTable, setTargetTable] = useState("");

  if (!dbName) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-center px-4">
        <Table2 className="h-8 w-8 text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">Select a database first</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 overflow-hidden">
          <Table2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-semibold truncate" title={dbName}>{dbName}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading ? (
          <SkeletonRows count={5} />
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

      {/* Dialogs Area */}
      
      {/* 1. Create Table */}
      <CreateTableDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        loading={submitting}
      />

      {/* 2. Rename Table */}
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

      {/* 3. Delete Table */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete table "${targetTable}"?`}
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
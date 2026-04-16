"use client";

import { useState } from "react";
import { Database, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatabaseManager } from "@/features/excel-db/hooks/use-database-manager";
import { DatabaseItem } from "@/features/excel-db/components/database-item";
import { SkeletonRows } from "@/features/excel-db/components/table-skeleton";
import { RenameDialog } from "@/features/excel-db/components/shared/rename-dialog";
import { CreateDbDialog } from "@/features/excel-db/components/dialogs/create-db-dialog";
import { DeleteConfirmDialog } from "@/features/excel-db/components/shared/delete-confirm-dialog";

interface DatabaseManagerProps {
  selectedDb: string | null;
  onSelectDb: (name: string) => void;
}

export function DatabaseManager({
  selectedDb,
  onSelectDb,
}: DatabaseManagerProps) {
  const {
    databases,
    loading,
    load,
    handleCreate,
    handleRename,
    handleDelete,
    submitting,
  } = useDatabaseManager(selectedDb, onSelectDb);

  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetDb, setTargetDb] = useState("");

  return (
    <div className="flex flex-col h-full">

      {/* HEADER (aligned with TableManager style) */}
      <header className="flex items-center justify-between px-2 py-1 border-b border-border bg-background">

        <div className="flex items-center gap-1.5 min-w-0">

          <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

          <span className="text-xs font-semibold truncate">
            Databases
          </span>

          {/* context count (important for scaling perception) */}
          <span className="text-[10px] text-muted-foreground ml-1">
            {databases?.length ?? 0}
          </span>

        </div>

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

      {/* LIST (UNIFIED density system) */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">

        {loading ? (
          <SkeletonRows count={6} />
        ) : (
          databases.map((db) => (
            <DatabaseItem
              key={db.name}
              db={db}
              isSelected={selectedDb === db.name}
              onSelect={onSelectDb}
              onRename={() => {
                setTargetDb(db.name);
                setRenameOpen(true);
              }}
              onDelete={() => {
                setTargetDb(db.name);
                setDeleteOpen(true);
              }}
            />
          ))
        )}

      </div>

      {/* DIALOGS */}
      <CreateDbDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        loading={submitting}
      />

      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title={`Rename ${targetDb}`}
        initialValue={targetDb}
        onConfirm={(val: string) => handleRename(targetDb, val)}
        loading={submitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${targetDb}"?`}
        description="This will permanently delete the database and all its tables."
        onConfirm={() => handleDelete(targetDb)}
        loading={submitting}
      />
    </div>
  );
}
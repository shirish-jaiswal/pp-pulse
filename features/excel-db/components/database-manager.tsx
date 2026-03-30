"use client";

import { useState } from "react";
import { Database, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatabaseManager } from "../hooks/use-database-manager";
import { DatabaseItem } from "./database-item";
import { SkeletonRows } from "./table-skeleton";
import { RenameDialog } from "./shared/rename-dialog";
import { CreateDbDialog } from "./dialogs/create-db-dialog";
import { DeleteConfirmDialog } from "./shared/delete-confirm-dialog";

interface DatabaseManagerProps {
  selectedDb: string | null;
  onSelectDb: (name: string) => void;
}

export function DatabaseManager({ selectedDb, onSelectDb }: DatabaseManagerProps) {
  const { databases, loading, load, handleCreate, handleRename, handleDelete, submitting } =
    useDatabaseManager(selectedDb, onSelectDb);

  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetDb, setTargetDb] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Databases</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading ? (
          <SkeletonRows count={4} />
        ) : (
          databases.map((db) => (
            <DatabaseItem
              key={db.name}
              db={db}
              isSelected={selectedDb === db.name}
              onSelect={onSelectDb}
              onRename={() => { setTargetDb(db.name); setRenameOpen(true); }}
              onDelete={() => { setTargetDb(db.name); setDeleteOpen(true); }}
            />
          ))
        )}
      </div>
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
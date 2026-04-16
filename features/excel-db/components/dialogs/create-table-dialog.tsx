"use client";

import { useState } from "react";
import { Plus, X, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function CreateTableDialog({
  open,
  onOpenChange,
  onCreate,
  loading,
}: any) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<string[]>(["name"]);
  const [colInput, setColInput] = useState("");

  const addColumn = () => {
    const col = colInput.trim().replace(/\s+/g, "_");
    if (!col || columns.includes(col)) return;
    setColumns([...columns, col]);
    setColInput("");
  };

  const removeColumn = (col: string) =>
    setColumns(columns.filter((c) => c !== col));

  const handleCreate = async () => {
    const success = await onCreate(tableName, columns);
    if (success) {
      setTableName("");
      setColumns(["name"]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4">

        {/* HEADER */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Create Table
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Define table structure (name + columns)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">

          {/* TABLE NAME */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Table Name</Label>
            <Input
              placeholder="users"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              autoFocus
              className="h-8 text-sm"
            />
          </div>

          {/* COLUMNS */}
          <div className="space-y-2">

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Columns</Label>
              <span className="text-[10px] text-muted-foreground">
                id, created_at auto-added
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="column_name"
                value={colInput}
                onChange={(e) => setColInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addColumn()}
                className="h-8 text-sm"
              />

              <Button
                variant="outline"
                onClick={addColumn}
                type="button"
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* COLUMN CHIPS */}
            <div className="flex flex-wrap gap-1.5 pt-1">

              {columns.map((col) => (
                <div
                  key={col}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted border border-border text-[11px]"
                >
                  <Columns className="h-3 w-3 text-muted-foreground" />

                  <span className="truncate max-w-[120px]">
                    {col}
                  </span>

                  <button
                    onClick={() => removeColumn(col)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={
              loading || !tableName.trim() || columns.length === 0
            }
            className="h-8 text-xs"
          >
            {loading ? "Creating..." : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
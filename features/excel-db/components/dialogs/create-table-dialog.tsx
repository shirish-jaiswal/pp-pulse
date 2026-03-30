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

export function CreateTableDialog({ open, onOpenChange, onCreate, loading }: any) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<string[]>(["name"]);
  const [colInput, setColInput] = useState("");

  const addColumn = () => {
    const col = colInput.trim().replace(/\s+/g, "_");
    if (!col || columns.includes(col)) return;
    setColumns([...columns, col]);
    setColInput("");
  };

  const removeColumn = (col: string) => setColumns(columns.filter((c) => c !== col));

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>Define your table name and columns.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label>Table Name</Label>
            <Input
              placeholder="users"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-1.5">
            <Label>Columns</Label>
            <p className="text-[10px] text-muted-foreground">
              <code className="bg-muted px-1 rounded">id</code>, 
              <code className="bg-muted px-1 rounded mx-1">created_at</code> are auto-added.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="column_name"
                value={colInput}
                onChange={(e) => setColInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addColumn()}
              />
              <Button variant="outline" onClick={addColumn} type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {columns.map((col) => (
                <div key={col} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-md">
                  <Columns className="h-3 w-3 opacity-60" />
                  {col}
                  <button onClick={() => removeColumn(col)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading || !tableName.trim() || columns.length === 0}>
            {loading ? "Creating..." : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
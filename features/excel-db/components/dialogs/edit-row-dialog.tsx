"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EditRowDialog({
  open,
  onOpenChange,
  row,
  columns,
  isNew,
  onSave,
  loading,
}: any) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const data: Record<string, string> = {};
      columns.forEach((c: string) => {
        data[c] = row ? String(row[c] ?? "") : "";
      });
      setFormData(data);
    }
  }, [open, row, columns]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4">

        {/* HEADER */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            {isNew ? "Insert Row" : `Edit Row #${row?.id}`}
          </DialogTitle>

          <DialogDescription className="text-[11px] text-muted-foreground">
            Update column values (all fields optional unless required by schema)
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-2 py-1 max-h-[60vh] overflow-y-auto pr-1">

          {columns.map((col: string) => (
            <div key={col} className="space-y-1">

              <Label className="text-[11px] font-medium text-muted-foreground capitalize">
                {col.replace(/_/g, " ")}
              </Label>

              <Input
                value={formData[col] ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [col]: e.target.value,
                  })
                }
                className="h-8 text-sm bg-background"
                placeholder={`Enter ${col}`}
              />
            </div>
          ))}

        </div>

        {/* FOOTER */}
        <DialogFooter className="pt-2 gap-2">

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>

          <Button
            onClick={() => onSave(formData)}
            disabled={loading}
            className="h-8 text-xs"
          >
            {loading ? "Saving..." : isNew ? "Insert" : "Update"}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
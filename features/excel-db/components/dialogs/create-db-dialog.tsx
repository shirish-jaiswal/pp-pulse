"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function CreateDbDialog({
  open,
  onOpenChange,
  onCreate,
  loading,
}: any) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await onCreate(name.trim());
      setName("");
      onOpenChange(false);
    } catch (err) {
      // keep dialog open for retry
      console.error(err);
    }
  };

  // reset input when closing
  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">

        <DialogHeader className="space-y-1">
          <DialogTitle className="text-sm font-semibold">
            Create database
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Use a unique name (no spaces)
          </DialogDescription>
        </DialogHeader>

        {/* command-style input */}
        <Input
          autoFocus
          placeholder="my_database"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              handleCreate();
            }
          }}
          className="h-8 text-sm"
        />

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-7 text-xs"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="h-7 text-xs"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
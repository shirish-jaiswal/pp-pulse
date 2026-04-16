"use client";

import { useEffect, useState } from "react";
import { fetchDatabases, downloadDb } from "@/lib/excel-engine/api-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DownloadIcon } from "lucide-react";

export default function DownloadDb() {
  const [open, setOpen] = useState(false);
  const [dbs, setDbs] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    fetchDatabases().then((res) => {
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.databases)
        ? res.databases
        : Array.isArray(res?.data)
        ? res.data
        : [];

      const normalized = list.map((d: any) =>
        typeof d === "string" ? d : d.name
      );

      setDbs(normalized);
    });
  }, [open]);

  const toggleSelect = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((d) => d !== name)
        : [...prev, name]
    );
  };

  const handleDownload = async () => {
    for (const db of selected) {
      await downloadDb(`${db}.xlsx`);
    }
    setOpen(false);
    setSelected([]);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <DownloadIcon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-3">

          {/* HEADER */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-sm font-semibold">
              Export Databases
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Select databases to download as Excel files
            </p>
          </DialogHeader>

          {/* LIST */}
          <ScrollArea className="h-56 mt-2 border border-border rounded-md">
            <div className="divide-y divide-border">

              {dbs.length === 0 && (
                <div className="p-2 text-xs text-muted-foreground">
                  No databases found
                </div>
              )}

              {dbs.map((db) => {
                const isSelected = selected.includes(db);

                return (
                  <div
                    key={db}
                    onClick={() => toggleSelect(db)}
                    className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-muted/50"
                  >
                    <span className="text-xs font-medium truncate">
                      {db}
                    </span>

                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(db)}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* FOOTER */}
          <DialogFooter className="mt-2 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              disabled={selected.length === 0}
            >
              Download ({selected.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
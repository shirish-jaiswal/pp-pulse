"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { uploadDb } from "@/lib/excel-engine/api-client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function UploadDb() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadDb(file);
      toast.success("Upload completed");

      setFile(null);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    }
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-3">

          {/* HEADER */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-sm font-semibold">
              Import Database
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Upload .xlsx file to create or update database
            </p>
          </DialogHeader>

          {/* DROP AREA (core UX upgrade) */}
          <div
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex flex-col items-center justify-center border border-dashed border-border rounded-md px-3 py-6 cursor-pointer hover:bg-muted/50"
          >
            <Upload className="h-4 w-4 text-muted-foreground mb-2" />

            <p className="text-xs text-muted-foreground">
              Click or drop file here
            </p>

            <p className="text-[10px] text-muted-foreground mt-1">
              Only .xlsx supported
            </p>

            <Input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>

          {/* FILE STATE */}
          {file && (
            <div className="mt-2 flex items-center justify-between rounded-md border border-border bg-muted px-2 py-1.5">
              <span className="text-xs font-medium truncate">
                {file.name}
              </span>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFile(null)}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}

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
              onClick={handleUpload}
              disabled={!file}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
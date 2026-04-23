"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function CopyWarningDialog({
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            ⚠️ Verify Before Copying
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            You are about to copy content from the editor.
          </p>

          <p className="text-red-600 font-medium">
            Please ensure the content reflects the correct and final resolution before copying.
          </p>

          <p className="text-muted-foreground">
            This action is intended for support and internal review purposes. <b>Always validate the output before proceeding.</b>
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            I Understand & Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
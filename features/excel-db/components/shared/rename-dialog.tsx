import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function RenameDialog({ open, onOpenChange, initialValue, onConfirm, loading, title }: any) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => setValue(initialValue), [initialValue]);

    const handleConfirm = async () => {
        if (!value.trim()) return;
        await onConfirm(value.trim());
        onOpenChange(!open);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={loading || !value.trim()}>
                        {loading ? "Saving..." : "Rename"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
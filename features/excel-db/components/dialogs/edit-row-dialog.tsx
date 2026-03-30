import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EditRowDialog({ open, onOpenChange, row, columns, isNew, onSave, loading }: any) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            const data: Record<string, string> = {};
            columns.forEach((c: string) => { data[c] = row ? String(row[c] ?? "") : ""; });
            setFormData(data);
        }
    }, [open, row, columns]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isNew ? "Insert Row" : `Edit Row #${row?.id}`}</DialogTitle>
                    <DialogDescription>Enter values for the table columns.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-1 max-h-fit overflow-y-auto">
                    {columns.map((col: string) => (
                        <div key={col} className="space-y-1.5">
                            <Label className="text-xs font-medium capitalize">{col.replace(/_/g, " ")}</Label>
                            <Input
                                value={formData[col] ?? ""}
                                onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                                className="h-8 text-sm"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(formData)} disabled={loading}>
                        {loading ? "Saving..." : isNew ? "Insert" : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
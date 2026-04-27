"use client";

import { useState } from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useDataManager } from "./hooks/use-data-manager";

type Props = {
    dbName: string;
    tableName: string;
};

export function CreateRoleSheet({ dbName, tableName }: Props) {
    const { handleInsert } = useDataManager(dbName, tableName);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!title.trim()) return;

        try {
            setLoading(true);

            await handleInsert({ title });

            setTitle("");
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* HEADER TRIGGER */}
            <SheetTrigger asChild>
                <Button size="sm">Add Role</Button>
            </SheetTrigger>

            {/* SIDE PANEL */}
            <SheetContent className="min-w-4xl flex flex-col gap-0 p-1">
                <SheetHeader className="p-1 border-b border-border mb-1">
                    <SheetTitle className="font-bold text-lg">Resolution</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        View resolution summaries and operator responses for this round.
                    </SheetDescription>
                </SheetHeader>

                {/* BODY */}
                <div className="flex-1 p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                            Role Name
                        </label>

                        <Input
                            placeholder="e.g. Admin, Support, QA Engineer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-9"
                            autoFocus
                        />
                    </div>

                    <Separator />

                    <div className="text-xs text-muted-foreground leading-relaxed">
                        Tip: Keep role names short and meaningful. They will be used across
                        permissions, dashboards, and access control systems.
                    </div>
                </div>

                {/* FOOTER ACTION BAR */}
                <div className="p-4 border-t flex gap-2 bg-muted/30">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="flex-1"
                        onClick={onSubmit}
                        disabled={loading || !title.trim()}
                    >
                        {loading ? "Creating..." : "Create Role"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
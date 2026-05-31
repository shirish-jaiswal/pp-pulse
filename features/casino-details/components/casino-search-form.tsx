"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CasinoSearchFormProps = {
    onSubmit: (casinoId: string) => void;
    loading: boolean;
    initialValue?: string; // ✅ ADD THIS
};

export function CasinoSearchForm({ onSubmit, loading, initialValue }: CasinoSearchFormProps) {
    const [casinoId, setCasinoId] = useState("");

    // ✅ CRITICAL FIX: sync value from wrapper
    useEffect(() => {
        if (initialValue) {
            setCasinoId(initialValue);
        }
    }, [initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!casinoId.trim()) return;
        onSubmit(casinoId.trim());
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-end"
        >
            <Input
                className="h-9 text-sm max-w-xs"
                placeholder="Casino ID (e.g. ppcac00000016959)"
                value={casinoId}
                onChange={(e) => setCasinoId(e.target.value)}
                disabled={loading}
            />

            <Button
                type="submit"
                className="h-9 text-sm px-4"
                disabled={loading || !casinoId.trim()}
            >
                {loading ? "Fetching..." : "Fetch"}
            </Button>
        </form>
    );
}
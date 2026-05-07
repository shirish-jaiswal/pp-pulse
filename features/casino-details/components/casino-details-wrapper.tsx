"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CasinoSearchForm } from "./casino-search-form";
import { CasinoDetailsResult } from "./casino-details-result";
import { useCasinoDetailsQuery } from "@/features/casino-details/hooks/use-casino-details";

function CasinoDetailsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialCasinoId = searchParams.get("casinoId") || "";

    const { data, loading, error, fetchState, fetch } = useCasinoDetailsQuery();

    // Track whether the initial URL-driven fetch has been triggered
    const didInitialFetch = useRef(false);

    // On mount, if URL already has a casinoId, auto-trigger fetch
    useEffect(() => {
        if (didInitialFetch.current) return;
        didInitialFetch.current = true;

        if (initialCasinoId.trim()) {
            fetch(initialCasinoId.trim());
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (casinoId: string) => {
        // Push casinoId into the URL
        const params = new URLSearchParams();
        params.set("casinoId", casinoId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        fetch(casinoId);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Search Card */}
            <Card className="shadow-sm border-border/60 p-0 bg-background">
                <CardContent className="p-2 pb-3 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Building2 className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                            Casino Details
                        </span>
                    </div>
                    <CasinoSearchForm
                        onSubmit={handleSearch}
                        loading={loading}
                        defaultValue={initialCasinoId}
                    />
                </CardContent>
            </Card>

            {/* Loading */}
            {loading && (
                <div className="rounded-md border border-border bg-card p-6 text-center">
                    <p className="text-sm text-muted-foreground">Fetching casino details...</p>
                </div>
            )}

            {/* Error */}
            {!loading && fetchState === "error" && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive font-medium">Error</p>
                    <p className="text-xs text-destructive/80 mt-1">{error}</p>
                </div>
            )}

            {/* No data found */}
            {!loading && fetchState === "empty" && (
                <div className="rounded-md border border-border bg-card p-6 text-center">
                    <p className="text-sm text-muted-foreground">No data found for this Casino ID.</p>
                </div>
            )}

            {/* Results */}
            {!loading && fetchState === "success" && data && (
                <CasinoDetailsResult data={data} />
            )}
        </div>
    );
}

export function CasinoDetailsWrapper() {
    return <CasinoDetailsContent />;
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CasinoSearchForm } from "./casino-search-form";
import { CasinoDetailsResult } from "./casino-details-result";
import { useCasinoDetailsQuery } from "@/features/casino-details/hooks/use-casino-details";
import { useEffect } from "react";

interface CasinoDetailsWrapperProps {
  initialCasinoId?: string;
}


function CasinoDetailsContent({ initialCasinoId }: CasinoDetailsWrapperProps) {
  const { data, loading, error, fetchState, fetch } = useCasinoDetailsQuery();

  useEffect(() => {
    if (initialCasinoId?.trim()) {
      fetch(initialCasinoId);
    }
  }, [initialCasinoId, fetch]);

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
                    <CasinoSearchForm onSubmit={fetch} loading={loading} />
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

export function CasinoDetailsWrapper({ initialCasinoId }: CasinoDetailsWrapperProps) {
  return <CasinoDetailsContent initialCasinoId={initialCasinoId} />;
}

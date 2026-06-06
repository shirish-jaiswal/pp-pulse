"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { Building2 } from "lucide-react";

import { CasinoSearchForm } from "./casino-search-form";
import { CasinoDetailsResult } from "./casino-details-result";
import { useCasinoDetailsQuery } from "@/features/casino-details/hooks/use-casino-details";

interface CasinoDetailsWrapperProps {
  initialCasinoId?: string;
}

function CasinoDetailsContent({ initialCasinoId }: CasinoDetailsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryCasinoId = searchParams.get("casinoId");

  const { data, loading, error, fetchState, fetch } =
    useCasinoDetailsQuery();

  const finalCasinoId = queryCasinoId || initialCasinoId || "";

  useEffect(() => {
    if (finalCasinoId.trim()) {
      fetch(finalCasinoId);
    }
  }, [finalCasinoId, fetch]);

  return (
    <div className="flex flex-col gap-3">

      {/* ✅ SEARCH CARD */}
      <Card className="shadow-sm">
        <CardContent className="p-3 space-y-2">

          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Casino Details
            </span>
          </div>

          <CasinoSearchForm
            initialValue={finalCasinoId}
            onSubmit={(casinoId: string) => {
              fetch(casinoId);
              router.push(`/casino-details?casinoId=${casinoId}`);
            }}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* ✅ LOADING → SKELETON */}
      {loading && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      )}

      {/* ✅ ERROR → ALERT */}
      {!loading && fetchState === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ✅ EMPTY → ALERT */}
      {!loading && fetchState === "empty" && (
        <Alert>
          <AlertTitle>No Results</AlertTitle>
          <AlertDescription>
            No data found for this Casino ID.
          </AlertDescription>
        </Alert>
      )}

      {/* ✅ RESULT */}
      {!loading && fetchState === "success" && data && (
        <CasinoDetailsResult data={data} />
      )}

    </div>
  );
}

/* ✅ Export wrapper */
export function CasinoDetailsWrapper({
  initialCasinoId,
}: CasinoDetailsWrapperProps) {
  return <CasinoDetailsContent initialCasinoId={initialCasinoId} />;
}
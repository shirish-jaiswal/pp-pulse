"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { RoundDetailsForm } from "@/features/round-details/components/investigator/round-details-form";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MultiRoundDetailsForm } from "@/features/round-details/components/investigator/round-details-from-bulk";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
export function RoundInvestigator() {
  const router = useRouter();

  const {
    isBulkMode,
    setBulkMode,
    setMultiIds,
  } = useRoundDetails();

  const prevBulkMode = useRef(isBulkMode);

  useEffect(() => {
    if (prevBulkMode.current === true && isBulkMode === false) {
      window.location.href = "/portal/round-activity";
    }

    prevBulkMode.current = isBulkMode;
  }, [isBulkMode]);

  const handleSubmit = (data: RoundDetailsInputProps) => {
    if (isBulkMode) return;

    if (data?.round_id) {
      router.push(`/round-activity/?roundId=${data.round_id}`);
    } else if (data?.game_id && data?.user_id) {
      const params = new URLSearchParams({
        gameId: data.game_id,
        userId: data.user_id,
      });
      router.push(`/round-activity/?${params.toString()}`);
    } else {
      router.push("/round-activity");
    }
  };

  return (
    <Card className="shadow-sm border-border/60 p-0 bg-background">
      <CardContent className="p-2 pb-0 space-y-2">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-1.5">

          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Round Investigator
            </span>
          </div>

          <Button
            type="button"
            size="xs"
            onClick={() => setBulkMode(!isBulkMode)}
            className={cn(
              "px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide transition-all border",
              isBulkMode
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/70"
            )}
          >
            Bulk Mode: {isBulkMode ? "ON" : "OFF"}
          </Button>
        </div>

        {/* CONTENT */}
        {isBulkMode ? (
          <MultiRoundDetailsForm />
        ) : (
          <RoundDetailsForm onSubmit={handleSubmit} />
        )}
      </CardContent>
    </Card>
  );
}
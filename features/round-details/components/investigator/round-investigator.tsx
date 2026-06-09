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

  // Automatically handle page redirect when switching away from Bulk Mode
  useEffect(() => {
    if (prevBulkMode.current === true && isBulkMode === false) {
      window.location.href = "/portal/round-activity";
    }

    prevBulkMode.current = isBulkMode;
  }, [isBulkMode]);

  // Keydown listener for Ctrl+B / Cmd+B to toggle Bulk Mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "b" && 
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault(); // Prevents browser default behavior
        setBulkMode((prev: boolean) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setBulkMode]);

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
              {isBulkMode &&
                <span className="ml-2 text-[10px] font-bold normal-case tracking-normal px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 ml-0.5">
                  Max 30
                </span>
              }
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
            title="ctrl + B"
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
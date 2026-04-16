"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { RoundDetailsForm } from "@/features/round-details/components/investigator/round-details-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MultiRoundDetailsForm } from "@/features/round-details/components/investigator/round-details-from-bulk";
import { cn } from "@/utils/cn";

export function RoundInvestigator() {
  const router = useRouter();

  const {
    roundDetailsInput,
    setRoundDetailsInput,
    isBulkMode,
    setBulkMode,
    setMultiIds,
  } = useRoundDetails();

  useEffect(() => {
    if (
      roundDetailsInput?.round_id ||
      (roundDetailsInput?.game_id && roundDetailsInput?.user_id)
    ) {
      setRoundDetailsInput(roundDetailsInput);
      handleSubmit(roundDetailsInput);
    }
  }, [roundDetailsInput?.round_id]);

  useEffect(() => {
    if (isBulkMode) {
      router.push("/round-activity");
      setMultiIds({ round_ids: [], game_ids: [], user_id: "" });
    }
  }, [isBulkMode, router]);

  const handleSubmit = (data: RoundDetailsInputProps) => {
    if (isBulkMode) return;

    if (data?.round_id) {
      router.push("/round-activity/?roundId=" + data.round_id);
    } else if (data?.game_id && data?.user_id) {
      router.push(
        "/round-activity/?gameId=" +
          data.game_id +
          "&userId=" +
          data.user_id
      );
    } else {
      router.push("/round-activity");
    }
  };

  return (
    <Card className="shadow-sm border-border/60 p-0 bg-background">
      <CardContent className="p-2 pb-0 space-y-2">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-1.5">

          {/* LEFT TITLE */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Round Investigator
            </span>
          </div>

          {/* RIGHT TOGGLE */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="bulk-mode"
              className={cn(
                "text-[10px] font-medium uppercase tracking-wider transition-colors",
                isBulkMode ? "text-primary" : "text-muted-foreground"
              )}
            >
              Bulk
            </Label>

            <Switch
              id="bulk-mode"
              checked={isBulkMode}
              onCheckedChange={setBulkMode}
              className="scale-75 transition-all active:scale-90"
            />
          </div>
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
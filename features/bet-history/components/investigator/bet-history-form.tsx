"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { BetHistoryInputSchema } from "@/features/bet-history/types/bet-history-input";
import { IntegratedDateTimeRangePicker } from "@/features/log-exp/date-time-range-picker/components/integrated-date-time-range-picker";
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";

/**
 * Utility to stringify dates to safe ISO strings without local offset mutation
 */
function toUTCIsoString(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split(".")[0]; // YYYY-MM-DDTHH:mm:ss
}

/**
 * Utility to parse an ISO string directly into a explicit UTC Date object
 */
function parseUTCIsoString(isoStr: string | undefined): Date | undefined {
  if (!isoStr) return undefined;
  // Append trailing 'Z' if missing to guarantee standard parsing behavior
  const cleanStr = isoStr.endsWith("Z") ? isoStr : `${isoStr}Z`;
  const parsed = new Date(cleanStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export function BetHistoryForm() {
  const { input, setInput } = useBetHistory();

  const form = useForm({
    defaultValues: {
      playerId: input.playerId || "",
      // Maintain state structure mapping exactly back to your API context layer
      range: {
        from: parseUTCIsoString(input.from) || new Date(Date.now() - 15 * 60 * 1000),
        to: parseUTCIsoString(input.to) || new Date(),
      } as DateRangeValue,
    },

    onSubmit: async ({ value }) => {
      let fromDate = value.range?.from;
      let toDate = value.range?.to;

      if (!fromDate || !toDate) return;

      const maxDurationMs = 2 * 24 * 60 * 60 * 1000; // Exactly 48 Hours
      let durationMs = toDate.getTime() - fromDate.getTime();

      // Enforce the 2-day selection maximum threshold cap safely 
      if (durationMs > maxDurationMs) {
        toDate = new Date(fromDate.getTime() + maxDurationMs);
      }

      // Ensure the range remains logical
      if (durationMs < 0) {
        toDate = fromDate;
      }

      const payload = {
        playerId: value.playerId,
        from: toUTCIsoString(fromDate),
        to: toUTCIsoString(toDate),
      };

      const result = BetHistoryInputSchema.safeParse(payload);
      if (!result.success) return;

      setInput(payload);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end mb-2"
    >
      {/* Player Identifier Field */}
      <div className="sm:col-span-2">
        <form.Field
          name="playerId"
          children={(field) => (
            <Input
              className="h-9 text-sm"
              placeholder="Player ID"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      {/* Unified Range Selection Field */}
      <div className="sm:col-span-2">
        <form.Field
          name="range"
          children={(field) => (
            <IntegratedDateTimeRangePicker
              value={field.state.value}
              onChange={(nextRange) => {
                if (!nextRange.from || !nextRange.to) {
                  field.handleChange(nextRange);
                  return;
                }

                // Inline enforcement logic during live interface selection
                const maxDurationMs = 2 * 24 * 60 * 60 * 1000;
                const currentDiff = nextRange.to.getTime() - nextRange.from.getTime();

                if (currentDiff > maxDurationMs) {
                  field.handleChange({
                    from: nextRange.from,
                    to: new Date(nextRange.from.getTime() + maxDurationMs),
                  });
                } else {
                  field.handleChange(nextRange);
                }
              }}
            />
          )}
        />
      </div>

      {/* Execution Actions Button */}
      <Button type="submit" className="h-9 text-sm px-4 w-full">
        Fetch
      </Button>
    </form>
  );
}
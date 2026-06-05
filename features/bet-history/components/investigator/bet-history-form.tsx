"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { BetHistoryInputSchema } from "@/features/bet-history/types/bet-history-input";
import { IntegratedDateTimeRangePicker } from "@/features/log-exp/date-time-range-picker/components/integrated-date-time-range-picker";
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";

function toUTCIsoString(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split(".")[0]; // YYYY-MM-DDTHH:mm:ss
}

function parseUTCIsoString(isoStr: string | undefined): Date | undefined {
  if (!isoStr) return undefined;
  const cleanStr = isoStr.endsWith("Z") ? isoStr : `${isoStr}Z`;
  const parsed = new Date(cleanStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export function BetHistoryForm() {
  const { input, setInput } = useBetHistory();

  const form = useForm({
    defaultValues: {
      playerId: input.playerId || "",
      range: {
        from: parseUTCIsoString(input.from) || new Date(Date.now() - 15 * 60 * 1000),
        to: parseUTCIsoString(input.to) || new Date(),
      } as DateRangeValue,
    },

    onSubmit: async ({ value }) => {
      let fromDate = value.range?.from;
      let toDate = value.range?.to;

      if (!fromDate || !toDate) return;

      const maxDurationMs = 48 * 60 * 60 * 1000; // Exact 48-Hour Threshold Cap
      let durationMs = toDate.getTime() - fromDate.getTime();

      // Enforce max restriction rule 
      if (durationMs > maxDurationMs) {
        toDate = new Date(fromDate.getTime() + maxDurationMs);
      }

      // Safeguard against chronological invalid logic (e.g. 'to' is before 'from')
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
      className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end mb-2"
    >
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

      <div className="sm:col-span-1">
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

                const maxDurationMs = 48 * 60 * 60 * 1000;
                const currentDiff = nextRange.to.getTime() - nextRange.from.getTime();

                // Intercept selection and force auto-cap if higher than 48 hours
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

      <Button type="submit" className="h-9 text-sm px-4 w-full">
        Fetch
      </Button>
    </form>
  );
}
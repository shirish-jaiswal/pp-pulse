"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { BetHistoryInputSchema } from "@/features/bet-history/types/bet-history-input";
import { IntegratedDateTimeRangePicker } from "@/features/log-exp/date-time-range-picker/components/integrated-date-time-range-picker";
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";
import { DatePresetDropdown } from "./date-preset-dropdown";

const MAX_DURATION_MS = 48 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toUTCIsoString(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split(".")[0];
}

function parseUTCIsoString(isoStr: string | undefined): Date | undefined {
  if (!isoStr) return undefined;
  const cleanStr = isoStr.endsWith("Z") ? isoStr : `${isoStr}Z`;
  const parsed = new Date(cleanStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function getStartOfDayUTC(offsetDays = 0): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  if (offsetDays !== 0) {
    date.setTime(date.getTime() + offsetDays * ONE_DAY_MS);
  }
  return date;
}

export function BetHistoryForm() {
  const { input, setInput } = useBetHistory();

  const form = useForm({
    defaultValues: {
      playerId: input.playerId || "",
      range: {
        from: parseUTCIsoString(input.from) || getStartOfDayUTC(-1),
        to: parseUTCIsoString(input.to) || getStartOfDayUTC(0),
      } as DateRangeValue,
    },
    onSubmit: async ({ value }) => {
      let fromDate = value.range?.from;
      let toDate = value.range?.to;
      if (!fromDate || !toDate) return;

      let durationMs = toDate.getTime() - fromDate.getTime();
      if (durationMs > MAX_DURATION_MS) {
        toDate = new Date(fromDate.getTime() + MAX_DURATION_MS);
      }
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

  const triggerAutoSubmitIfValid = () => {
    if (form.state.values.playerId.trim() !== "") {
      setTimeout(() => {
        form.handleSubmit();
      }, 0);
    }
  };

  const shiftTimeRange = (direction: "prev" | "next", currentRange: DateRangeValue, handleChange: (val: DateRangeValue) => void) => {
    const { from, to } = currentRange;
    if (!from || !to) return;

    const now = new Date();
    let newFrom: Date;
    let newTo: Date;

    if (from.getTime() === to.getTime()) {
      if (direction === "prev") {
        newFrom = new Date(from.getTime() - ONE_DAY_MS);
        newTo = from; 
      } else {
        newFrom = from;
        newTo = new Date(from.getTime() + ONE_DAY_MS);
        if (newTo > now) {
          newTo = now;
        }
      }
    } else {
      if (direction === "prev") {
        newFrom = new Date(from.getTime() - ONE_DAY_MS);
        newTo = new Date(newFrom.getTime() + ONE_DAY_MS);
      } else {
        newFrom = new Date(from.getTime() + ONE_DAY_MS);
        newTo = new Date(newFrom.getTime() + ONE_DAY_MS);
        
        if (newTo > now) {
          newTo = now;
          if (newFrom > newTo) {
            newFrom = new Date(newTo.getTime() - ONE_DAY_MS);
          }
        }
      }
    }

    handleChange({ from: newFrom, to: newTo });
    triggerAutoSubmitIfValid();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end mb-2 w-full"
    >
      {/* Player ID Field */}
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

      {/* Time Picker Controls */}
      <div className="sm:col-span-2">
        <form.Field
          name="range"
          children={(field) => {
            const currentTo = field.state.value?.to;
            const isNextDisabled = !currentTo || currentTo >= new Date();

            return (
              <div className="flex items-center gap-1 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => shiftTimeRange("prev", field.state.value, field.handleChange)}
                  disabled={!field.state.value?.from}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex-1 min-w-0">
                  <IntegratedDateTimeRangePicker
                    value={field.state.value}
                    onChange={(nextRange) => {
                      if (!nextRange.from || !nextRange.to) {
                        field.handleChange(nextRange);
                        return;
                      }
                      const currentDiff = nextRange.to.getTime() - nextRange.from.getTime();
                      if (currentDiff > MAX_DURATION_MS) {
                        field.handleChange({
                          from: nextRange.from,
                          to: new Date(nextRange.from.getTime() + MAX_DURATION_MS),
                        });
                      } else {
                        field.handleChange(nextRange);
                      }
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => shiftTimeRange("next", field.state.value, field.handleChange)}
                  disabled={isNextDisabled}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            );
          }}
        />
      </div>

      {/* Preset Dropdown Field */}
      <div className="sm:col-span-1">
        <form.Field
          name="range"
          children={(field) => (
            <DatePresetDropdown
              onPresetSelect={(nextRange) => {
                field.handleChange(nextRange);
                triggerAutoSubmitIfValid();
              }}
            />
          )}
        />
      </div>

      {/* Fetch Button */}
      <div className="sm:col-span-1">
        <Button type="submit" className="w-full h-9 font-medium">
          Fetch
        </Button>
      </div>
    </form>
  );
}
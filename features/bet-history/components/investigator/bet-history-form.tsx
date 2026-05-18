"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { BetHistoryInputSchema } from "@/features/bet-history/types/bet-history-input";

function toDatetimeLocal(dateString?: string): string {
  if (!dateString) return "";
  return dateString.slice(0, 16);
}

/**
 * Returns days in month WITHOUT using JS Date logic
 */
function getDaysInMonth(year: number, month: number) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const isLeap =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  if (month === 2 && isLeap) return 29;

  return days[month - 1];
}

export function BetHistoryForm() {
  const { input, setInput } = useBetHistory();

  const form = useForm({
    defaultValues: {
      playerId: input.playerId || "",
      from: input.from,
      durationValue: 1,
      durationUnit: "hours",
    },

    onSubmit: async ({ value }) => {
      const from = value.from;

      const durationInMinutes =
        value.durationUnit === "hours"
          ? Number(value.durationValue) * 60
          : Number(value.durationValue);

      const safeDuration = Math.min(durationInMinutes, 1440);

      const [datePart, timePart] = from!.split("T");
      let [year, month, day] = datePart.split("-").map(Number);
      let [hour, minute] = timePart.split(":").map(Number);

      // add duration
      let totalMinutes = hour * 60 + minute + safeDuration;

      const minutesInDay = 1440;

      // handle time overflow
      let dayOffset = Math.floor(totalMinutes / minutesInDay);
      totalMinutes = totalMinutes % minutesInDay;

      let newHour = Math.floor(totalMinutes / 60);
      let newMinute = totalMinutes % 60;

      // apply day overflow manually
      day += dayOffset;

      while (true) {
        const daysInMonth = getDaysInMonth(year, month);

        if (day <= daysInMonth) break;

        day -= daysInMonth;
        month++;

        if (month > 12) {
          month = 1;
          year++;
        }
      }

      const to =
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` +
        `T${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;

      const payload = {
        playerId: value.playerId,
        from,
        to,
      };

      console.log("Payload ::", payload);

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

      <form.Field
        name="from"
        children={(field) => (
          <Input
            className="h-9 text-sm"
            type="datetime-local"
            lang="en-GB"
            step="1"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />

      <form.Field
        name="durationValue"
        children={(field) => (
          <Input
            className="h-9 text-sm w-full"
            type="number"
            min={1}
            max={1440}
            placeholder="Dur"
            value={field.state.value}
            onChange={(e) =>
              field.handleChange(Number(e.target.value))
            }
          />
        )}
      />

      <form.Field
        name="durationUnit"
        children={(field) => (
          <Select
            value={field.state.value}
            onValueChange={field.handleChange}
          >
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="hours">Hrs</SelectItem>
              <SelectItem value="minutes">Min</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" className="h-9 text-sm px-4">
        Fetch
      </Button>
    </form>
  );
}
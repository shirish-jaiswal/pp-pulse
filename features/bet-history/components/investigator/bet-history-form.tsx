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
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
        return "";
    }
}

export function BetHistoryForm() {
    const { input, setInput } = useBetHistory();

    const form = useForm({
        defaultValues: {
            playerId: input.playerId || "",
            from: toDatetimeLocal(input.from),
            durationValue: 1,
            durationUnit: "hours",
        },

        onSubmit: async ({ value }) => {
            const fromDate = new Date(value.from);

            const durationInMinutes =
                value.durationUnit === "hours"
                    ? Number(value.durationValue) * 60
                    : Number(value.durationValue);

            const safeDuration = Math.min(durationInMinutes, 1440);

            const toDate = new Date(
                fromDate.getTime() + safeDuration * 60 * 1000
            );

            const payload = {
                playerId: value.playerId,
                from: value.from,
                to: toDate.toISOString(),
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

            {/* Submit */}
            <Button type="submit" className="h-9 text-sm px-4">
                Fetch
            </Button>
        </form>
    );
}
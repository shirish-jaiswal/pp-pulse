"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Hash, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoundIdSchema } from "@/features/round-details/types/round-details-input";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

interface Props {
    onSubmit?: (data: { round_ids: string[] }) => void;
}

export function MultiRoundDetailsForm({ onSubmit }: Props) {
    const { setMultiRoundIds, setRoundDetailsInput } = useRoundDetails();
    const form = useForm({
        defaultValues: {
            raw_input: "",
            round_ids: [] as string[],
        },
        onSubmit: async ({ value }) => {
            const uniqueIds = new Set(value.round_ids);
            const leftover = value.raw_input.trim();

            if (leftover && RoundIdSchema.safeParse(leftover).success) {
                uniqueIds.add(leftover);
            }

            const finalArray = Array.from(uniqueIds);

            if (finalArray.length > 0) {
                setMultiRoundIds(finalArray);
                setRoundDetailsInput(null);
                onSubmit?.({ round_ids: finalArray });
            }
        },
    });

    const roundIds = useStore(form.store, (s) => s.values.round_ids);
    const rawInput = useStore(form.store, (s) => s.values.raw_input);

    const processInput = (value: string, forceAll = false) => {
        const parts = value.split(/[\s,]+/).filter(Boolean);

        if (parts.length === 0) {
            form.setFieldValue("raw_input", "");
            return;
        }

        const lastPart = forceAll ? "" : parts.pop() || "";
        const candidates = parts.concat(forceAll && lastPart ? [lastPart] : []);

        const validToAdd: string[] = [];
        let errorFound = false;

        candidates.forEach((id) => {
            const result = RoundIdSchema.safeParse(id);
            if (result.success) {
                if (!roundIds.includes(id) && !validToAdd.includes(id)) {
                    validToAdd.push(id);
                }
            } else {
                errorFound = true;
            }
        });

        if (validToAdd.length > 0) {
            form.setFieldValue("round_ids", (prev) => [...prev, ...validToAdd]);
        }

        form.setFieldValue("raw_input", lastPart);

        if (errorFound) {
            form.setFieldMeta("raw_input", (prev) => ({
                ...prev,
                errors: ["Some IDs were invalid and skipped"],
            }));
        }
    };

    const removeId = (idToRemove: string) => {
        form.setFieldValue("round_ids", (prev) => prev.filter(id => id !== idToRemove));
    };

    const isInputValidAndUnique =
        RoundIdSchema.safeParse(rawInput.trim()).success &&
        !roundIds.includes(rawInput.trim());

    const totalCount = roundIds.length + (isInputValidAndUnique ? 1 : 0);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="mb-2 space-y-2"
        >
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <form.Field
                        name="raw_input"
                        children={(field) => {
                            const errors = field.state.meta.errors ?? [];
                            return (
                                <div className="relative">
                                    <Hash className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 ${errors.length ? "text-red-500" : ""}`} />
                                    <Input
                                        placeholder="Paste IDs or type one by one..."
                                        className={`pl-9 h-9 text-sm transition-all ${errors.length ? "border-red-500 focus-visible:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]" : ""}`}
                                        value={field.state.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.trim().includes(" ") || val.trim().includes(",")) {
                                                processInput(val, val.endsWith(" ") || val.endsWith(","));
                                            } else {
                                                field.handleChange(val);
                                                if (errors.length) form.setFieldMeta("raw_input", (p) => ({ ...p, errors: [] }));
                                            }
                                        }}
                                        onBlur={() => processInput(field.state.value, true)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                processInput(field.state.value, true);
                                            }
                                        }}
                                    />
                                </div>
                            );
                        }}
                    />
                </div>

                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => form.reset()}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        className="h-9 px-4 shrink-0 font-medium"
                        disabled={totalCount === 0}
                    >
                        Fetch ({totalCount})
                    </Button>
                </div>
            </div>

            <div className="px-1">
                <form.Field
                    name="raw_input"
                    children={(field) => (
                        <>
                            {field.state.meta.errors?.[0] && (
                                <div className="flex items-center gap-1.5 py-1 text-red-500 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <p className="text-[10px] font-semibold">{field.state.meta.errors[0]}</p>
                                </div>
                            )}
                        </>
                    )}
                />

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1 scrollbar-thin">
                    {roundIds.map((id) => (
                        <Badge
                            key={id}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0.5 font-mono flex items-center gap-1 bg-muted hover:bg-muted/80 transition-colors"
                        >
                            {id}
                            <button
                                type="button"
                                onClick={() => removeId(id)}
                                className="ml-1 hover:text-destructive rounded-full p-0.5 hover:bg-destructive/10 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
        </form>
    );
}
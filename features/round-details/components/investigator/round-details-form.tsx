"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeftRight } from "lucide-react";
import {
    RoundDetailsInputFormSchema,
    RoundDetailsInputProps,
} from "@/features/round-details/types/round-details-input";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

interface Props {
    onSubmit?: (data: RoundDetailsInputProps) => void;
}

export function RoundDetailsForm({ onSubmit }: Props) {
    const {roundDetailsInput } = useRoundDetails();
    const defaultMode = roundDetailsInput?.game_id ? "game" : "round";
    const form = useForm({
        defaultValues: {
            mode: defaultMode,
            round_id: roundDetailsInput?.round_id || "",
            game_id: roundDetailsInput?.game_id || "",
            user_id: roundDetailsInput?.user_id || "",
        },
        onSubmit: async ({ value }) => {
            const { mode, ...payload } = value;
            const result = RoundDetailsInputFormSchema.safeParse(payload);

            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as any;
                    form.setFieldMeta(fieldName, (prev) => ({
                        ...prev,
                        errors: [issue.message],
                    }));
                });
                return;
            }
            if (mode === "round") {
                onSubmit?.({ round_id: value.round_id });
            } else {
                onSubmit?.({ game_id: value.game_id, user_id: value.user_id });
            }
        },
    });

    const mode = useStore(form.store, (s) => s.values.mode);
    const roundId = useStore(form.store, (s) => s.values.round_id);
    const gameId = useStore(form.store, (s) => s.values.game_id);
    const userId = useStore(form.store, (s) => s.values.user_id);
    const fieldMeta = useStore(form.store, (s) => s.fieldMeta);
    const hasErrors = Object.values(fieldMeta).some((meta) => meta.errors.length > 0);

    const isFetchDisabled = 
        hasErrors || 
        (mode === "round" 
            ? !roundId.trim() 
            : (!gameId.trim() || !userId.trim()));

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="w-full flex items-start gap-2"
        >
            <form.Field
                name="mode"
                children={(field) => (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 shrink-0 bg-muted/30 font-medium"
                        onClick={() => {
                            const next = field.state.value === "round" ? "game" : "round";
                            field.handleChange(next);
                            form.setFieldValue("round_id", "");
                            form.setFieldValue("game_id", "");
                            form.setFieldValue("user_id", "");
                        }}
                    >
                        {field.state.value === "round" ? "R_ID" : "G_ID"}
                        <ArrowLeftRight className="h-4 w-4 opacity-50 ml-1" />
                    </Button>
                )}
            />

            {mode === "round" && (
                <form.Field
                    name="round_id"
                    validators={{
                        onChange: ({ value }) => {
                            const result = RoundDetailsInputFormSchema.safeParse({ round_id: value });
                            if (!result.success) {
                                return result.error.flatten().fieldErrors.round_id?.[0];
                            }
                            return undefined;
                        },
                    }}
                    children={(field) => (
                        <div className="flex flex-col flex-1">
                            <Input
                                placeholder="Enter Round ID (ends with 008)..."
                                className={field.state.meta.errors.length ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : ""}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value.trim())}
                            />
                            <div className="min-h-5">
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-[10px] font-medium text-red-500 mt-1">
                                        {field.state.meta.errors[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}

            {mode === "game" && (
                <>
                    <form.Field
                        name="game_id"
                        validators={{
                            onChange: ({ value }) => {
                                const result = RoundDetailsInputFormSchema.safeParse({ game_id: value });
                                if (!result.success) return result.error.flatten().fieldErrors.game_id?.[0];
                                return undefined;
                            },
                        }}
                        children={(field) => (
                            <div className="flex flex-col flex-1">
                                <Input
                                    placeholder="Game ID..."
                                    className={field.state.meta.errors.length ? "border-red-500" : ""}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value.trim())}
                                />
                                <div className="min-h-5">
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-medium text-red-500 mt-1">
                                            {field.state.meta.errors[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    />

                    <form.Field
                        name="user_id"
                        validators={{
                            onChange: ({ value }) => {
                                const result = RoundDetailsInputFormSchema.safeParse({ user_id: value });
                                if (!result.success) return result.error.flatten().fieldErrors.user_id?.[0];
                                return undefined;
                            },
                        }}
                        children={(field) => (
                            <div className="flex flex-col flex-1">
                                <Input
                                    placeholder="User ID..."
                                    className={field.state.meta.errors.length ? "border-red-500" : ""}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value.trim())}
                                />
                                <div className="min-h-5">
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-medium text-red-500 mt-1">
                                            {field.state.meta.errors[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </>
            )}

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => form.reset()}
            >
                <RotateCcw className="h-4 w-4" />
            </Button>

            <Button 
                type="submit" 
                className="h-10 px-6 shrink-0 transition-opacity disabled:opacity-50"
                disabled={isFetchDisabled}
            >
                Fetch
            </Button>
        </form>
    );
}
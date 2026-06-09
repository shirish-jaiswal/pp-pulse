"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  ArrowLeftRight,
  Hash,
  Gamepad2,
  AlertCircle,
} from "lucide-react";

import {
  RoundIdSchema,
  GameIdSchema,
  UserIdSchema,
} from "@/features/round-details/types/round-details-input";

import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { toast } from "sonner";
import { IdList } from "@/features/round-details/components/investigator/id-list";
import { useRouter } from "next/navigation";

type Mode = "round" | "game";

interface Props {
  onSubmit?: (data: {
    round_id?: string[];
    game_id?: string[];
    user_id?: string;
  }) => void;
}

const MAX_IDS = 30;

export function MultiRoundDetailsForm({ onSubmit }: Props) {
  const router = useRouter();
  const { setMultiIds, setRoundDetailsInput } = useRoundDetails();

  const form = useForm({
    defaultValues: {
      mode: "round" as Mode,
      raw_input: "",
      round_id: [] as string[],
      game_id: [] as string[],
      user_id: "",
    },

    onSubmit: async ({ value }) => {
      if (value.mode === "game") {
        const userCheck = UserIdSchema.safeParse(value.user_id);

        if (!userCheck.success) {
          form.setFieldMeta("user_id", (prev) => ({
            ...prev,
            errors: userCheck.error.errors.map((e) => e.message),
          }));
          toast.error(userCheck.error.errors[0].message);
          return;
        }
      }

      const payload =
        value.mode === "round"
          ? { round_id: value.round_id }
          : {
              game_id: value.game_id,
              user_id: value.user_id || undefined,
            };

      const hasAny =
        (payload as any).round_id?.length ||
        (payload as any).game_id?.length ||
        !!payload.user_id;

      if (!hasAny) return;

      setMultiIds({
        round_ids: payload.round_id ?? [],
        game_ids: payload.game_id ?? [],
        user_id: payload.user_id ?? "",
      });

      setRoundDetailsInput(null);

      const params = new URLSearchParams();

      if (payload.round_id?.length) {
        params.set("roundIds", payload.round_id.join(","));
        params.set("isBulk", "true");
      }

      if (payload.game_id?.length) {
        params.set("gameIds", payload.game_id.join(","));
        if (payload.user_id) {
          params.set("userId", payload.user_id);
        }
        params.set("isBulk", "true");
      }

      router.push(`/round-activity/?${params.toString()}`);
      onSubmit?.(payload);
    },
  });

  const mode = useStore(form.store, (s) => s.values.mode);
  const roundIds = useStore(form.store, (s) => s.values.round_id);
  const gameIds = useStore(form.store, (s) => s.values.game_id);
  const userId = useStore(form.store, (s) => s.values.user_id);

  /**
   * BULK INPUT PARSER (Enforces 30 ID limit)
   */
  const processBulkInput = (value: string) => {
    const parts = value.split(/[\s,]+/).filter(Boolean);
    if (!parts.length) return;

    const last = parts.pop() || "";
    const candidates = [...parts, last];

    const schema = mode === "round" ? RoundIdSchema : GameIdSchema;
    const existing = mode === "round" ? roundIds : gameIds;
    
    // Total IDs allowed to be added before hitting the cap
    const remainingSlots = MAX_IDS - existing.length;

    if (remainingSlots <= 0) {
      form.setFieldValue("raw_input", "");
      form.setFieldMeta("raw_input", (prev) => ({
        ...prev,
        errors: [`Maximum of ${MAX_IDS} IDs reached.`],
      }));
      return;
    }

    const valid: string[] = [];
    let hasValidationError = false;
    let hitLimitCap = false;

    for (const id of candidates) {
      const res = schema.safeParse(id);

      if (res.success) {
        if (!existing.includes(id) && !valid.includes(id)) {
          if (valid.length < remainingSlots) {
            valid.push(id);
          } else {
            hitLimitCap = true;
            break;
          }
        }
      } else {
        hasValidationError = true;
      }
    }

    if (mode === "round") {
      form.setFieldValue("round_id", (prev) => [...prev, ...valid]);
    } else {
      form.setFieldValue("game_id", (prev) => [...prev, ...valid]);
    }

    form.setFieldValue("raw_input", "");

    // Determine appropriate error feedback message
    let errorMessage = "";
    if (hitLimitCap) {
      errorMessage = `Limited to ${MAX_IDS} IDs. Excess inputs ignored.`;
    } else if (hasValidationError) {
      errorMessage = "Some invalid IDs were skipped";
    }

    if (errorMessage) {
      form.setFieldMeta("raw_input", (prev) => ({
        ...prev,
        errors: [errorMessage],
      }));
    }
  };

  const validateUser = (val: string) => {
    const res = UserIdSchema.safeParse(val);
    form.setFieldMeta("user_id", (prev) => ({
      ...prev,
      errors: res.success ? [] : res.error.errors.map((e) => e.message),
    }));
  };

  const removeId = (id: string) => {
    if (mode === "round") {
      form.setFieldValue("round_id", (p) => p.filter((x) => x !== id));
    } else {
      form.setFieldValue("game_id", (p) => p.filter((x) => x !== id));
    }
  };

  const total = roundIds.length + gameIds.length + (userId ? 1 : 0);
  const totalIdsCount = mode === "round" ? roundIds.length : gameIds.length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      <div className="flex w-full gap-2 mb-px">
        {/* MODE SWITCH */}
        <form.Field
          name="mode"
          children={(field) => (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const next: Mode =
                  field.state.value === "round" ? "game" : "round";

                field.handleChange(next);
                form.setFieldValue("raw_input", "");
                form.setFieldValue("round_id", []);
                form.setFieldValue("game_id", []);
                form.setFieldValue("user_id", "");
              }}
            >
              {field.state.value === "round" ? "R_ID" : "G_ID"}
              <ArrowLeftRight className="h-4 w-4 ml-1 opacity-60" />
            </Button>
          )}
        />

        {/* INPUT */}
        <div className="flex items-center gap-2 w-full">
          <form.Field
            name="raw_input"
            children={(field) => {
              const errors = field.state.meta.errors ?? [];

              return (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    placeholder={
                      mode === "round"
                        ? `Enter Round IDs... (${totalIdsCount}/${MAX_IDS})`
                        : `Enter Game IDs... (${totalIdsCount}/${MAX_IDS})`
                    }
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const hasInput = field.state.value.trim().length > 0;

                        if (hasInput) {
                          processBulkInput(field.state.value);
                        } else if (total > 0) {
                          form.handleSubmit();
                        }
                      }
                    }}
                    onBlur={() => processBulkInput(field.state.value)}
                  />

                  {mode === "game" && (
                    <Input
                      placeholder="User ID..."
                      value={userId}
                      onChange={(e) => {
                        const val = e.target.value;
                        form.setFieldValue("user_id", val);
                        validateUser(val);
                      }}
                      className="w-64"
                    />
                  )}

                  <Button type="button" onClick={() => form.reset()}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button type="submit" disabled={!total}>
                    Fetch ({total})
                  </Button>

                  {errors.length > 0 && (
                    <div className="text-red-500 text-[10px] flex items-center gap-1 whitespace-nowrap">
                      <AlertCircle className="h-3 w-3" />
                      {errors[0]}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* TAGS */}
      <div className="space-y-2">
        {mode === "round" && (
          <IdList
            title={`Round IDs (${roundIds.length}/${MAX_IDS})`}
            icon={<Hash className="h-3 w-3" />}
            items={roundIds}
            onRemove={removeId}
          />
        )}

        {mode === "game" && (
          <IdList
            title={`Game IDs (${gameIds.length}/${MAX_IDS})`}
            icon={<Gamepad2 className="h-3 w-3" />}
            items={gameIds}
            onRemove={removeId}
          />
        )}
      </div>
    </form>
  );
}
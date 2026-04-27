"use client";

import { PlayerBetTxnInfoSchema, PlayerBetTxnInfoProps } from "@/types/round-details-input";
import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeftRight } from "lucide-react";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onSubmit: (data: PlayerBetTxnInfoProps, kibanaFunction: string) => void;
}

export const BO_VALIDATIONS = [
  "LATE BET",
  "PAYOUT CHECK",
  "CUSTOM"
] as const;

export type BOValidationType = typeof BO_VALIDATIONS[number];

export function RoundDetailsForm({ onSubmit }: Props) {
  const [validator, setValidator] = React.useState<BOValidationType>("LATE BET");

  const form = useForm({
    defaultValues: {
      gameParamId: "round_id",
      playerParamId: "user_id",
      game_id: "",
      user_id: "",
    } as PlayerBetTxnInfoProps,
    validators: {
      onChange: PlayerBetTxnInfoSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value, validator);
    },
  });

  const gameParam = useStore(form.store, (s) => s.values.gameParamId);
  const playerParam = useStore(form.store, (s) => s.values.playerParamId);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center gap-2">
        <form.Field
          name="gameParamId"
          children={(field) => (
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-9 bg-muted/30 font-medium"
              onClick={() => {
                const next = field.state.value === "round_id" ? "game_id" : "round_id";
                field.handleChange(next as any);
              }}
            >
              {field.state.value === "round_id" ? "R_ID" : "G_ID"}
              <ArrowLeftRight className="h-3 w-3 opacity-50" />
            </Button>
          )}
        />

        <form.Field
          name="game_id"
          children={(field) => (
            <Input
              placeholder={gameParam === "round_id" ? "Enter Round ID..." : "Enter Game ID..."}
              className="h-9 w-40"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value.trim())}
            />
          )}
        />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => form.reset()}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button type="submit" size="sm" className="h-9 px-4">
            Fetch
          </Button>
        </div>
      </div>

      <div className="flex items-center px-0.5 gap-2">
        {gameParam === "game_id" && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
            <form.Field
              name="playerParamId"
              children={(field) => (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-9 bg-muted/30 font-medium"
                  onClick={() => {
                    const next = field.state.value === "user_id" ? "login_id" : "user_id";
                    field.handleChange(next as any);
                  }}
                >
                  {field.state.value === "user_id" ? "U_ID" : "L_ID"}
                  <ArrowLeftRight className="h-3 w-3 opacity-50" />
                </Button>
              )}
            />

            <form.Field
              name="user_id"
              children={(field) => (
                <Input
                  className="h-9 text-xs w-40"
                  placeholder={`Enter ${playerParam === "user_id" ? "User" : "Login"} ID...`}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.trim())}
                />
              )}
            />
          </div>
        )}

        <Select
          value={validator}
          onValueChange={(value) => setValidator(value as BOValidationType)}
        >
          <SelectTrigger className="h-9 text-xs bg-background w-28">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {BO_VALIDATIONS.map((v) => (
              <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
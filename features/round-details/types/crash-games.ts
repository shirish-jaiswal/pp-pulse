import { z } from "zod";

// Utility: accepts ISO OR loose datetime string
const DateTimeSchema = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
  message: "Invalid datetime format",
});

// Utility: boolean that may come as string
const BooleanLikeSchema = z.union([
  z.boolean(),
  z.string().transform((v) => v === "true"),
]);

export const CrashGameBetSchema = z.object({
  bet_id: z.string().nullable().optional(),

  multiplier: z.number(),

  processedCashout: z.number().nullable(),
  requestedCashout: z.number().nullable(),

  createdOn: DateTimeSchema,
  ck: DateTimeSchema,

  halfmultiplier: z.number(),

  HC_TYPE: z.string().nullable(),
  CO_TYPE: z.string().nullable(),

  HC_MUL: z.number(),
  CO_MUL: z.number(),

  HC_BetAmount: z.number(),
  FC_BetAmount: z.number(),

  HC_CashPayOut: z.number(),
  FC_CashPayOut: z.number(),

  HC_Requested: z.number().nullable().optional(),
  FC_Requested: z.number().nullable().optional(),

  HC_RequestTime: DateTimeSchema.optional(),
  FC_RequestTime: DateTimeSchema.optional(),

  HC_SettleTime: DateTimeSchema.optional(),
  FC_SettleTime: DateTimeSchema.optional(),

  Updated_on: DateTimeSchema.optional(),
  Deleted_on: DateTimeSchema.nullable().optional(),

  Disconnected: BooleanLikeSchema.optional(),

  betAmount: z.number(),

  gameId: z.string(),
  userId: z.string(),
});

export const CrashGameBetArraySchema = z.array(CrashGameBetSchema);

export type CrashGameBetType = z.infer<typeof CrashGameBetSchema>;
export type CrashGameData = z.infer<typeof CrashGameBetArraySchema>;
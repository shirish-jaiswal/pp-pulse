import { z } from "zod";

// ==========================================
// Highflyer Crash Game Bet Schemas
// ==========================================

export const HighflyerBetSchema = z.object({
  bet_id: z.string().trim(),
  multiplier: z.number(),
  force_cash_out: z.number().nullable(),
  force_cash_out_initiated_time: z.string().trim().datetime().nullable(),
  requested_cash_out: z.number().nullable(),
  requested_cash_out_initiated_time: z.string().trim().datetime().nullable(),
  auto_cash_out: z.number().nullable(),
  auto_cash_out_initiated_time: z.string().trim().datetime().nullable(),
  bet_amount: z.number().positive(),
  created_time: z.string().trim().datetime(),
  is_disconnected: z.boolean(),
  disconnected_time: z.string().trim().datetime().nullable(),
  game_id: z.string().trim(),
  user_id: z.string().trim(),
  table_id: z.string().trim(),
  jackpot: z.boolean(),
});


// TypeScript Types
export type HighflyerBetType = z.infer<typeof HighflyerBetSchema>;
export type HighflyerResponseType = z.infer<ReturnType<typeof z.array<typeof HighflyerBetSchema>>>;
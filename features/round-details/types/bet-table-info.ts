import { z } from 'zod';

export const BetInfoSchema = z.object({
  game_id: z.string().trim(),
  user_id: z.string().trim(),
  round_id: z.string().trim(),
  betcode_id: z.string().trim(),
  description: z.string().trim(),
  betting_req_time: z.string().trim().datetime(),
  place_time: z.string().trim().datetime(),
  settle_time: z.string().trim().datetime(),
  game_mode: z.string().trim(),
  amount: z.number(),
  payoff: z.number(),
  currency_code: z.string().trim(),
  status: z.enum(['P', 'S', 'C', 'F']),
  casino_id: z.string().trim(),
  casino_desc: z.string().trim(),
  displayDescription: z.string().trim(),
});

export const BetTableInfoSchema = z.array(BetInfoSchema);

export type GameTransaction = z.infer<typeof BetInfoSchema>;
export type BetTableInfo = z.infer<typeof BetTableInfoSchema>;

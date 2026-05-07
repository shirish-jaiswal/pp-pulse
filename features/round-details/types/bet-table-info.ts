import { z } from 'zod';

export const BetInfoSchema = z.object({
  game_id: z.string().trim(),
  user_id: z.string(),
  round_id: z.string(),
  betcode_id: z.string(),
  description: z.string(),
  betting_req_time: z.string().datetime(),
  place_time: z.string().datetime(),
  settle_time: z.string().datetime(),
  game_mode: z.string(),
  amount: z.number(),
  payoff: z.number(),
  currency_code: z.string().trim(),
  status: z.enum(['P', 'S', 'C', 'F']),
  casino_id: z.string(),
  casino_desc: z.string().trim(),
  displayDescription: z.string().trim(),
});

export const BetTableInfoSchema = z.array(BetInfoSchema);

export type GameTransaction = z.infer<typeof BetInfoSchema>;
export type BetTableInfo = z.infer<typeof BetTableInfoSchema>;

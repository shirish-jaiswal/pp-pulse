import { z } from 'zod';

export const GameTransactionSchema = z.object({
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
  // Status can be 'S' for Settled, 'P' for Pending, 'C' for Cancelled
  status: z.enum(['S', 'P', 'C']), 
  casino_id: z.string(),
  casino_desc: z.string().trim(),
});

export const BetTableInfoSchema = z.array(GameTransactionSchema);

export type GameTransaction = z.infer<typeof GameTransactionSchema>;
export type BetTableInfo = z.infer<typeof BetTableInfoSchema>;

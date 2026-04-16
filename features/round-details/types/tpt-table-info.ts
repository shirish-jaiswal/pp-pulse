import { z } from 'zod';

export const TransactionSchema = z.object({
  game_id: z.string().trim(),
  round_id: z.string(),
  user_id: z.string(),
  amount: z.number(),
  currency_code: z.string().trim(),
  action_type: z.string(),
  status_code: z.string(),
  transaction_id: z.string(),
  third_party_txn_id: z.string(),
  platform_trans_id: z.string(),
  game_mode: z.string(),
  error_code: z.string(),
  error_description: z.string(),
  retry_counter: z.number().int(),
  trans_date: z.string().datetime(),
  payoff: z.number(),
});

export const TPTTableInfoSchema = z.array(TransactionSchema);

export type TransactionInfoDetails = z.infer<typeof TransactionSchema>;
export type TPTTableInfo = z.infer<typeof TPTTableInfoSchema>;
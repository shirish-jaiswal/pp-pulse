import { z } from 'zod';

export const TransactionSchema = z.object({
  game_id:z.string().trim(),
  round_id:z.string().trim(),
  user_id:z.string().trim(),
  amount: z.number(),
  currency_code:z.string().trim().trim(),
  action_type:z.string().trim(),
  status_code:z.string().trim(),
  transaction_id:z.string().trim(),
  third_party_txn_id:z.string().trim(),
  platform_trans_id:z.string().trim(),
  game_mode:z.string().trim(),
  error_code:z.string().trim().nullable(),
  error_description:z.string().trim(),
  retry_counter: z.number().int(),
  trans_date:z.string().trim().datetime(),
  payoff: z.number(),
  casino_id:z.string().trim(),
  casino_name:z.string().trim(),
  Wallet_Type:z.string().trim(),
  balance_before: z.number(),
  balance_after: z.number(),
});

export const TPTTableInfoSchema = z.array(TransactionSchema);

export type TransactionInfoDetails = z.infer<typeof TransactionSchema>;
export type TPTTableInfo = z.infer<typeof TPTTableInfoSchema>;
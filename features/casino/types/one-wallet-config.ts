import { z } from "zod";

export const OneWalletConfigSchema = z.object({
  casinoId: z.string(),
  casinoGroup: z.string(),
  className: z.string(),
  url: z.string().url(),
  params: z.string(),
  settleGameType: z.string(),
  cancelGameType: z.string(),
  env: z.number().int(),
  settleLostGame: z.number().int(),
  trimSession: z.number().int(),
  extraDataOnBet: z.number().int(),
  extraDataOnWin: z.number().int(),
  extraDataOnDF: z.number().int(),
  ucid: z.number().int(),
});

export type OneWalletConfig = z.infer<typeof OneWalletConfigSchema>;
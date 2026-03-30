import { z } from "zod";

const GameProgressSchema = z.object({
  seatNumber: z.string(),
  resultTime: z.string(),
  resultDesc: z.string(),
});

const TxnSettlementSchema = z.object({
  operatorTxnId: z.string().nullable(),
  roundId: z.union([z.string(), z.number()]),
  ppLiveTxnId: z.string(),
  ppSlotsTxnId: z.string().nullable(),
  txnDate: z.string(),
  txnType: z.string(),
  txnStatus: z.string(),
  txnCurrency: z.string().transform((val) => val.trim()),
  txnAmount: z.string(),
  errorCode: z.string(),
  retryCount: z.string(),
  userId: z.string(),
});

const BetInfoSchema = z.object({
  tableId: z.string(),
  tableName: z.string(),
  betCode: z.string(),
  gameType: z.string(),
  gameMode: z.string(),
  gameStart: z.string(),
  betPlacementTime: z.string(),
  settlementTime: z.string(),
  betCurrency: z.string().transform((val) => val.trim()),
  betAmount: z.string(),
  winAmount: z.string(),
  playerId: z.string(),
  casinoId: z.string(),
  casinoDesc: z.string(),
  betStatus: z.string(),
  userId: z.string(),
  betInitiatedOn: z.string(),
  megaSlot: z.string().nullable().optional(),
  megaPayout: z.string().nullable().optional(),
  betCodeId: z.string(),
  cashOutApplied: z.string().nullish().default(""), // Handles null, undefined, or empty strings
});

// --- 2. Main Response Schema ---

export const PlayerBetTxnResponseSchema = z.object({
  exists: z.object({
    playerIdList: z.array(z.string()),
    gameId: z.string(),
    roundId: z.union([z.string(), z.number()]),
    userId: z.string(),
  }),
  bets: z.object({
    betsAndPlayerInfoList: z.array(BetInfoSchema),
    betsRowCount: z.number(),
  }),
  progress: z.object({
    gameProgressInfoList: z.array(GameProgressSchema),
    gameProgressRowCount: z.number(),
    gameType: z.string(),
  }),
  settlements: z.object({
    txnSettlementsList: z.array(TxnSettlementSchema),
    txnSettlementsRowCount: z.number(),
  }),
});

// --- 3. TypeScript Inference ---

export type PlayerBetTxnResponse = z.infer<typeof PlayerBetTxnResponseSchema>;
export type BetInfo = z.infer<typeof BetInfoSchema>;
export type TxnSettlement = z.infer<typeof TxnSettlementSchema>;
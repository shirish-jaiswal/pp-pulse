import { z } from "zod";

export const PlayerParamIdSchema = z.union([
  z.literal("user_id"),
  z.literal("login_id"),
  z.literal("")
]);

export const GameParamIdSchema = z.enum(["game_id", "round_id"]);

export const PlayerBetTxnInfoSchema = z.object({
  gameParamId: GameParamIdSchema,
  game_id: z.string().min(1, "Game/Round ID is required"),
  playerParamId: PlayerParamIdSchema,
  user_id: z.string()
});

export type PlayerParamId = z.infer<typeof PlayerParamIdSchema>;
export type GameParamId = z.infer<typeof GameParamIdSchema>;
export type PlayerBetTxnInfoProps = z.infer<typeof PlayerBetTxnInfoSchema>;
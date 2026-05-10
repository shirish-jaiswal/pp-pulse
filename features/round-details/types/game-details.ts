import { z } from "zod";

// ------------------
// Single Object
// ------------------
export const RoundMetaSchema = z.object({
  round_id: z.string(),
  game_id: z.string(),
  user_id: z.string(),

  table_id: z.string(),
  table_name: z.string(),

  game_type: z.string(),
  game_time: z.string().datetime(),

  IP: z.string().ip(),

  Description: z.string(),
  multiplier: z.number().int().nullable(),

  cancelReason: z.string().nullable(),

  resultcode_id: z.string(),
  result_time: z.string().datetime(),

  state_indicator: z.number().int(),
});

// ------------------
// Array Schema
// ------------------
export const RoundMetaArraySchema = z.array(RoundMetaSchema);

// ------------------
// Types
// ------------------
export type RoundMeta = z.infer<typeof RoundMetaSchema>;
export type RoundMetaInfo = z.infer<typeof RoundMetaArraySchema>;
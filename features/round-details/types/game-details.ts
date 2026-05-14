import { z } from "zod";

// ------------------
// Single Object
// ------------------
export const RoundMetaSchema = z.object({
  round_id: z.string().trim(),
  game_id: z.string().trim(),
  user_id: z.string().trim(),

  table_id: z.string().trim(),
  table_name: z.string().trim(),

  game_type: z.string().trim(),
  game_time: z.string().trim().datetime(),

  IP: z.string().trim().ip(),

  Description: z.string().trim(),
  multiplier: z.number().int().nullable(),

  cancelReason: z.string().trim().nullable(),

  resultcode_id: z.string().trim(),
  result_time: z.string().trim().datetime(),

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
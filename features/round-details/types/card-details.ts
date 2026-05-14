import { z } from "zod";

// ------------------
// Single Object
// ------------------
export const CardDetailsSchema = z.object({
  game_id: z.string(),
  seat_number: z.string(),
  hand_number: z.number().int(),
  event_type: z.string(),
  event_value: z.string(),
  result_time: z.string().datetime(),
  state_indicator: z.number().int(),
  user_id: z.string(),
  round_id: z.string(),
  result_order: z.number().int().optional(),
  resultcode_id: z.string(),
});

// ------------------
// Array Schema
// ------------------
export const CardDetailsArraySchema = z.array(CardDetailsSchema);

// ------------------
// Types
// ------------------
export type CardDetails = z.infer<typeof CardDetailsSchema>;
export type CardDetailsInfo = z.infer<typeof CardDetailsArraySchema>;
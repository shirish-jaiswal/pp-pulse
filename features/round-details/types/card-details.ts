import { z } from "zod";

// ------------------
// Single Object
// ------------------
export const CardDetailsSchema = z.object({
  game_id: z.string().trim(),
  seat_number: z.string().trim(),
  hand_number: z.number().int(),
  event_type: z.string().trim(),
  event_value: z.string().trim(),
  result_time: z.string().trim().datetime(),
  state_indicator: z.number().int(),
  user_id: z.string().trim(),
  round_id: z.string().trim(),
  result_order: z.number().int().optional(),
  resultcode_id: z.string().trim(),
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
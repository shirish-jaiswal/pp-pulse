import { z } from "zod";

export const BetHistoryInputSchema = z.object({
    playerId: z.string().min(1, "Player ID required"),
    from: z.string().optional(),
    to: z.string().optional(),
});

export type BetHistoryInputProps = z.infer<typeof BetHistoryInputSchema>;
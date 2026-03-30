import { z } from "zod";

export const GameConfigSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  parentId: z.number().nullable(),
  status: z.boolean(),
  confId: z.number().nullable(),
  gameTypeId: z.number().nullable(),
  operatorGameId: z.string(),
  openTime: z.string().datetime().nullable(), 
});

export const GameConfigArraySchema = z.array(GameConfigSchema);

export type GameConfig = z.infer<typeof GameConfigSchema>;
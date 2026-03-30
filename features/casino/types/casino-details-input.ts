import { z } from "zod";

const CasinoDetailsEnum = z.enum([
  "getCasino",
  "getCasinoConfig",
  "getOneWalletCasino",
  "getCasinoTables",
]);

export const CasinoDetailsFormSchema = z.object({
  casinoId: z.string().min(1, "Casino ID is required"),
  details: CasinoDetailsEnum,
});

export type CasinoDetailsFormType = z.infer<typeof CasinoDetailsFormSchema>;
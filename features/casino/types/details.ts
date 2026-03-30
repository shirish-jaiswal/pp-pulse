import { z } from "zod";

export const CasinoDetailsSchema = z.object({
  casinoId: z.string().min(1, "Casino ID is required"),
  description: z.string().trim(),
  live: z.boolean(),
  languageCode: z.string().length(2, "Must be a 2-letter ISO code"),
  active: z.boolean(),
  currencyCode: z.string().length(3, "Must be a 3-letter currency code"),
  countryCode: z.string().length(2, "Must be a 2-letter country code"),
  countryName: z.string().min(1),
  hub: z.string().min(1)
});

export type CasinoDetails = z.infer<typeof CasinoDetailsSchema>;
import { z } from 'zod';

const stringToBoolean = z
  .string()
  .transform((val) => val.toLowerCase() === 'true');

const commaStringToArray = z
  .string()
  .transform((val) => val.split(',').filter(Boolean));

export const CasinoConfigSchema = z.object({
  cashier_mobile: z.string().optional(),
  bonus_balance: stringToBoolean,
  tipping_enabled: stringToBoolean,
  ping_language_timer: z.coerce.number(), 
  voice_over_tables: commaStringToArray,
  cashier_url_first: z.string().optional(),
  clr_mobile: z.string(),
  chat_logo_bg: z.string(),
  hide_lobby_buttons: stringToBoolean,
  languages: commaStringToArray,
  mobile_site: z.string().optional(),
  lobby_bg: z.string(),
  new_lobby_config_enabled: stringToBoolean,
  hide_inner_wheel: stringToBoolean,
  hide_currency: stringToBoolean,
  lobby_version: z.coerce.number(),
  rank_enabled: stringToBoolean,
  syschat_enabled: stringToBoolean,
  gamecare_choice: stringToBoolean,
  ranking_image: z.string(),
  cashier_popup_enabled: stringToBoolean,
  cashier_url: z.string().optional(),
  roulette_desktop_bg: z.string(),
  lobby_logo: z.string(),
  clr_desktop: z.string(),
  multi_table_shortcuts: z.string(),
  error_return_page: z.string().optional(),
});

export type CasinoConfig = z.infer<typeof CasinoConfigSchema>;
import { z } from "zod";

export const sessionSchema = z.object({
  jsessionId: z.string().min(1, "JSessionID is required"),
  oAuthCookie1: z.string().min(1, "oAuthCookie1 is required"),
  oAuthCookie2: z.string().min(1, "oAuthCookie2 is required"),
  sid: z.string().min(1, "Sid is required"),
  cc_cookie: z.string(),
});

export type SessionConfig = z.infer<typeof sessionSchema>;
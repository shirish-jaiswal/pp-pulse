import { z } from "zod";
import apiRequest from "@/lib/api/api-request";

export const LoginInputSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(1),
});

export type LoginInputProps = z.infer<typeof LoginInputSchema>;

export async function c_login(rawData: LoginInputProps) {

  return apiRequest({
    method: "POST",
    endpoint: "/auth/login",
    data : rawData,
  });
}
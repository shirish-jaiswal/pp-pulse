//lib/auth/login/request-login.ts
import { z } from "zod";
import { axiosClient } from "@/lib/api/axios-client";

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInputProps = z.infer<typeof LoginInputSchema>;

export async function c_login(rawData: LoginInputProps) {
  const data = LoginInputSchema.parse(rawData);

  try {
    const response = await axiosClient.post("/auth/login", data);

    // standard safe return
    return response.data?.data;
  } catch (error: any) {
    // because axiosClient already normalizes errors (if you added interceptor)
    throw new Error(error?.message || "Failed to login");
  }
}
import { z } from "zod";
import { axiosClient } from "@/lib/api/axios-client";

export const RequestUserCookieSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
role: z.string().min(1),
});

export type RequestUserCookieProps = z.infer<typeof RequestUserCookieSchema>;

export async function c_requestUserCookie(rawData: RequestUserCookieProps) {
  const data = RequestUserCookieSchema.parse(rawData);

  try {
    const response = await axiosClient.post("/auth/user", data);

    return response.data?.data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to login");
  }
}
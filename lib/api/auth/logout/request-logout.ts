import { axiosClient } from "@/lib/api/axios-client";

export async function c_logout() {
  try {
    const response = await axiosClient.post("/auth/logout", {});

    return response.data?.data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to logout");
  }
}
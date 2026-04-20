import { axiosClient } from "@/lib/api/axios-client";
import axios from "axios";

export async function c_logout() {
  try {
    const response = await axios.post("/auth/logout", {});
    return response.data?.data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to logout");
  }
}
import axios from "axios";

export async function c_logout() {
  try {
    await axios.post(
      "/portal/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    throw new Error(error?.message || "Failed to logout");
  }
}
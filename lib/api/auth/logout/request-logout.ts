import axios from "axios";

export async function c_logout() {
  try {
    await axios.post("/portal/api/auth/logout", {});
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message || "Failed to logout");
  }
}
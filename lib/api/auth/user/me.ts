import { axiosClient } from "@/lib/api/axios-client";

export async function c_getUser() {
    const response = await axiosClient.get("/auth/user/me", {
        withCredentials: true,
    });

    return response.data?.user ?? response.data;
}
"use client";

import { useCallback, useState } from "react";
import { UserData, searchUserByEmail, searchUserByUserId } from "@/lib/api/user-management/user-management";

export type FetchState = "idle" | "loading" | "success" | "error" | "empty";

export function useUserManagementQuery() {
    const [data, setData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchState, setFetchState] = useState<FetchState>("idle");

    const fetchByEmail = useCallback(async (emailAddress: string) => {
        if (!emailAddress.trim()) return;
        setLoading(true);
        setError(null);
        setData([]);
        setFetchState("loading");
        try {
            const result = await searchUserByEmail({ emailAddress: emailAddress.trim() });
            setData(result);
            setFetchState(result.length > 0 ? "success" : "empty");
        } catch (err: any) {
            setError(err?.message || "Failed to fetch user");
            setFetchState("error");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByUserId = useCallback(async (userId: string) => {
        if (!userId.trim()) return;
        setLoading(true);
        setError(null);
        setData([]);
        setFetchState("loading");
        try {
            const result = await searchUserByUserId({ userId: userId.trim() });
            setData(result);
            setFetchState(result.length > 0 ? "success" : "empty");
        } catch (err: any) {
            setError(err?.message || "Failed to fetch user");
            setFetchState("error");
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchState, fetchByEmail, fetchByUserId };
}

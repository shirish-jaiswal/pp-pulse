"use client";

import { useCallback, useState } from "react";
import {
  UserData,
  searchUserByEmail,
  searchUserByUserId,
} from "@/lib/api/user-management/user-management";

export type FetchState = "idle" | "loading" | "success" | "error" | "empty";

/**
 * ✅ CLEAN FINAL GROUPING
 */
function groupUsers(data: UserData[]): UserData[] {
  const grouped: Record<string, any> = {};

  data.forEach((item: any) => {
    const key = `${item.userId}_${item.casinoId}_${item.casinoName}`;

    if (!grouped[key]) {
      grouped[key] = {
        ...item,
        history: [],
      };
    }

    // ✅ Push only valid comment + valid time
    if (
      typeof item.chatBlockedComments === "string" &&
      item.chatBlockedComments.trim() !== "" &&
      item.note_time &&
      !isNaN(Date.parse(item.note_time))
    ) {
      grouped[key].history.push({
        comment: item.chatBlockedComments,
        time: item.note_time,
      });
    }
  });

  return Object.values(grouped);
}

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
      const result = await searchUserByEmail({
        emailAddress: emailAddress.trim(),
      });

      const grouped = groupUsers(result);

      setData(grouped);
      setFetchState(grouped.length > 0 ? "success" : "empty");
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
      const result = await searchUserByUserId({
        userId: userId.trim(),
      });

      const grouped = groupUsers(result);

      setData(grouped);
      setFetchState(grouped.length > 0 ? "success" : "empty");
    } catch (err: any) {
      setError(err?.message || "Failed to fetch user");
      setFetchState("error");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchState,
    fetchByEmail,
    fetchByUserId,
  };
}
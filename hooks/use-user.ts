"use client";

import { useProfile } from "@/context/use-profile";
import { c_getUser } from "@/lib/api/auth/user/me";
import { useEffect, useCallback } from "react";

export function useUser() {
  const { setUser, setLoading } = useProfile();

  const fetchUser = useCallback(async () => {
    try {
      const user = await c_getUser();
      setUser(user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!isMounted) return;
      await fetchUser();
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchUser]);

  return { refetchUser: fetchUser };
}
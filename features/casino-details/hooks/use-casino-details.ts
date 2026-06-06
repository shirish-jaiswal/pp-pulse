"use client";

import { useCallback, useRef, useState } from "react";
import {
  getCasinoDetails,
  getCasinoTables,
  NormalisedCasinoData,
} from "@/lib/api/casino-details/casino-details";

type FetchState = "idle" | "loading" | "success" | "error" | "empty";

export function useCasinoDetailsQuery() {
  const [data, setData] = useState<NormalisedCasinoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("idle");

  const requestIdRef = useRef(0);

  const fetch = useCallback(async (casinoId: string) => {
    const trimmedId = casinoId.trim();
    if (!trimmedId) return;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setFetchState("loading");

    try {
      const [casinoRes, tablesRes] = await Promise.all([
        getCasinoDetails({ casinoId: trimmedId }),
        getCasinoTables({ casinoId: trimmedId }),
      ]);

      if (requestId !== requestIdRef.current) return;

      if (casinoRes) {
        // ✅ IMPORTANT FIX: clone deeply
        const safeData: NormalisedCasinoData = {
          ...casinoRes,
          sharedEnvs: [...(casinoRes.sharedEnvs || [])], // ✅ FORCE re-render
          tables: tablesRes ?? [],
        };

        setData(safeData);
        setFetchState("success");
      } else {
        setData(null);
        setFetchState("empty");
      }
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) return;

      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch casino details";

      setError(message);
      setFetchState("error");
      setData(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchState,
    fetch,
  };
}
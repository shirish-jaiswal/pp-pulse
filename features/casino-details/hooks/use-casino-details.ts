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

  const [tables, setTables] = useState<any[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const requestIdRef = useRef(0);

  // ✅ prevent duplicate table calls
  const fetchedTablesRef = useRef<string | null>(null);

  // ✅ TABLE FETCH (SAFE)
  const fetchTables = useCallback(async (casinoId: string) => {
    if (!casinoId) return;

    if (fetchedTablesRef.current === casinoId) return; // ✅ only once
    fetchedTablesRef.current = casinoId;

    try {
      setTablesLoading(true);

      const res = await getCasinoTables({ casinoId });

      setTables(res ?? []);
    } catch (err) {
      console.error("Tables fetch failed", err);
    } finally {
      setTablesLoading(false);
    }
  }, []);

  // ✅ MAIN FETCH
  const fetch = useCallback(async (casinoId: string) => {
    const trimmedId = casinoId.trim();
    if (!trimmedId) return;

    const requestId = ++requestIdRef.current;

    // ✅ reset state
    fetchedTablesRef.current = null;
    setTables([]);

    setLoading(true);
    setError(null);
    setFetchState("loading");

    try {
      const casinoRes = await getCasinoDetails({
        casinoId: trimmedId,
      });

      if (requestId !== requestIdRef.current) return;

      if (casinoRes) {
        setData({
          ...casinoRes,
          sharedEnvs: [...(casinoRes.sharedEnvs || [])],
        });

        setFetchState("success");

        // ✅ ✅ PRELOAD TABLES ONCE (NO LOOP)
        fetchTables(trimmedId);

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
  }, [fetchTables]);

  return {
    data,
    loading,
    error,
    fetchState,

    tables,
    tablesLoading,

    fetch,
  };
}
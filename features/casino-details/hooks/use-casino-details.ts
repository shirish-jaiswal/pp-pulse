"use client";

import { useCallback, useState } from "react";
import { getCasinoDetails, NormalisedCasinoData } from "@/lib/api/casino-details/casino-details";

type FetchState = "idle" | "loading" | "success" | "error" | "empty";

export function useCasinoDetailsQuery() {
    const [data, setData] = useState<NormalisedCasinoData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchState, setFetchState] = useState<FetchState>("idle");

    const fetch = useCallback(async (casinoId: string) => {
        if (!casinoId.trim()) return;

        setLoading(true);
        setError(null);
        setData(null);
        setFetchState("loading");

        try {
            const result = await getCasinoDetails({ casinoId: casinoId.trim() });
            if (result) {
                setData(result);
                setFetchState("success");
            } else {
                setFetchState("empty");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch casino details");
            setFetchState("error");
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchState, fetch };
}

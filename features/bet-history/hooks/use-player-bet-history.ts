"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPlayerBetHistory, PlayerBetHistoryProps } from "@/lib/api/bet-history/player-bet-details";

const ONE_HOUR = 60 * 60 * 1000;
const CONCURRENCY_LIMIT = 5;

export function usePlayerBetHistory(
    params: PlayerBetHistoryProps,
    refreshInterval?: number
) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const paramsRef = useRef(params);
    paramsRef.current = params;

    const getKey = (item: any) =>
        item.TransactionId ||
        item.ThirdPartyTxnId ||
        `${item.RoundId}-${item.Time}`;

    const buildChunks = (from: string, to: string) => {
        const start = new Date(from).getTime();
        const end = new Date(to).getTime();

        if (isNaN(start) || isNaN(end) || start >= end) return [];

        const chunks: { from: string; to: string }[] = [];

        for (let t = start; t < end; t += ONE_HOUR) {
            chunks.push({
                from: new Date(t).toISOString(),
                to: new Date(Math.min(t + ONE_HOUR, end)).toISOString(),
            });
        }

        return chunks;
    };

    const fetchChunked = async (chunks: { from: string; to: string }[]) => {
        const results: any[] = [];

        for (let i = 0; i < chunks.length; i += CONCURRENCY_LIMIT) {
            const batch = chunks.slice(i, i + CONCURRENCY_LIMIT);

            const settled = await Promise.allSettled(
                batch.map((c) =>
                    getPlayerBetHistory({
                        playerId: paramsRef.current.playerId,
                        from: c.from,
                        to: c.to,
                    })
                )
            );

            for (const res of settled) {
                if (res.status === "fulfilled") {
                    results.push(...res.value);
                }
            }
        }

        return results;
    };

    const fetchData = useCallback(async () => {
        const { playerId, from, to } = paramsRef.current;

        if (!playerId || !from || !to) return;

        setLoading(true);
        setError(null);

        try {
            const chunks = buildChunks(from, to);

            if (!chunks.length) {
                setData([]);
                return;
            }

            const merged = await fetchChunked(chunks);

            setData(() => {
                const map = new Map<string, any>();

                for (const item of merged) {
                    map.set(getKey(item), item);
                }

                return Array.from(map.values());
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!params.playerId) {
            setData([]);
            return;
        }

        fetchData();
    }, [params.playerId, params.from, params.to, refreshInterval]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
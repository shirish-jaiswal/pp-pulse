"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPlayerBetHistory, PlayerBetHistoryProps } from "@/lib/api/bet-history/player-bet-details";

const ONE_HOUR = 60 * 60 * 1000;

export function usePlayerBetHistory(
    params: PlayerBetHistoryProps,
    refreshInterval?: number
) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const paramsRef = useRef(params);

    paramsRef.current = params;

    const getKey = (item: any) =>
        item.TransactionId ||
        item.ThirdPartyTxnId ||
        `${item.RoundId}-${item.Time}`;

    const buildChunks = (from: string, to: string) => {
        const start = new Date(from).getTime();
        const end = new Date(to).getTime();

        const chunks: { from: string; to: string }[] = [];

        for (let t = start; t < end; t += ONE_HOUR) {
            chunks.push({
                from: new Date(t).toISOString(),
                to: new Date(Math.min(t + ONE_HOUR, end)).toISOString(),
            });
        }

        return chunks;
    };

    const fetchData = useCallback(async () => {
        const { playerId, from, to } = paramsRef.current;

        if (!playerId || !from || !to) return;

        setLoading(true);
        setError(null);

        try {
            const chunks = buildChunks(from, to);

            const results = await Promise.allSettled(
                chunks.map((c) =>
                    getPlayerBetHistory({
                        playerId,
                        from: c.from,
                        to: c.to,
                    })
                )
            );

            const merged: any[] = [];

            for (const res of results) {
                if (res.status === "fulfilled") {
                    merged.push(...res.value);
                }
            }

            // Deduplicate safely
            setData(() => {
                const map = new Map<string, any>();

                merged.forEach((item) => {
                    map.set(getKey(item), item);
                });

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
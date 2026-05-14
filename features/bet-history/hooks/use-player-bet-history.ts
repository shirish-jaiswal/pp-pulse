"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPlayerBetHistory, PlayerBetHistoryProps } from "@/lib/api/bet-history/player-bet-details";

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

    /**
     * Stable key for deduplication
     */
    const getKey = (item: any) =>
        item.TransactionId ||
        item.ThirdPartyTxnId ||
        `${item.RoundId}-${item.Time}`;

    /**
     * Format WITHOUT timezone conversion
     * Keeps exact "YYYY-MM-DDTHH:mm"
     */
    const format = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");

        return (
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
            `T${pad(d.getHours())}:${pad(d.getMinutes())}`
        );
    };

    /**
     * Build exact 1-hour chunks:
     * 12:00 → 13:00
     * 13:00 → 14:00
     */
    const buildChunks = (from: string, to: string) => {
        const chunks: { from: string; to: string }[] = [];

        let current = new Date(from);
        const end = new Date(to);

        while (current < end) {
            const next = new Date(current);
            next.setHours(next.getHours() + 1);

            chunks.push({
                from: format(current),
                to: format(next > end ? end : next),
            });

            current = next;
        }

        return chunks;
    };

    /**
     * Fetch logic
     */
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

        if (refreshInterval) {
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                fetchData();
            }, refreshInterval);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [params.playerId, params.from, params.to, refreshInterval]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
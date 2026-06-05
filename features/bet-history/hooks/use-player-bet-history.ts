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

    const getKey = (item: any) =>
        item.TransactionId ||
        item.ThirdPartyTxnId ||
        `${item.RoundId}-${item.Time}`;

    /**
     * Formats an absolute Date object using pure UTC methods
     * Keeps exact "YYYY-MM-DDTHH:mm" in standard UTC
     */
    const formatUTC = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");

        return (
            `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
            `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
        );
    };

    /**
     * Build exact 1-hour chunks safely processing explicitly closed UTC bounds
     */
    const buildChunks = (fromStr: string, toStr: string) => {
        const chunks: { from: string; to: string }[] = [];

        // Appending 'Z' guarantees JavaScript parses it as exact UTC time
        const cleanFrom = fromStr.endsWith("Z") ? fromStr : `${fromStr}Z`;
        const cleanTo = toStr.endsWith("Z") ? toStr : `${toStr}Z`;

        let current = new Date(cleanFrom);
        const end = new Date(cleanTo);

        while (current < end) {
            const next = new Date(current.getTime());
            next.setUTCHours(next.getUTCHours() + 1);

            chunks.push({
                from: formatUTC(current),
                to: formatUTC(next > end ? end : next),
            });

            current = next;
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
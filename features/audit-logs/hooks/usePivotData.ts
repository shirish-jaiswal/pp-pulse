import { useMemo } from "react";

export function usePivotData(logs: any[]) {

  // ✅ ✅ HELPER → extract requestId (ppc.... only)
  const getRequestId = (value: string) => {
    if (!value) return "";
    return value.split("\n")[0].trim();
  };

  // ✅ ✅ DEDUP LOGS (IMPORTANT FIX)
  const cleanedLogs = useMemo(() => {
    const map = new Map();

    logs.forEach((log) => {
      let key = "";

      if (log.action === "PLAYER_BETS_SEARCH") {
        const requestId = getRequestId(log.value);

        // ✅ group by user + requestId
        key = `${log.actorEmail}_${requestId}`;
      } else {
        // ✅ other actions remain same (no change)
        key = `${log.actorEmail}_${log.action}_${log.timestamp}`;
      }

      if (!map.has(key)) {
        map.set(key, log);
      }
    });

    return Array.from(map.values());
  }, [logs]);

  // ✅ ACTION COUNT
  const byAction = useMemo(() => {
    const map: Record<string, number> = {};

    cleanedLogs.forEach((log) => {
      map[log.action] = (map[log.action] || 0) + 1;
    });

    return Object.entries(map)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);
  }, [cleanedLogs]);

  // ✅ USER COUNT
  const byUser = useMemo(() => {
    const map: Record<string, number> = {};

    cleanedLogs.forEach((log) => {
      map[log.actorEmail] = (map[log.actorEmail] || 0) + 1;
    });

    return Object.entries(map)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [cleanedLogs]);

  // ✅ STATUS COUNT
  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};

    cleanedLogs.forEach((log) => {
      map[log.status] = (map[log.status] || 0) + 1;
    });

    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
    }));
  }, [cleanedLogs]);

  // ✅ BASE DATE AGGREGATION (COMMON)
  const baseDateMap = useMemo(() => {
    const map: Record<string, number> = {};

    cleanedLogs.forEach((log) => {
      const dateObj = new Date(log.timestamp);

      const label = dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: true,
      });

      map[label] = (map[label] || 0) + 1;
    });

    return Object.entries(map).map(([date, count]) => ({
      date,
      count,
    }));
  }, [cleanedLogs]);

  // ✅ TREND DATA → sorted by time
  const byDate = useMemo(() => {
    return [...baseDateMap].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [baseDateMap]);

  // ✅ PEAK DATA → sorted by count
  const peakByDate = useMemo(() => {
    return [...baseDateMap].sort((a, b) => b.count - a.count);
  }, [baseDateMap]);

  return {
    byAction,
    byUser,
    byStatus,
    byDate,
    peakByDate,
  };
}
import { useMemo } from "react";

export function usePivotData(logs: any[]) {

  // ✅ ACTION COUNT
  const byAction = useMemo(() => {
    const map: Record<string, number> = {};

    logs.forEach((log) => {
      map[log.action] = (map[log.action] || 0) + 1;
    });

    return Object.entries(map)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  // ✅ USER COUNT
  const byUser = useMemo(() => {
    const map: Record<string, number> = {};

    logs.forEach((log) => {
      map[log.actorEmail] = (map[log.actorEmail] || 0) + 1;
    });

    return Object.entries(map)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top users for UI
  }, [logs]);

  // ✅ STATUS COUNT
  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};

    logs.forEach((log) => {
      map[log.status] = (map[log.status] || 0) + 1;
    });

    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
    }));
  }, [logs]);

  // ✅ ✅ FIXED TREND (HOUR-WISE)
  const byDate = useMemo(() => {
    const map: Record<string, number> = {};

    logs.forEach((log) => {
      const dateObj = new Date(log.timestamp);

      // ✅ group by hour
      const label = dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        hour12: true,
      });

      map[label] = (map[label] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  return {
    byAction,
    byUser,
    byStatus,
    byDate,
  };
}
import { useEffect, useState } from "react";
import { c_getAuditLogs } from "@/lib/api/audit-logs/audit-logs";

export function useAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // ✅ NEW

  // ✅ FUNCTION TO FETCH DATA
  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res = await c_getAuditLogs();
      setLogs(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }

    setLoading(false);
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    refreshLogs: fetchLogs, // ✅ VERY IMPORTANT
    loading,                // ✅ FOR UI FEEDBACK
  };
}
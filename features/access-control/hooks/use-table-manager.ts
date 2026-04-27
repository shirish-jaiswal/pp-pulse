import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchTables } from "@/lib/excel-engine/api-client";

export function useTableManager(dbName: string, selectedTable: string | null, onSelectTable: (name: string) => void) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!dbName) return;
    setLoading(true);
    try {
      const res = await fetchTables(dbName);
      if (res.success) setTables(res.data);
    } catch {
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, [dbName]);

  useEffect(() => {
    load();
    onSelectTable("");
  }, [dbName, load, onSelectTable]);

  return {
    tables,
    loading,
    load,
  };
}
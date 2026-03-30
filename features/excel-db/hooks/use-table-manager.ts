import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { createTable, deleteTable, fetchTables, renameTable } from "@/lib/excel-engine/api-client";

export function useTableManager(dbName: string, selectedTable: string | null, onSelectTable: (name: string) => void) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreate = async (tableName: string, columns: string[]) => {
    setSubmitting(true);
    try {
      const res = await createTable(dbName, tableName.trim(), columns);
      if (res.success) {
        toast.success(`Table "${tableName}" created`);
        await load();
        return true;
      } else {
        toast.error(res.error);
        return false;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRename = async (oldName: string, newName: string) => {
    if (oldName === newName) return true;
    setSubmitting(true);
    try {
      const res = await renameTable(dbName, oldName, newName.trim());
      if (res.success) {
        toast.success("Table renamed");
        if (selectedTable === oldName) onSelectTable(newName.trim());
        await load();
        return true;
      } else {
        toast.error(res.error);
        return false;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (targetTable: string) => {
    setSubmitting(true);
    try {
      const res = await deleteTable(dbName, targetTable);
      if (res.success) {
        toast.success(`Table "${targetTable}" deleted`);
        if (selectedTable === targetTable) onSelectTable("");
        await load();
        return true;
      } else {
        toast.error(res.error);
        return false;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return { 
    tables, 
    loading, 
    submitting, 
    load, 
    handleCreate, 
    handleRename, 
    handleDelete 
  };
}
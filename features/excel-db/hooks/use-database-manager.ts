import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchDatabases, createDatabase, deleteDatabase, renameDatabase } from "@/lib/excel-engine/api-client";

interface DB {
  name: string;
  tableCount: number;
}

export function useDatabaseManager(selectedDb: string | null, onSelectDb: (name: string) => void) {
  const [databases, setDatabases] = useState<DB[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDatabases();
      if (res.success) setDatabases(res.data);
    } catch {
      toast.error("Failed to load databases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (name: string) => {
    setSubmitting(true);
    const res = await createDatabase(name.trim());
    if (res.success) {
      toast.success(`Database "${name}" created`);
      await load();
    } else {
      toast.error(res.error);
    }
    setSubmitting(false);
    return res.success;
  };

  const handleRename = async (oldName: string, newName: string) => {
    setSubmitting(true);
    const res = await renameDatabase(oldName, newName.trim());
    if (res.success) {
      toast.success("Database renamed");
      if (selectedDb === oldName) onSelectDb(newName.trim());
      await load();
    } else {
      toast.error(res.error);
    }
    setSubmitting(false);
    return res.success;
  };

  const handleDelete = async (name: string) => {
    setSubmitting(true);
    const res = await deleteDatabase(name);
    if (res.success) {
      toast.success(`Database "${name}" deleted`);
      if (selectedDb === name) onSelectDb("");
      await load();
    } else {
      toast.error(res.error);
    }
    setSubmitting(false);
    return res.success;
  };

  return { databases, loading, submitting, load, handleCreate, handleRename, handleDelete };
}
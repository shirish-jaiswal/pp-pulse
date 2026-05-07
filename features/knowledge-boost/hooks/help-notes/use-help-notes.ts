import { fetchRows } from "@/lib/excel-engine/api-client";
import { useCallback, useEffect, useState } from "react";

export type HelpNote = {
  id: number;
  notes: string;
  topic?: string;
  priority?: number;
  created_at?: string;
  updated_at?: string;
};

export function useHelpNotes() {
  const [notes, setNotes] = useState<HelpNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      const res = await fetchRows(
        "knowledge_base",
        "help_notes"
      );

      if (res.success && Array.isArray(res.data.rows)) {
        setNotes(res.data.rows);
        setLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load help notes", err);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const getRandomNote = () => {
    if (!notes.length) return null;

    // optional: higher priority slightly preferred
    const sorted = [...notes].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    );

    return sorted[Math.floor(Math.random() * sorted.length)];
  };

  return {
    notes,
    loaded,
    getRandomNote,
  };
}
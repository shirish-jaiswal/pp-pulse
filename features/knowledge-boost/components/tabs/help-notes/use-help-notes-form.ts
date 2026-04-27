"use client";

import { useEffect, useState } from "react";
import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

export function useHelpNotesForm(open: boolean, editData: HelpNotes | null) {
  const [form, setForm] = useState<Partial<HelpNotes>>({
    notes: "",
    priority: 1,
  });

  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setEditId(editData.id as number);
    } else {
      setForm({ notes: "", priority: 1 });
      setEditId(null);
    }
  }, [editData, open]);

  return {
    form,
    setForm,
    editId,
    setEditId,
  };
}
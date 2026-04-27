"use client";

import { useMemo, useState } from "react";

import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

import { Button } from "@/components/ui/button";

import { HelpNotesSheet } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-sheet";

import { useGetAllHelpNotes } from "@/features/knowledge-boost/hooks/help-notes/use-get-help-notes";
import { useDeleteHelpNotes } from "@/features/knowledge-boost/hooks/help-notes/use-delete-help-notes";
import { useSaveHelpNotes } from "@/features/knowledge-boost/hooks/help-notes/use-save-help-notes";
import { HelpNotesDeleteDialog } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-delete-dialog";
import { HelpNotesList } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-list";
import { Input } from "@/components/ui/input";
export function HelpNotesTabs() {
  const { data = [], isLoading } = useGetAllHelpNotes();
  const saveMutation = useSaveHelpNotes();
  const deleteMutation = useDeleteHelpNotes();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<HelpNotes | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      item.notes?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleCreate = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (item: HelpNotes) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
    setDeleteId(null);
    setConfirmOpen(false);
  };

  const handleSave = (payload: HelpNotes, id?: number) => {
    saveMutation.mutate({ data: payload, id });
    setOpen(false);
    setEditData(null);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={handleCreate} size="sm">
          New Note
        </Button>
      </div>

      <HelpNotesList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <HelpNotesSheet
        open={open}
        setOpen={setOpen}
        editData={editData}
        onSave={handleSave}
      />

      <HelpNotesDeleteDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
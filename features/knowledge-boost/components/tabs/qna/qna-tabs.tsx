"use client";

import { useMemo, useState } from "react";

import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

import { useGetAllQna } from "@/features/knowledge-boost/hooks/qna/use-get-all-qna";
import { useSaveQna } from "@/features/knowledge-boost/hooks/qna/use-save-qna";
import { useDeleteQna } from "@/features/knowledge-boost/hooks/qna/use-delete-qna";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QnaSheet } from "@/features/knowledge-boost/components/tabs/qna/qna-sheet";
import { QnaDeleteDialog } from "@/features/knowledge-boost/components/tabs/qna/qna-delete-dialog";
import { QnaList } from "@/features/knowledge-boost/components/tabs/qna/qna-list";

export function QnaTabs() {
  const { data = [], isLoading } = useGetAllQna();
  const saveMutation = useSaveQna();
  const deleteMutation = useDeleteQna();

  const [open, setOpen] = useState(false);
  const [editQna, setEditQna] = useState<QNA | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      item.question?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleCreate = () => {
    setEditQna(null);
    setOpen(true);
  };

  const handleEdit = (item: QNA) => {
    setEditQna(item);
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

  const handleSave = (payload: QNA, id?: number) => {
    saveMutation.mutate({ data: payload, id });
    setOpen(false);
    setEditQna(null);
  };

  return (
    <div className="space-y-3">
      {/* Header (compact command bar) */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={handleCreate} size="sm">
          New QnA
        </Button>
      </div>

      {/* Main List */}
      <QnaList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* Side drawer (edit/create) */}
      <QnaSheet
        open={open}
        setOpen={setOpen}
        editData={editQna}
        onSave={handleSave}
      />

      {/* Lightweight confirm (less bulky than dialog) */}
      <QnaDeleteDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
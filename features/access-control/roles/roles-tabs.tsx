"use client";

import { useMemo, useState } from "react";

import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

import { useGetAllQna } from "@/features/knowledge-boost/hooks/qna/use-get-qna";
import { useSaveQna } from "@/features/knowledge-boost/hooks/qna/use-save-qna";
import { useDeleteQna } from "@/features/knowledge-boost/hooks/qna/use-delete-qna";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QnaSheet } from "@/features/knowledge-boost/components/tabs/qna/qna-sheet";
import { QnaDeleteDialog } from "@/features/knowledge-boost/components/tabs/qna/qna-delete-dialog";
import { QnaList } from "@/features/knowledge-boost/components/tabs/qna/qna-list";
import { useSaveRole } from "@/features/access-control/hooks/roles/use-save-roles";
import { useGetAllRoles } from "@/features/access-control/hooks/roles/use-roles";
import { useDeleteRole } from "@/features/access-control/hooks/roles/use-delete-role";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";
import { RoleDeleteDialog } from "./roles-delete-dialog";
import { RolesList } from "./roles-list";
import { RoleSheet } from "./role-sheet";

export function RolesTabs() {
  const { data = [], isLoading } = useGetAllRoles();
  const saveMutation = useSaveRole();
  const deleteMutation = useDeleteRole();

  const [open, setOpen] = useState(false);
  const [editQna, setEditQna] = useState<Roles | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleCreate = () => {
    setEditQna(null);
    setOpen(true);
  };

  const handleEdit = (item: Roles) => {
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

  const handleSave = (payload: Roles, id?: number) => {
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
          NEW ROLE
        </Button>
      </div>

      {/* Main List */}
      <RolesList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* Side drawer (edit/create) */}
      <RoleSheet
        open={open}
        setOpen={setOpen}
        editData={editQna}
        onSave={handleSave}
      />

      {/* Lightweight confirm (less bulky than dialog) */}
      <RoleDeleteDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";

import type { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FeatureListSheet } from "./feature-list-sheet";
import { useGetAllFeatureList } from "@/features/access-control/hooks/feature-list/use-feature-list";
import { useSaveFeatureList } from "@/features/access-control/hooks/feature-list/use-save-feature-list";
import { useDeleteFeatureList } from "@/features/access-control/hooks/feature-list/use-delete-feature-list";
import { FeatureList } from "./feature-list";
import { FeatureListDeleteDialog } from "./feature-list-delete-dialog";


export function FeatureListTabs() {
  const { data = [], isLoading } = useGetAllFeatureList();
  const saveMutation = useSaveFeatureList();
  const deleteMutation = useDeleteFeatureList();

  const [open, setOpen] = useState(false);
  const [editFeature, setEditFeature] =
    useState<FeatureListTemplate | null>(null);

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
    setEditFeature(null);
    setOpen(true);
  };

  const handleEdit = (item: FeatureListTemplate) => {
    setEditFeature(item);
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

  const handleSave = (payload: FeatureListTemplate, id?: number) => {
    saveMutation.mutate({ data: payload, id });
    setOpen(false);
    setEditFeature(null);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search features..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={handleCreate} size="sm">
          New Feature
        </Button>
      </div>

      {/* List */}
      <FeatureList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* Sheet */}
      <FeatureListSheet
        open={open}
        setOpen={setOpen}
        editData={editFeature}
        onSave={handleSave}
      />

      {/* Confirm Delete */}
      <FeatureListDeleteDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
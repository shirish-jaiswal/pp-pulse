"use client";

import { useMemo, useState } from "react";

import type { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ProfileSheet } from "./profile-sheet";
import { useSaveProfile } from "@/features/access-control/hooks/profile/use-save-profile";
import { useDeleteProfile } from "@/features/access-control/hooks/profile/use-delete-profile";

import { ProfileList } from "./profile-list";
import { useGetAllProfiles } from "@/features/access-control/hooks/profile/use-profile";
import { ProfileDeleteDialog } from "./profile-delete-dialog";

export function ProfileTabs() {
  const { data = [], isLoading } = useGetAllProfiles();
  const saveMutation = useSaveProfile();
  const deleteMutation = useDeleteProfile();

  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleCreate = () => {
    setEditProfile(null);
    setOpen(true);
  };

  const handleEdit = (item: Profile) => {
    setEditProfile(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
    setDeleteId(null);
    setConfirmOpen(false);
  };

  const handleSave = (payload: Profile, id?: number) => {
    saveMutation.mutate({ data: payload, id });
    setOpen(false);
    setEditProfile(null);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search profiles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={handleCreate} size="sm">
          New Profile
        </Button>
      </div>

      {/* List */}
      <ProfileList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* Sheet */}
      <ProfileSheet
        open={open}
        setOpen={setOpen}
        editData={editProfile}
        onSave={handleSave}
      />

      {/* Confirm Delete */}
      <ProfileDeleteDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
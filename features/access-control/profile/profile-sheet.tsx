"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import type { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

import { useProfileForm } from "./use-profile-form";
import { ProfileForm } from "./profile-form";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editData: Profile | null;
  onSave: (data: Profile, id?: number) => void;
};

export function ProfileSheet({
  open,
  setOpen,
  editData,
  onSave,
}: Props) {
  const { form, setForm, roleList, setRoleList, isEdit } =
    useProfileForm(editData, open);

  const handleSave = () => {
    const rolesString = roleList
      .map((r) => r.trim())
      .filter(Boolean)
      .join(",");

    const isEdit = !!editData?.id;

    const payload = {
      ...form,
      role: rolesString,
    };

    if (isEdit) {
      onSave(payload, editData.id); // UPDATE
    } else {
      onSave(payload); // CREATE
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-125 flex flex-col gap-0 p-4">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Update Profile" : "Create Profile"}
          </SheetTitle>

          <SheetDescription>
            Manage user profile information
          </SheetDescription>
        </SheetHeader>

        <ProfileForm
          form={form}
          setForm={setForm}
          roleList={roleList}
          setRoleList={setRoleList}
          onSave={handleSave}
          isEdit={isEdit}
        />
      </SheetContent>
    </Sheet>
  );
}
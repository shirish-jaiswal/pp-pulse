"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/excel-engine/rbac/profile/get-all";

export function useProfileForm(
  editData: Profile | null,
  open: boolean
) {
  const [form, setForm] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    settings: "",
  } as Profile);

  const [roleList, setRoleList] = useState<string[]>([]);

  const isEdit = !!editData?.id;

  useEffect(() => {
    if (!open) return;

    if (editData) {
      const parsedRoles = editData.role
        ? editData.role.split(",").map((r) => r.trim()).filter(Boolean)
        : [];

      setRoleList(parsedRoles);

      setForm({
        ...editData,
        role: parsedRoles.join(", "), // normalize
      });
    } else {
      setRoleList([]);

      setForm({
        name: "",
        email: "",
        role: "",
        settings: "",
      } as Profile);
    }
  }, [editData, open]);

  return {
    form,
    setForm,
    roleList,
    setRoleList,
    isEdit,
  };
}
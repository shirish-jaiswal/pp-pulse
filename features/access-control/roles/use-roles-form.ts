"use client";

import { useEffect, useState } from "react";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";

export function useRoleForm(editData: Roles | null, open: boolean) {
  const [form, setForm] = useState<Roles>({
    title: "",
  } as Roles);

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm(editData);

    } else {
      setForm({
        title: "",
      } as Roles);

    }
  }, [editData, open]);


  return {
    form,
    setForm,
    isEdit,
  };
}
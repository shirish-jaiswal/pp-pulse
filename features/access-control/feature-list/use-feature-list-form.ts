"use client";

import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import { useEffect, useState } from "react";

export function useFeatureListForm(editData: FeatureListTemplate | null, open: boolean) {
  const [form, setForm] = useState<FeatureListTemplate>({
    title: "",
    icon: "",
    path: "",
    group: "",
    roles: ""
  } as FeatureListTemplate);

  const [roleList, setRoleList] = useState<string[]>([]);

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm(editData);

      const parsedOptions = editData.roles
        ? editData.roles.split(",").map((o) => o.trim())
        : [];

      setRoleList(parsedOptions);
    } else {
      setForm({
        title: "",
        icon: "",
        path: "",
        group: "",
        roles: ""
      } as FeatureListTemplate);

      setRoleList([]);
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
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";

type Props = {
  form: Roles;
  setForm: (v: Roles) => void;

  onSave: () => void;
  isEdit: boolean;
};

export function RolesForm({
  form,
  setForm,
  onSave,
  isEdit,
}: Props) {

  return (
    <div className="mt-4 space-y-4">
      {/* QUESTION */}
      <Textarea
        placeholder="Question"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* SAVE */}
      <Button className="w-full" onClick={onSave}>
        {isEdit ? "Update" : "Create"}
      </Button>
    </div>
  );
}
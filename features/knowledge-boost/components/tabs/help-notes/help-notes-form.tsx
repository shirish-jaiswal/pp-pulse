"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

type Props = {
  form: Partial<HelpNotes>;
  setForm: (v: Partial<HelpNotes>) => void;
  onSave: (form: Partial<HelpNotes>) => void;
  isEdit: boolean;
  isLoading?: boolean;
};

export function HelpNotesForm({
  form,
  setForm,
  onSave,
  isEdit,
  isLoading,
}: Props) {
  return (
    <div className="mt-4 space-y-4">
      {/* NOTES */}
      <Input
        placeholder="Note text"
        value={form.notes ?? ""}
        onChange={(e) =>
          setForm({ ...form, notes: e.target.value })
        }
      />

      {/* PRIORITY */}
      <Input
        type="number"
        placeholder="Priority"
        value={form.priority ?? 1}
        onChange={(e) =>
          setForm({
            ...form,
            priority: Number(e.target.value),
          })
        }
      />

      {/* SUBMIT */}
      <Button
        className="w-full"
        onClick={() => onSave(form)}
        disabled={isLoading}
      >
        {isEdit ? "Update" : "Create"}
      </Button>
    </div>
  );
}
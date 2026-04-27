"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import type { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

import { HelpNotesForm } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-form";
import { useHelpNotesForm } from "@/features/knowledge-boost/components/tabs/help-notes/use-help-notes-form";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editData: HelpNotes | null;
  onSave: (data: HelpNotes, id?: number) => void;
};

export function HelpNotesSheet({
  open,
  setOpen,
  editData,
  onSave,
}: Props) {
  const { form, setForm, editId } = useHelpNotesForm(open, editData);

  const handleSave = () => {
    onSave(form as HelpNotes, editId as number);
  };

  const isEdit = !!editId;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-125 flex flex-col gap-0 p-4">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Update Help Note" : "Create Help Note"}
          </SheetTitle>

          <SheetDescription>
            Add or update help notes used in the system.
          </SheetDescription>
        </SheetHeader>

        <HelpNotesForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          isEdit={isEdit}
        />
      </SheetContent>
    </Sheet>
  );
}
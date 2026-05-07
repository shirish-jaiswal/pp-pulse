"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Roles } from "@/lib/excel-engine/rbac/roles/get-all";
import { RolesForm } from "./roles-form";
import { useRoleForm } from "./use-roles-form";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editData: Roles | null;
  onSave: (data: Roles, id?: number) => void;
};

export function RoleSheet({
  open,
  setOpen,
  editData,
  onSave,
}: Props) {
  const {
    form,
    setForm,
    isEdit,
  } = useRoleForm(editData, open);

  const handleSave = () => {
    onSave(
      {
        ...form,
      },
      editData?.id
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-125 flex flex-col gap-0 p-4">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Update Q&A" : "Create Q&A"}
          </SheetTitle>
          <SheetDescription>
            Manage question-answer pairs
          </SheetDescription>
        </SheetHeader>

        <RolesForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          isEdit={isEdit}
        />
      </SheetContent>
    </Sheet>
  );
}
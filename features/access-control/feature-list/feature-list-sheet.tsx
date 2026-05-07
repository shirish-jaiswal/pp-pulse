"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FeatureListTemplate } from "@/lib/excel-engine/rbac/feature-list/get-all";
import { FeatureListForm } from "./feature-list-form";
import { useFeatureListForm } from "./use-feature-list-form";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editData: FeatureListTemplate | null;
  onSave: (data: FeatureListTemplate, id?: number) => void;
};

export function FeatureListSheet({
  open,
  setOpen,
  editData,
  onSave,
}: Props) {
  const {
    form,
    setForm,
    roleList,
    setRoleList,
    isEdit,
  } = useFeatureListForm(editData, open);

  const handleSave = () => {

    const optionsString = roleList
      .map((o) => o.trim())
      .filter(Boolean)
      .join(",");

    onSave(
      {
        ...form,
        roles: optionsString,
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

        <FeatureListForm
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
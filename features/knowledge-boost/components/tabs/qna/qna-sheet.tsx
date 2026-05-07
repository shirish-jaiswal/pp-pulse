"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

import { useQnaForm } from "./use-qna-form";
import { QnaForm } from "./qna-form";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editData: QNA | null;
  onSave: (data: QNA, id?: number) => void;
};

export function QnaSheet({
  open,
  setOpen,
  editData,
  onSave,
}: Props) {
  const {
    form,
    setForm,
    optionsList,
    setOptionsList,
    isEdit,
  } = useQnaForm(editData, open);

  const handleSave = () => {
    if (!optionsList.includes(form.answer)) {
      alert("Please select a valid answer");
      return;
    }

    const optionsString = optionsList
      .map((o) => o.trim())
      .filter(Boolean)
      .join(",");

    onSave(
      {
        ...form,
        options: optionsString,
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

        <QnaForm
          form={form}
          setForm={setForm}
          optionsList={optionsList}
          setOptionsList={setOptionsList}
          onSave={handleSave}
          isEdit={isEdit}
        />
      </SheetContent>
    </Sheet>
  );
}
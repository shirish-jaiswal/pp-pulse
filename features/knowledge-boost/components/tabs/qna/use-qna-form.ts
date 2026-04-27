"use client";

import { useEffect, useState } from "react";
import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

export function useQnaForm(editData: QNA | null, open: boolean) {
  const [form, setForm] = useState<QNA>({
    question: "",
    answer: "",
    options: "",
    priority: 1,
  } as QNA);

  const [optionsList, setOptionsList] = useState<string[]>([]);

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm(editData);

      const parsedOptions = editData.options
        ? editData.options.split(",").map((o) => o.trim())
        : [];

      setOptionsList(parsedOptions);
    } else {
      setForm({
        question: "",
        answer: "",
        options: "",
        priority: 1,
      } as QNA);

      setOptionsList([]);
    }
  }, [editData, open]);

  useEffect(() => {
    if (!optionsList.includes(form.answer)) {
      setForm((prev) => ({
        ...prev,
        answer: optionsList[0] || "",
      }));
    }
  }, [optionsList]);

  return {
    form,
    setForm,
    optionsList,
    setOptionsList,
    isEdit,
  };
}
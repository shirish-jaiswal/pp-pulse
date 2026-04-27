"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

type Props = {
  form: QNA;
  setForm: (v: QNA) => void;

  optionsList: string[];
  setOptionsList: (v: string[]) => void;

  onSave: () => void;
  isEdit: boolean;
};

export function QnaForm({
  form,
  setForm,
  optionsList,
  setOptionsList,
  onSave,
  isEdit,
}: Props) {
  const updateOption = (index: number, value: string) => {
    const copy = [...optionsList];
    copy[index] = value;
    setOptionsList(copy);
  };

  const removeOption = (index: number) => {
    const updated = optionsList.filter((_, i) => i !== index);
    setOptionsList(updated.length ? updated : [""]);
  };

  return (
    <div className="mt-4 space-y-4">
      {/* QUESTION */}
      <Textarea
        placeholder="Question"
        value={form.question}
        onChange={(e) =>
          setForm({ ...form, question: e.target.value })
        }
      />

      {/* OPTIONS + ANSWER */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-sm">Options</p>

          <Button
            size="sm"
            onClick={() => setOptionsList([...optionsList, ""])}
          >
            + Add
          </Button>
        </div>

        {optionsList.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* RADIO (ANSWER) */}
            <input
              type="radio"
              name="answer"
              checked={form.answer === opt}
              onChange={() =>
                setForm({ ...form, answer: opt })
              }
            />

            {/* OPTION INPUT */}
            <Input
              value={opt}
              placeholder={`Option ${i + 1}`}
              onChange={(e) =>
                updateOption(i, e.target.value)
              }
            />

            {/* DELETE */}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeOption(i)}
            >
              ✕
            </Button>
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Select the correct answer using the radio button
        </p>
      </div>

      {/* PRIORITY */}
      <Input
        type="number"
        value={form.priority}
        onChange={(e) =>
          setForm({
            ...form,
            priority: Number(e.target.value),
          })
        }
      />

      {/* SAVE */}
      <Button className="w-full" onClick={onSave}>
        {isEdit ? "Update" : "Create"}
      </Button>
    </div>
  );
}
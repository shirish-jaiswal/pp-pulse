"use client";

import * as React from "react";

import type { QNA } from "@/lib/excel-engine/knowledge-base/qna/get-all";

import { Button } from "@/components/ui/button";

import { QnaTable } from "./qna-table";
import { getQnaColumns } from "./qna-columns";

type Props = {
  data: QNA[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: QNA) => void;
  onDelete: (id: number) => void;
};

export function QnaList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getQnaColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">Q&A Knowledge Base</div>
      </div>

      <QnaTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        colSpan={4}
      />
    </div>
  );
}
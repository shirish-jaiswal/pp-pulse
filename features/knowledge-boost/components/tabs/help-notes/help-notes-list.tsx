import React from "react";
import { getHelpNotesColumns } from "./columns";
import { QnaTable } from "@/features/knowledge-boost/components/tabs/qna/qna-table";
import { HelpNotes } from "@/lib/excel-engine/knowledge-base/help-notes/get-all";

type Props = {
  data: HelpNotes[];
  isLoading: boolean;
  onEdit: (item: HelpNotes) => void;
  onDelete: (id: number) => void;
};

export function HelpNotesList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns = React.useMemo(
    () => getHelpNotesColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="text-sm font-semibold">
          Help Notes
        </div>
      </div>

      <QnaTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        colSpan={3}
      />
    </div>
  );
}
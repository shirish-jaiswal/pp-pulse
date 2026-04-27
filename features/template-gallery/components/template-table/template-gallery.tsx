"use client";

import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/resolution/get-all";
import { getColumns } from "@/features/template-gallery/components/template-table/columns";
import { TemplateGalleryTable } from "@/features/template-gallery/components/template-table/template-gallery-table";

interface TemplateGalleryProps {
  data: ResolutionTemplate[];
  onEdit: (res: ResolutionTemplate) => void;
}

export function TemplateGallery({
  data,
  onEdit,
}: TemplateGalleryProps) {
  const columns = getColumns({ onEdit });

  return (
    <TemplateGalleryTable
      data={data}
      columns={columns}
    />
  );
}
"use client";

import { useState, useMemo } from "react";
import ResolutionTemplateSearch from "@/features/resolution-template/components/resolution-template-search";
import ResolutionTableSkeleton from "@/features/resolution-template/components/resolution-table-skeleton";
import NoTemplates from "@/features/resolution-template/components/no-templates";
import { TemplateGallery } from "@/features/template-gallery/components/template-table/template-gallery";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/resolution/get-all";
import { useResolutionTemplates } from "@/hooks/excel-db/use-resolution-templates";
import { TemplateEditorWrapper } from "@/features/template-gallery/template-editor-wrapper";

export default function ResolutionTemplateManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingResolution, setEditingResolution] = useState<ResolutionTemplate | null>(null);

  const { data: resolutions = [], isLoading: loading, refetch } = useResolutionTemplates();

  const openEdit = (res: ResolutionTemplate) => {
    setEditingResolution(res);
    setIsDialogOpen(true);
  };

  const filtered = useMemo(() => {
    return resolutions.filter(res =>
      [res.title, res.game, res.category, res.subcategory]
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [resolutions, searchTerm]);

  return (
    <div className="mx-auto h-[calc(100vh-64px)] flex flex-col gap-1">
      <ResolutionTemplateSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showCreate={false}
      />

      <div className="flex-1 border rounded-xl max-h-[calc(100vh-120px)] overflow-hidden bg-card shadow-sm">
        {loading ? (
          <ResolutionTableSkeleton />
        ) : filtered.length === 0 ? (
          <NoTemplates onCreate={() => setIsDialogOpen(true)} />
        ) : (
          <TemplateGallery
            data={filtered}
            onEdit={openEdit}
          />
        )}
      </div>

      <TemplateEditorWrapper
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingResolution(null);
        }}
        initialData={editingResolution}
      />
    </div>
  );
}
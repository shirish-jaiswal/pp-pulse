"use client";

import { useState, useMemo } from "react";
import ResolutionTemplateSearch from "@/features/resolution-template/components/resolution-template-search";
import ResolutionTableSkeleton from "@/features/resolution-template/components/resolution-table-skeleton";
import NoTemplates from "@/features/resolution-template/components/no-templates";
import { ResolutionTable } from "@/features/resolution-template/components/resolution-table";
import { ResolutionSheet } from "@/features/resolution-template/components/form/resolution-sheet";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get";
import { useResolutionTemplates } from "@/hooks/excel-db/use-resolution-templates";
import { useDeleteResolution } from "@/features/resolution-template/hooks/use-delete-resolution-template";
import { useSaveResolution } from "@/features/resolution-template/hooks/use-save-resolution-template";
import { toast } from "sonner";


export default function ResolutionTemplateManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingResolution, setEditingResolution] = useState<ResolutionTemplate | null>(null);

  const { data: resolutions = [], isLoading: loading, refetch } = useResolutionTemplates();
  const deleteMutation = useDeleteResolution();
  const saveMutation = useSaveResolution();

  const handleSave = async (data: ResolutionTemplate): Promise<void> => {
    try {
      await saveMutation.mutateAsync({
        data,
        id: editingResolution?.id || null
      });
      setIsDialogOpen(false);
      setEditingResolution(null);
    } catch {
      toast.error("Failed to save resolution.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id);
    }
  };

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
        onCreate={() => setIsDialogOpen(true)}
      />

      <div className="flex-1 border rounded-xl max-h-[calc(100vh-120px)] overflow-hidden bg-card shadow-sm">
        {loading ? (
          <ResolutionTableSkeleton />
        ) : filtered.length === 0 ? (
          <NoTemplates onCreate={() => setIsDialogOpen(true)} />
        ) : (
          <ResolutionTable
            data={filtered}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ResolutionSheet
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingResolution(null);
        }}
        initialData={editingResolution}
        onSave={handleSave}
      />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Resolution } from "@/features/resolution-template/types/types";
import ResolutionTemplateSearch from "@/features/resolution-template/components/resolution-template-search";
import ResolutionTableSkeleton from "@/features/resolution-template/components/resolution-table-skeleton";
import NoTemplates from "@/features/resolution-template/components/no-templates";
import { ResolutionTable } from "@/features/resolution-template/components/resolution-table";
import { ResolutionSheet } from "@/features/resolution-template/components/form/resolution-sheet";
import { deleteResolutionAction } from "@/lib/excel-engine/resolution-template/delete";
import { getResolutionsAction } from "@/lib/excel-engine/resolution-template/get";


export default function ResolutionTemplateManager() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getResolutionsAction();
      setResolutions(data); 
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Resolution>): Promise<void> => {
    const { saveResolutionAction } = await import("@/lib/excel-engine/resolution-template/save");
    try {
      await saveResolutionAction(data as any, editingResolution?.id || null);
      setIsDialogOpen(false);
      fetchData();
    } catch {
      alert("Failed to save resolution.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this template?")) {
      await deleteResolutionAction(id);
      fetchData();
    }
  };

  const openEdit = (res: Resolution) => {
    setEditingResolution(res);
    setIsDialogOpen(true);
  };

  const filtered = resolutions.filter(
    (res) =>
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
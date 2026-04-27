"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoTemplatesProps {
  onCreate: () => void;
}

export default function NoTemplates({ onCreate }: NoTemplatesProps) {
  return (
    <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-center px-6">
      <div className="p-4 rounded-full bg-muted mb-4">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No templates found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your search or create a new template.
      </p>
      <Button className="mt-4 gap-2" onClick={onCreate}>
        <Plus className="w-4 h-4" />
        Create Template
      </Button>
    </div>
  );
}
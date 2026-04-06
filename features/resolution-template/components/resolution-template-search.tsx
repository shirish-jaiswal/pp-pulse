"use client";


import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResolutionTemplateSearchProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onCreate: () => void;
}

export default function ResolutionTemplateSearch({
  searchTerm,
  setSearchTerm,
  onCreate,
}: ResolutionTemplateSearchProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 border rounded-lg px-3 w-full bg-background shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by game or category..."
          className="border-none bg-transparent focus-visible:ring-0 shadow-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button className="gap-2" onClick={onCreate}>
        <Plus className="w-4 h-4" />
        New Template
      </Button>
    </div>
  );
}
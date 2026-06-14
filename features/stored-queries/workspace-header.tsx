"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  onInitiateEntry: () => void;
}

export function WorkspaceHeader({
  searchInput,
  setSearchInput,
  onSearch,
  onInitiateEntry,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4">
      <div>
        <h1 className="text-base font-bold tracking-tight uppercase">Stored System Queries</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage dashboard matrices with dynamic template constraints
        </p>
      </div>

      <div className="flex gap-2 items-center w-full sm:w-auto">
        <Input
          type="text"
          placeholder="Filter by structural keys..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-full sm:w-64 h-9 text-xs"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={onSearch}
          className="whitespace-nowrap text-xs h-9 px-3"
        >
          Search
        </Button>
        <Button
          onClick={onInitiateEntry}
          size="sm"
          className="whitespace-nowrap text-xs gap-1 h-9 ml-2"
        >
          <Plus className="h-3 w-3" /> Initiate Entry
        </Button>
      </div>
    </header>
  );
}
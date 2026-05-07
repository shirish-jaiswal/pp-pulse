"use client";

import { useState } from "react";
import { Columns, X, RotateCcw, CheckSquare } from "lucide-react";
import { cn } from "@/utils/cn";

export function LogSidebar({
  sidebarKeys,
  visibleColumns,
  setVisibleColumns,
  activeTab,
  resetToDefault,
}: any) {
  const [search, setSearch] = useState("");

  const normalizedSearch = search.toLowerCase();

  const filteredKeys = sidebarKeys.filter((key: string) =>
    key.toLowerCase().includes(normalizedSearch)
  );

  const selectedKeys = filteredKeys.filter((key: string) =>
    visibleColumns.includes(key)
  );

  const unselectedKeys = filteredKeys.filter(
    (key: string) => !visibleColumns.includes(key)
  );

  const isSelected = (key: string) =>
    visibleColumns.includes(key);

  /**
   * Toggle single field
   */
  const toggleKey = (key: string) => {
    const next = isSelected(key)
      ? visibleColumns.filter((k: string) => k !== key)
      : [...visibleColumns, key];

    setVisibleColumns(next);
  };

  /**
   * Remove selected
   */
  const clearAllSelected = () => {
    const next = visibleColumns.filter(
      (k: string) => !selectedKeys.includes(k)
    );

    setVisibleColumns(next);
  };

  /**
   * Select all available
   */
  const selectAllAvailable = () => {
    const next = Array.from(
      new Set([...visibleColumns, ...unselectedKeys])
    );

    setVisibleColumns(next);
  };

  const renderItem = (key: string) => (
    <label
      key={key}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-muted/60 transition",
        isSelected(key) && "bg-background"
      )}
    >
      <input
        type="checkbox"
        checked={isSelected(key)}
        onChange={() => toggleKey(key)}
        className="w-3 h-3"
      />

      <span className="truncate text-xs text-foreground/80">
        {key.replace("raw.app.", "")}
      </span>
    </label>
  );

  return (
    <aside className="w-48 border-r border-border bg-muted/40 flex flex-col">
      {/* HEADER */}
      <div className="h-10 flex items-center gap-2 px-2 border-b border-border">
        <Columns className="w-3 h-3 text-muted-foreground" />

        <div className="flex items-center flex-1 bg-background border border-border rounded px-2 py-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields..."
            className="w-full bg-transparent outline-none text-xs text-foreground"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {/* SELECTED */}
        {selectedKeys.length > 0 && (
          <div>
            <div className="px-3 py-1 text-[10px] uppercase text-muted-foreground flex items-center justify-between">
              <span>Selected</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefault}
                  className="text-muted-foreground hover:text-foreground"
                  title="Reset to default"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                <button
                  onClick={clearAllSelected}
                  className="text-muted-foreground hover:text-foreground"
                  title="Deselect all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {selectedKeys.map(renderItem)}
          </div>
        )}

        {/* AVAILABLE */}
        {unselectedKeys.length > 0 && (
          <div>
            {selectedKeys.length > 0 && (
              <div className="mt-2 border-t border-border" />
            )}

            <div className="px-3 py-1 text-[10px] uppercase text-muted-foreground flex items-center justify-between">
              <span>Available</span>

              <button
                onClick={selectAllAvailable}
                className="text-muted-foreground hover:text-foreground"
                title="Select all available"
              >
                <CheckSquare className="w-3 h-3" />
              </button>
            </div>

            {unselectedKeys.map(renderItem)}
          </div>
        )}

        {filteredKeys.length === 0 && (
          <div className="text-xs text-muted-foreground p-3">
            No fields found
          </div>
        )}
      </div>
    </aside>
  );
}
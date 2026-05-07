"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table";

import { useState, useEffect } from "react";

export function useDataTable({ data, columns }: any) {
  // Guard to prevent saving default state over local storage on initial mount
  const [hasHydrated, setHasHydrated] = useState(false);

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "time", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [compact, setCompact] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // ---------------- 1. LOAD SETTINGS ----------------
  // This runs once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("table-settings");
      if (saved) {
        const parsed = JSON.parse(saved);

        // Apply saved settings to state
        if (parsed.sorting) setSorting(parsed.sorting);
        if (parsed.columnFilters) setColumnFilters(parsed.columnFilters);
        if (parsed.columnVisibility) setColumnVisibility(parsed.columnVisibility);
        if (parsed.pageSize) {
          setPagination((prev) => ({
            ...prev,
            pageSize: parsed.pageSize,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load table settings:", error);
    } finally {
      // Logic complete, allow the "Save" effect to track changes now
      setHasHydrated(true);
    }
  }, []);

  // ---------------- 2. SAVE SETTINGS ----------------
  // This runs whenever table state changes, but ONLY after initial load
  useEffect(() => {
    if (!hasHydrated) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        "table-settings",
        JSON.stringify({
          sorting,
          columnFilters,
          columnVisibility,
          pageSize: pagination.pageSize,
        })
      );
    }, 500); // Debounce saves to prevent excessive IO

    return () => clearTimeout(timeoutId);
  }, [sorting, columnFilters, columnVisibility, pagination.pageSize, hasHydrated]);

  // ---------------- 3. TABLE INSTANCE ----------------
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination,
    },

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),

    getRowId: (row: any) => row.roundId || row.id,
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    compact,
    setCompact,
  };
}
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

import { useState, useEffect, useMemo } from "react";

export function useDataTable({ data, columns }: any) {
  // Prevent saving before hydration completes
  const [hasHydrated, setHasHydrated] = useState(false);

  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "time", desc: true },
  ]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({});

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});

  // 1. Initial local state definitions
  const [compact, setCompact] = useState<boolean>(false);

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  // -----------------------------
  // Stable references
  // -----------------------------
  const memoData = useMemo(() => data, [data]);
  const memoColumns = useMemo(() => columns, [columns]);

  // -----------------------------
  // Load settings
  // -----------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("table-settings");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.sorting) {
          setSorting(parsed.sorting);
        }

        if (parsed.columnFilters) {
          setColumnFilters(parsed.columnFilters);
        }

        if (parsed.columnVisibility) {
          setColumnVisibility(parsed.columnVisibility);
        }

        // 2. Hydrate compact preference
        if (typeof parsed.compact === "boolean") {
          setCompact(parsed.compact);
        }

        // 3. Hydrate full pagination instead of just pageSize
        if (parsed.pagination) {
          setPagination(parsed.pagination);
        } else if (parsed.pageSize) {
          // Fallback backward-compatibility check if user previously only had pageSize saved
          setPagination((prev) => ({
            ...prev,
            pageSize: parsed.pageSize,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load table settings:", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // -----------------------------
  // Save settings (Debounced)
  // -----------------------------
  useEffect(() => {
    if (!hasHydrated) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(
          "table-settings",
          JSON.stringify({
            sorting,
            columnFilters,
            columnVisibility,
            compact,
            pagination,
          })
        );
      } catch (error) {
        console.error("Failed to save table settings:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    sorting,
    columnFilters,
    columnVisibility,
    compact,
    pagination,
    hasHydrated,
  ]);

  // -----------------------------
  // Table instance
  // -----------------------------
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,

    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination,
    },

    enableRowSelection: true,

    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
    },

    onSortingChange: (updater) => {
      setSorting(updater);
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater);
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
    },
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility(updater);
    },
    onPaginationChange: (updater) => {
      setPagination(updater);
    },
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
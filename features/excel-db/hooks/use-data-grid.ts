import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { fetchRows, insertRow, updateRow, deleteRow } from "@/lib/excel-engine/api-client";

const PAGE_SIZE = 10;

export function useDataGrid(dbName: string, tableName: string) {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!dbName || !tableName) return;
    setLoading(true);
    try {
      const res = await fetchRows(dbName, tableName);
      if (res.success) {
        setRows(res.data.rows);
        setColumns(res.data.columns);
        setPage(1);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [dbName, tableName]);

  useEffect(() => { load(); }, [load]);

  const filteredRows = useMemo(() => 
    rows.filter((row) =>
      search ? Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase())) : true
    ), [rows, search]
  );

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleInsert = async (data: any) => {
    setSubmitting(true);
    const res = await insertRow(dbName, tableName, data);
    if (res.success) { toast.success("Row inserted"); await load(); }
    else { toast.error(res.error); }
    setSubmitting(false);
    return res.success;
  };

  const handleUpdate = async (id: number, data: any) => {
    setSubmitting(true);
    const res = await updateRow(dbName, tableName, id, data);
    if (res.success) { toast.success("Row updated"); await load(); }
    else { toast.error(res.error); }
    setSubmitting(false);
    return res.success;
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    const res = await deleteRow(dbName, tableName, id);
    if (res.success) { toast.success("Row deleted"); await load(); }
    else { toast.error(res.error); }
    setSubmitting(false);
    return res.success;
  };

  const handleExport = useCallback(() => {
    if (!rows.length || !columns.length) {
      toast.error("No data available to export");
      return;
    }

    try {
      const header = columns.join(",");
      const body = rows
        .map((row) => 
          columns.map((col) => {
            const cell = row[col] ?? "";
            // Escape quotes and wrap in quotes to handle commas within data
            return `"${String(cell).replace(/"/g, '""')}"`;
          }).join(",")
        )
        .join("\n");

      const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${tableName}_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Export started");
    } catch (error) {
      toast.error("Export failed");
      console.error(error);
    }
  }, [rows, columns, tableName]);

  return {
    rows, columns, loading, search, setSearch, page, setPage, 
    pagedRows, totalPages, filteredCount: filteredRows.length,
    submitting, load, handleInsert, handleUpdate, handleDelete, 
    handleExport,
  };
}
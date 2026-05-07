export function calculateTotals(rows: any[]) {
  const totalPlaced = rows.reduce(
    (sum, row) => sum + (row.original.totalPlaced ?? 0),
    0
  );

  const totalSettled = rows.reduce(
    (sum, row) => sum + (row.original.totalSettled ?? 0),
    0
  );

  return {
    totalPlaced,
    totalSettled,
    netResult: totalSettled - totalPlaced,
  };
}

export function exportTableCSV(table: any) {
  const rows = table.getFilteredRowModel().rows;

  const visibleColumns = table
    .getAllLeafColumns()
    .filter((col: any) => col.getIsVisible());

  const headers = visibleColumns.map((col: any) =>
    typeof col.columnDef.header === "string"
      ? col.columnDef.header
      : col.id
  );

  const csvRows = rows.map((row: any) =>
    visibleColumns.map((col: any) => {
      const value = row.original[col.id];

      if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`;
      }

      return value ?? "";
    })
  );

  const csvContent = [
    headers.join(","),
    ...csvRows.map((r: any) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "table.csv";
  a.click();
}
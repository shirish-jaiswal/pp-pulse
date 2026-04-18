"use client";

import { useState } from "react";
import { DatabaseManager } from "@/features/excel-db/components/database-manager";
import { TableManager } from "@/features/excel-db/components/table-manager";
import { DataGrid } from "@/features/excel-db/components/data-grid";
import { FileSpreadsheet } from "lucide-react";
import DownloadDb from "@/features/excel-db/components/actions/download-db";
import { UploadDb } from "@/features/excel-db/components/actions/upload-db";
export default function ExcelDBPage() {
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const handleSelectDb = (name: string) => {
    setSelectedDb(name);
    setSelectedTable("");
  };

  return (
    <div className="flex flex-col w-[calc(100vw-240px)] min-h-dvh bg-background text-foreground">

      {/* HEADER */}
      <header className="flex h-8 items-center justify-between border-b border-border px-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-semibold truncate">
            ExcelDB
          </span>

          {selectedDb && (
            <span className="text-[11px] text-muted-foreground truncate">
              / {selectedDb}
              {selectedTable && ` / ${selectedTable}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <DownloadDb />
          <UploadDb />
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* DB SIDEBAR */}
        <aside className="w-44 shrink-0 border-r border-border flex flex-col min-h-0 overflow-y-auto">
          <DatabaseManager
            selectedDb={selectedDb}
            onSelectDb={handleSelectDb}
          />
        </aside>

        {/* TABLE SIDEBAR */}
        <aside className="w-44 shrink-0 border-r border-border flex flex-col min-h-0 overflow-y-auto">
          <TableManager
            dbName={selectedDb}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
          />
        </aside>

        {/* DATA GRID */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <DataGrid
            dbName={selectedDb}
            tableName={selectedTable}
          />
        </main>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { DatabaseManager } from "@/features/excel-db/components/database-manager";
import { TableManager } from "@/features/excel-db/components/table-manager";
import { DataGrid } from "@/features/excel-db/components/data-grid";
import { FileSpreadsheet, ChevronRight } from "lucide-react";

export default function ExcelDBPage() {
  const [selectedDb, setSelectedDb] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");

  const handleSelectDb = (name: string) => {
    setSelectedDb(name);
    setSelectedTable("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-px)] bg-background text-foreground overflow-hidden">

      <header className="flex items-center gap-3 px-4 h-12 border-b border-border shrink-0 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1">
            <FileSpreadsheet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight">ExcelDB</span>
          <span className="text-muted-foreground/40 text-xs font-medium">Admin</span>
        </div>
        {/* Breadcrumb */}
        {selectedDb && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
            <ChevronRight className="h-3.5 w-3.5" />
            <span className={selectedTable ? "text-foreground/70" : "text-foreground font-medium"}>
              {selectedDb}
            </span>
            {selectedTable && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium">{selectedTable}</span>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar: Databases */}
        <aside className="w-52 shrink-0 border-r border-border bg-background flex flex-col min-h-0 overflow-hidden">
          <DatabaseManager selectedDb={selectedDb} onSelectDb={handleSelectDb} />
        </aside>

        {/* Sidebar: Tables */}
        <aside className="w-52 shrink-0 border-r border-border bg-muted/20 flex flex-col min-h-0 overflow-hidden">
          <TableManager
            dbName={selectedDb}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
          />
        </aside>

        {/* Main: Data Grid */}
        <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden bg-background w-[calc(100vw-52rem)]">
          <DataGrid dbName={selectedDb} tableName={selectedTable} />
        </main>
      </div>
    </div>
  );
}

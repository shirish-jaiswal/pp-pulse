"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoleTable from "./role-tab-content";
import { useTableManager } from "./hooks/use-table-manager";
import FeatureTable from "./FeatureTable";

// helper to convert snake_case or camelCase to Regular Case
function formatTableName(name: string) {
  if (!name) return "";

  const ACRONYMS = ["API", "ID", "URL", "HTTP", "HTTPS", "SQL"];

  let formatted = name.replace(/_/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");

  return formatted
    .split(" ")
    .map((word) => {
      const upper = word.toUpperCase();

      if (
        ACRONYMS.includes(upper) ||
        ACRONYMS.includes(upper.replace(/S$/, ""))
      ) {
        return upper;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// map table name -> component
const tableComponentMap: Record<string, React.FC<any>> = {
  roles: RoleTable,
  feature_list: FeatureTable,
};

export default function TableTabs({ dbName }: { dbName: string }) {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [newTableName, setNewTableName] = useState("");

  const { tables, loading } = useTableManager(
    dbName,
    selectedTable,
    setSelectedTable
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading tables...</div>
      ) : (
        <Tabs value={selectedTable} onValueChange={setSelectedTable}>
          <TabsList className="flex flex-wrap gap-2">
            {tables.map((table) => (
              <TabsTrigger key={table.name} value={table.name}>
                {formatTableName(table.name)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tables.map((table) => {
            const TableComponent = tableComponentMap[table.name];

            return (
              <TabsContent key={table.name} value={table.name}>
                <div className="p-4 border rounded-2xl shadow-sm space-y-4">
                    <div className="font-semibold">
                      {formatTableName(table.name)}
                    </div>
                                <div>{table.name} </div>

                  {TableComponent ? (
                    <TableComponent
                      dbName={dbName}
                      tableName={table.name}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No UI defined for this table
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

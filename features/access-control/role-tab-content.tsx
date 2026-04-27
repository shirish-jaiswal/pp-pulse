"use client";

import { useState } from "react";
import { useDataManager } from "./hooks/use-data-manager";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoleSheet } from "./create-role";

export default function RoleTable({
  dbName,
  tableName,
}: {
  dbName: string;
  tableName: string;
}) {
  const { pagedRows, loading, handleUpdate, handleDelete } = useDataManager(
    dbName,
    tableName
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (role: any) => {
    setEditingId(role.id);
    setEditValue(role.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (id: number) => {
    await handleUpdate(id, { title: editValue });
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-4">

      {/* LOADING */}
      {loading ? (
        <div className="text-sm text-muted-foreground">
          Loading roles...
        </div>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagedRows.map((role: any) => (
                <TableRow key={role.id}>
                  {/* ROLE NAME */}
                  <TableCell className="font-medium">
                    {editingId === role.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 w-[220px]"
                      />
                    ) : (
                      role.title
                    )}
                  </TableCell>

                  {/* ID */}
                  <TableCell className="text-muted-foreground text-sm">
                    {role.id}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right space-x-2">
                    {editingId === role.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(role.id)}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(role)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(role.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {pagedRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-muted-foreground py-6"
                  >
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
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
import { CreateFeatureSheet } from "./CreateFeatureSheet";

export default function FeatureTable({
  dbName,
  tableName,
}: {
  dbName: string;
  tableName: string;
}) {
  const {
    pagedRows,
    loading,
    handleUpdate,
    handleDelete,
  } = useDataManager(dbName, tableName);

  // roles list from DB
  const { rows: roles } = useDataManager(dbName, "roles");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const roleMap = useMemo(() => {
    return new Map((roles || []).map((r: any) => [r.id, r.title]));
  }, [roles]);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.title);
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

  const normalizeRoles = (roles: any) => {
    if (!roles) return [];

    if (Array.isArray(roles)) return roles;

    if (typeof roles === "string") {
      try {
        return JSON.parse(roles);
      } catch {
        return [];
      }
    }

    return [];
  };

  return (
    <div className="space-y-4">
      <CreateFeatureSheet dbName={dbName} tableName={tableName} />

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Loading features...
        </div>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagedRows.map((item: any) => (
                <TableRow key={item.id}>
                  {/* SYSTEM */}
                  <TableCell className="text-xs font-medium">
                    {item.sys}
                  </TableCell>

                  {/* TITLE */}
                  <TableCell className="font-medium">
                    {editingId === item.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) =>
                          setEditValue(e.target.value)
                        }
                        className="h-8 w-[180px]"
                      />
                    ) : (
                      item.title
                    )}
                  </TableCell>

                  {/* ICON */}
                  <TableCell className="text-sm text-muted-foreground">
                    {item.icon}
                  </TableCell>

                  {/* PATH */}
                  <TableCell className="text-sm text-muted-foreground">
                    {item.path}
                  </TableCell>

                  {/* ROLES */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {normalizeRoles(item.roles).map(
                        (roleId: number) => (
                          <span
                            key={roleId}
                            className="text-xs bg-muted px-2 py-0.5 rounded-md"
                          >
                            {roleMap.get(roleId) ||
                              `Role #${roleId}`}
                          </span>
                        )
                      )}
                    </div>
                  </TableCell>

                  {/* ID */}
                  <TableCell className="text-xs text-muted-foreground">
                    {item.id}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right space-x-2">
                    {editingId === item.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(item.id)}
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
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(item.id)
                          }
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
                    colSpan={7}
                    className="text-center text-sm text-muted-foreground py-6"
                  >
                    No features found
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
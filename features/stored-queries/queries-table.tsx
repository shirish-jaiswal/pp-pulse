"use client";

import React from "react";
import { Link2, Trash2 } from "lucide-react";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QueriesTableProps {
  visibleQueries: STORED_QUERIES_TEMPLATE_TYPE[] | undefined;
  isLoading: boolean;
  onOpenEdit: (tpl: STORED_QUERIES_TEMPLATE_TYPE) => void;
  onInitiateUrlGeneration: (tpl: STORED_QUERIES_TEMPLATE_TYPE, e: React.MouseEvent) => void;
  onDelete: (id: string | number, title: string) => void;
}

export function QueriesTable({
  visibleQueries,
  isLoading,
  onOpenEdit,
  onInitiateUrlGeneration,
  onDelete,
}: QueriesTableProps) {
  return (
    <section className="flex-1 overflow-y-auto overflow-x-hidden mt-4 border rounded-md">
      {isLoading ? (
        <p className="text-xs text-muted-foreground text-center mt-12">
          Loading system workspace indexes...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead className="w-48">Title Key</TableHead>
              <TableHead className="w-48">Elastic Index Pattern</TableHead>
              <TableHead>Query String Structure</TableHead>
              <TableHead className="text-right w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleQueries?.map((tpl) => (
              <TableRow
                key={String(tpl.id)}
                onClick={() => onOpenEdit(tpl)}
                className="cursor-pointer group"
              >
                <TableCell className="font-mono text-muted-foreground">
                  {String(tpl.id)}
                </TableCell>
                <TableCell className="font-semibold">{tpl.title}</TableCell>
                <TableCell className="font-mono text-muted-foreground max-w-xs truncate">
                  {tpl.index}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground break-all">
                  {tpl.query_string}
                </TableCell>
                <TableCell
                  className="text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1"
                    onClick={(e) => onInitiateUrlGeneration(tpl, e)}
                  >
                    <Link2 className="h-3 w-3" /> Generate URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(tpl.id, tpl.title)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {visibleQueries?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No template matrices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";

interface ResolutionTableProps {
  data: ResolutionTemplate[];
  onEdit: (res: ResolutionTemplate) => void;
  onDelete: (id: number) => void;
}

export function ResolutionTable({ data, onEdit, onDelete }: ResolutionTableProps) {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-secondary z-10">
        <TableRow>
          <TableHead className="w-12">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Subcategory</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((res) => (
          <TableRow key={res.id}>
            <TableCell className="text-xs text-muted-foreground">#{res.id}</TableCell>
            <TableCell className="font-medium">{res.title}</TableCell>
            <TableCell className="font-medium">{res.game}</TableCell>
            <TableCell className="capitalize text-muted-foreground">{res.category}</TableCell>
            <TableCell className="capitalize text-muted-foreground">{res.subcategory}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(res)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-destructive" 
                onClick={() => onDelete(res.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
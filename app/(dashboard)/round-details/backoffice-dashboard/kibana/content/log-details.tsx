"use client";

import React, { useState, useMemo } from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { flattenObject } from "../utils";
import { FieldValueActionButton } from "./field-value-action-button";

interface LogDetailsProps {
  source: any;
  colSpan: number;
  onFilterIn?: (field: string, value: any) => void;
  onFilterOut?: (field: string, value: any) => void;
}

export function LogDetails({ source, colSpan, onFilterIn, onFilterOut }: LogDetailsProps) {
  const [search, setSearch] = useState("");

  const fields = useMemo(() => {
    const flattened = flattenObject(source);
    return Object.entries(flattened).filter(([k, v]) =>
      k.toLowerCase().includes(search.toLowerCase()) || 
      String(v).toLowerCase().includes(search.toLowerCase())
    );
  }, [source, search]);

  return (
    <TableRow className="bg-muted/10">
      <TableCell colSpan={colSpan} className="p-0 border-b">
        <div className="px-4 py-2 bg-muted/5 border">
          <div className="flex items-center justify-between mb-2 gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Document Details</span>
            <div className="relative w-full max-w-[240px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Filter fields..."
                className="h-6 text-[10px] pl-7 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="rounded-md border bg-background shadow-sm max-h-[400px] overflow-y-auto">
            <Table>
              <TableBody>
                {fields.map(([key, val]) => (
                  <TableRow key={key} className="group hover:bg-muted/30 border-b last:border-0">
                    <TableCell className="py-1 px-2 w-10 border-r text-center">
                      <FieldValueActionButton field={key} value={val}/>
                    </TableCell>
                    <TableCell className="py-1.5 px-3 font-mono text-[10px] text-primary/80 w-1/3 bg-muted/5 border-r">{key}</TableCell>
                    <TableCell className="py-1.5 px-3 font-mono text-[10px] break-all whitespace-pre-wrap">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
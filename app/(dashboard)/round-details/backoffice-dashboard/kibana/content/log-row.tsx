"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { getDeepValue } from "../utils";
import { LogDetails } from "./log-details";

export function LogRow({ hit, selectedFields, isExpanded, onToggle, onFilterIn, onFilterOut }: any) {
  return (
    <React.Fragment>
      <TableRow 
        className={cn(isExpanded ? "bg-muted/40" : "hover:bg-muted/50", "cursor-pointer")}
        onClick={onToggle}
      >
        <TableCell className="p-2 text-center align-top w-8">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </TableCell>
        
        {selectedFields.map((field: string) => {
          const val = getDeepValue(hit._source, field);
          const isTime = field === "@timestamp";
          return (
            <TableCell key={field} className={cn("py-2 align-top", isTime && "w-14")}>
              <div className="font-mono text-[11px] leading-tight break-words whitespace-pre-wrap">
                {isTime && val ? (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{String(val).split("T")[0]}</span>
                    <span>{String(val).split("T")[1]?.replace("Z", "")}</span>
                  </div>
                ) : String(val ?? "-")}
              </div>
            </TableCell>
          );
        })}
      </TableRow>

      {isExpanded && (
        <LogDetails
          source={hit._source} 
          colSpan={selectedFields.length + 1} 
          onFilterIn={onFilterIn}
          onFilterOut={onFilterOut}
        />
      )}
    </React.Fragment>
  );
}
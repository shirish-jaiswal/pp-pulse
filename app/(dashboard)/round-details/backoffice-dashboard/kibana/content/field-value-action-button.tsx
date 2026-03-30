"use client";

import { Plus, Minus } from "lucide-react";
import { useDashboard } from "../../context/dashboard-context";
import { LogRequestParams } from "@/lib/server/kibana/search";

interface LogActionButtonsProps {
  field: string;
  value: any;
}

export function FieldValueActionButton({ field, value }: LogActionButtonsProps) {
  const { logPayload, setLogPayload } = useDashboard(); 

  const handleFilter = (isPositive: boolean) => {
    const stringValue = String(value);
    
    // Create the base for the next state
    // We cast this as LogRequestParams to satisfy the required 'index', 'sort', etc.
    const nextPayload = {
      ...logPayload,
      searchAfter: undefined, // Always reset pagination on filter change
    } as LogRequestParams;

    if (isPositive) {
      // Logic for Plus: Add to matchPhrase
      nextPayload.matchPhrase = [
        ...(logPayload?.matchPhrase || []),
        { key: field, value: stringValue, isPositive: true, isDisabled: false },
      ];
    } else {
        nextPayload.matchPhrase = [
            ...(logPayload?.matchPhrase || []),
            { key: field, value: stringValue, isPositive: false, isDisabled: false}
        ]
    }
    setLogPayload(nextPayload);
  };

  
  return (
    <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        type="button"
        title="Filter for value"
        className="p-0.5 rounded-sm hover:bg-blue-100 dark:hover:bg-blue-900/30"
        onClick={(e) => {
          e.stopPropagation();
          handleFilter(true);
        }}
      >
        <Plus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      </button>
      
      <button
        type="button"
        title="Filter out value"
        className="p-0.5 rounded-sm hover:bg-red-100 dark:hover:bg-red-900/30"
        onClick={(e) => {
          e.stopPropagation();
          handleFilter(false);
        }}
      >
        <Minus className="h-3 w-3 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );
}
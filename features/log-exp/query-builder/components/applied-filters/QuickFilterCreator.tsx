"use client";

import React from "react";
import { useMultiFilters } from "../../context/QueryBuilderContext";
import { Plus, Minus } from "lucide-react";
import { QueryState, QueryNode } from "../../types";

interface QuickFilterCreatorProps {
  fieldKey: string;
  value: any;
  /** Optional custom class to override the outer container alignment */
  className?: string;
}

export default function QuickFilterCreator({ fieldKey, value, className = "" }: QuickFilterCreatorProps) {
  const { saveFilter } = useMultiFilters();

  const handleCreateFilter = (operatorType: "is_one_of" | "is_not_one_of" | "does_not_exist") => {
    const trimmedKey = String(fieldKey).trim();
    const trimmedValue = String(value).trim();

    if (!trimmedKey || !trimmedValue) return;

    const rootId = crypto.randomUUID();
    const conditionId = crypto.randomUUID();

    const nodes: Record<string, QueryNode> = {
      [rootId]: {
        id: rootId,
        type: "bool",
        children: [
          {
            id: conditionId,
            relation: "AND"
          }
        ],
      },
      [conditionId]: {
        id: conditionId,
        parentId: rootId,
        type: "condition",
        field: trimmedKey,
        operator: operatorType,
        values: [trimmedValue],
      },
    };

    const generatedTreeState: QueryState = {
      rootId: rootId,
      nodes: nodes
    };

    saveFilter(`${trimmedKey} ${operatorType} ${trimmedValue}`, generatedTreeState);
  };

  return (
    <div
      className={`inline-flex items-center gap-1 bg-slate-200/90 backdrop-blur-xs p-0.5 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.06)] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >

      {/* Inclusive / Plus Filter Button */}
      <button
        type="button"
        onClick={() => handleCreateFilter("is_one_of")}
        title={`Add filter: ${fieldKey} is ${value}`}
        className="group/btn relative flex h-5.5 w-5.5 cursor-pointer items-center justify-center rounded-sm bg-slate-100 text-slate-600 transition-all duration-150 ease-out hover:bg-emerald-600 hover:text-white active:scale-90"
      >
        <Plus className="h-3 w-3 stroke-[2.5] transition-transform duration-150 group-hover/btn:rotate-90" />
      </button>

      {/* Exclusive / Minus Filter Button */}
      <button
        type="button"
        onClick={() => handleCreateFilter("is_not_one_of")}
        title={`Add filter: ${fieldKey} is NOT ${value}`}
        className="group/btn relative flex h-5.5 w-5.5 cursor-pointer items-center justify-center rounded-sm bg-slate-100 text-slate-600 transition-all duration-150 ease-out hover:bg-rose-600 hover:text-white active:scale-90"
      >
        <Minus className="h-3 w-3 stroke-[2.5] transition-transform duration-150 group-hover/btn:scale-x-110" />
      </button>

    </div>
  );
}
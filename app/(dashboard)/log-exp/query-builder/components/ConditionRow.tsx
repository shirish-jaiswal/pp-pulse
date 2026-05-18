import React, { useCallback } from "react";
import { ConditionNode } from "../types";
import { useQueryBuilder } from "../context/QueryBuilderContext";
import { ConditionTagInput } from "./ConditionTagInput";
import { DropdownSelector } from "./DropdownSelector";
import { SUPPORT_FIELDS } from "./constants";

interface ConditionRowProps {
  node: ConditionNode;
}

export const ConditionRow: React.FC<ConditionRowProps> = ({ node }) => {
  const { actions } = useQueryBuilder();
  const { id, field, operator, values, parentId } = node;

  const handleFieldSelect = useCallback((value: string) => {
    actions.updateNode({ ...node, field: value });
  }, [actions, node]);

  const handleOperatorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextOp = e.target.value as "is_one_of" | "is_not_one_of";
    actions.updateNode({ ...node, operator: nextOp });
  }, [actions, node]);

  const handleValuesChange = useCallback((nextValues: string[]) => {
    actions.updateNode({ ...node, values: nextValues });
  }, [actions, node]);

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-slate-300">

      <div className="w-52 shrink-0">
        <DropdownSelector
          selectedValue={field}
          options={SUPPORT_FIELDS}
          onSelect={handleFieldSelect}
          placeholder="Select field..."
        />
      </div>

      <select
        value={operator}
        onChange={handleOperatorChange}
        className="h-8 cursor-pointer shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100"
      >
        <option value="is_one_of">is one of</option>
        <option value="is_not_one_of">is not one of</option>
      </select>

      <div className="grow min-w-0">
        <ConditionTagInput
          values={values || []}
          onChange={handleValuesChange}
        />
      </div>

      {/* 4. Action Controls */}
      <div className="flex shrink-0 items-center gap-1.5 border-l border-slate-100 pl-3">
        {/* + AND Button - Bumped height to h-8 and text from 10px to text-xs (12px) */}
        <button
          type="button"
          disabled={!parentId}
          onClick={() => parentId && actions.addCondition(parentId, "AND", id)}
          className="h-8 whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none"
          title="Add row with AND"
        >
          AND
        </button>

        <button
          type="button"
          disabled={!parentId}
          onClick={() => parentId && actions.addCondition(parentId, "OR", id)}
          className="h-8 whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-purple-50 hover:text-purple-600 disabled:opacity-30 disabled:pointer-events-none"
          title="Add row with OR"
        >
          OR
        </button>

        <button
          type="button"
          onClick={() => actions.deleteNode(id)}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Delete rule"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

    </div>
  );
};
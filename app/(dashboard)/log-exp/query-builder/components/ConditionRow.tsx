import React, { useCallback, useMemo } from "react";
import { ConditionNode } from "../types";
import { useQueryBuilder } from "../context/QueryBuilderContext";
import { ConditionTagInput } from "./ConditionTagInput";
import { DropdownSelector } from "./DropdownSelector";
import { useKibanaResponseStore } from "../../context/kibana-response-context";

interface ConditionRowProps {
  node: ConditionNode;
}

// Helper utility to safely extract nested values using dot-notation paths (e.g., "contextmap.ppenv")
const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;

  // If the object directly contains the key (even with dots), use it
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }

  // Otherwise, split the pathway string and dive down into nested objects
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

export const ConditionRow: React.FC<ConditionRowProps> = ({ node }) => {
  const { actions } = useQueryBuilder();
  const { id, field, operator, values, parentId } = node;

  // Consume dynamic fields AND full documents from our global store
  const { availableFields, selectedFields, documents } = useKibanaResponseStore();

  // Combine fields and remove duplicates for the field dropdown selector
  const dynamicFieldOptions = useMemo(() => {
    const mergedFields = Array.from(new Set([...selectedFields, ...availableFields]));
    const cleanSortedFields = mergedFields
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return cleanSortedFields.map((fieldName) => ({
      value: fieldName,
      label: fieldName,
    }));
  }, [availableFields, selectedFields]);

  // Extract unique sample values for the *currently selected field* across all cached log documents
  const valueSuggestions = useMemo(() => {
    if (!field || !documents || !Array.isArray(documents)) return [];

    const uniqueValues = new Set<string>();

    documents.forEach((doc) => {
      // Safely access properties nested inside Elasticsearch '_source' tracking layers
      const sourceData = doc?._source;
      if (!sourceData) return;

      // FIX: Use our pathway walker utility instead of simple direct square-bracket lookups
      const rawValue = getNestedValue(sourceData, field);

      if (rawValue !== undefined && rawValue !== null) {
        if (Array.isArray(rawValue)) {
          // Flatten multi-value arrays if present
          rawValue.forEach((v) => uniqueValues.add(String(v)));
        } else if (typeof rawValue === "object") {
          // Guard clause: If the nested path hits a full object instead of a leaf value, ignore it
          return;
        } else {
          uniqueValues.add(String(rawValue));
        }
      }
    });

    // Sort values for clean readability in the suggestion UI box
    return Array.from(uniqueValues).sort((a, b) => a.localeCompare(b));
  }, [field, documents]);

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

  // Unique ID dynamically bound to this specific row to decouple datalist lookup bindings
  const datalistId = `suggestions-${id}`;

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-slate-300">

      {/* Dropdown configured with properly formatted object options */}
      <div className="w-52 shrink-0">
        <DropdownSelector
          selectedValue={field}
          options={dynamicFieldOptions}
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

      {/* Pass suggestions down to your Tag Input component */}
      <div className="grow min-w-0">
        <ConditionTagInput
          values={values || []}
          onChange={handleValuesChange}
          suggestions={valueSuggestions}
          datalistId={datalistId}
        />
      </div>

      {/* Action Controls */}
      <div className="flex shrink-0 items-center gap-1.5 border-l border-slate-100 pl-3">
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
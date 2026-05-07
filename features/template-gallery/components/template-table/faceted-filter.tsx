import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface FacetedFilterProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}

export function FacetedFilter<TData>({
  column,
  title,
}: FacetedFilterProps<TData>) {
  const facetedValues = column.getFacetedUniqueValues();
  const options = Array.from(facetedValues.keys());

  const selectedValues = new Set(
    (column.getFilterValue() as string[]) ?? []
  );

  const toggleValue = (value: string) => {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    column.setFilterValue(Array.from(selectedValues));
  };

  return (
    <div className="border rounded p-2 space-y-2">
      <p className="text-sm font-medium">{title}</p>

      <div className="space-y-1 max-h-40 overflow-auto">
        {options.map((value) => (
          <label
            key={value}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              checked={selectedValues.has(value)}
              onCheckedChange={() => toggleValue(value)}
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
}
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface DropdownOption {
  key: string;
  value: string;
}

interface DropdownSelectorProps {
  label: string;
  value: DropdownOption | null;
  setValue: (val: DropdownOption) => void;
  options: DropdownOption[];
}

export function DropdownSelector({
  label,
  value,
  setValue,
  options,
}: DropdownSelectorProps) {
  return (
    <div className="flex flex-col min-w-0">
      <Label className="text-sm font-medium mb-1 block">{label}</Label>

      <Select
        value={value?.value || ""}
        onValueChange={(val) => {
          const selected = options.find((opt) => opt.value === val);
          if (selected) setValue(selected);
        }}
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.key} value={opt.value}>
              {opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
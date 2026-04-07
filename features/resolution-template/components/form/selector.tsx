"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

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
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-w-0 space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 font-normal"
          >
            <span className="truncate">
              {value ? value.value : "Select option..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full min-w-52 p-0" 
          align="start"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Command className="flex flex-col h-full max-h-40">
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList 
              className="overflow-y-auto overflow-x-hidden"
              style={{ maxHeight: '200px' }} // Explicitly sets the scrollable height
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.key}
                    value={opt.value}
                    onSelect={() => {
                      setValue(opt);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.key === opt.key ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate text-sm">{opt.value}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
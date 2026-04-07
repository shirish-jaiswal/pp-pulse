"use client";

import * as React from "react";
import { Braces, Loader2, ChevronsUpDown } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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

import { INSERT_FIELD_COMMAND } from "@/components/custom/text-editor/field-plugin";
import { getVariablesAction } from "@/components/custom/text-editor/variables";

export function FieldDropdown() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = React.useState(false);
  const [variables, setVariables] = React.useState<{ key: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getVariablesAction();
        setVariables(data);
      } catch (error) {
        console.error("Failed to load variables", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const onSelect = (option: { key: string; value: string }) => {
    editor.dispatchCommand(INSERT_FIELD_COMMAND, option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className="h-9 w-52 justify-between font-medium"
          >
            <span className="flex items-center gap-2 overflow-hidden">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Braces className="h-4 w-4 shrink-0 opacity-50" />
              )}
              <span className="truncate text-xs">Insert Variable</span>
            </span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-52 p-0 shadow-xl border-border" 
          align="start"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Command className="flex flex-col h-full max-h-52">
            <CommandInput 
              placeholder="Search..." 
              className="h-9" 
            />
            <CommandList 
              className="overflow-y-auto overflow-x-hidden scrollbar-thin"
              // Stops the editor from scrolling when you reach the end of the list
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                No variables found.
              </CommandEmpty>
              <CommandGroup>
                {variables.map((variable) => (
                  <CommandItem
                    key={variable.key}
                    value={variable.value}
                    onSelect={() => onSelect(variable)}
                    className="cursor-pointer py-2 text-xs"
                  >
                    <Braces className="mr-2 h-3 w-3 opacity-40" />
                    <span className="truncate">{variable.value}</span>
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
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Braces, Loader2 } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_FIELD_COMMAND } from "@/components/custom/text-editor/field-plugin";
import { getVariablesAction } from "@/components/custom/text-editor/variables";

export function FieldDropdown() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [variables, setVariables] = useState<{key: string, value: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getVariablesAction();
        console.log("Fetched variables:", data);
        setVariables(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const onSelect = (option: { key: string; value: string }) => {
    editor.dispatchCommand(INSERT_FIELD_COMMAND, option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={isLoading}
        className="inline-flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Braces className="h-4 w-4 opacity-50" />}
          Insert Variable
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <ul className="absolute left-0 z-50 mt-2 min-w-45 overflow-hidden rounded-md border border-border bg-popover shadow-md">
            {variables.map((option) => (
              <li key={option.key}>
                <button
                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(option)}
                >
                  {option.value}
                </button>
              </li>
            ))}
            {variables.length === 0 && !isLoading && (
               <li className="px-3 py-2 text-xs text-muted-foreground">No variables found</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
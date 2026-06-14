"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterRuleItem {
  id: string;
  field: string;
  type: "phrases" | "exists";
  negate: boolean;
  value: string;
}

interface ConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: any;
  title: string;
  setTitle: (v: string) => void;
  indexPattern: string;
  setIndexPattern: (v: string) => void;
  queryString: string;
  setQueryString: (v: string) => void;
  defaultColumns: string;
  setDefaultColumns: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  filterRules: FilterRuleItem[];
  onRemoveFilterRule: (id: string) => void;
  inputField: string;
  setInputField: (v: string) => void;
  inputNegate: boolean;
  setInputNegate: (v: boolean) => void;
  inputType: "phrases" | "exists";
  setInputType: (v: "phrases" | "exists") => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  onAddFilterRule: (e: React.MouseEvent) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
  isUpdating: boolean;
}

export function ConfigSheet({
  isOpen,
  onOpenChange,
  selectedTemplate,
  title,
  setTitle,
  indexPattern,
  setIndexPattern,
  queryString,
  setQueryString,
  defaultColumns,
  setDefaultColumns,
  description,
  setDescription,
  filterRules,
  onRemoveFilterRule,
  inputField,
  setInputField,
  inputNegate,
  setInputNegate,
  inputType,
  setInputType,
  inputValue,
  setInputValue,
  onAddFilterRule,
  onSave,
  isSaving,
  isUpdating,
}: ConfigSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg min-w-[50vw] overflow-y-auto p-6 flex flex-col h-full text-xs">
        <SheetHeader className="text-left border-b pb-3 mb-4">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider">
            Configure Properties
          </SheetTitle>
          <SheetDescription className="text-xs">
            Specify system attributes and modular filter schemas layer by layer
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSave} className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-muted-foreground">Title Matrix Template Key</label>
                <Input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-muted-foreground">Target Elastic Index</label>
                <Input type="text" required value={indexPattern} onChange={(e) => setIndexPattern(e.target.value)} className="h-8 font-mono text-xs" />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-muted-foreground">Search Query Configuration Line</label>
              <Input type="text" required value={queryString} onChange={(e) => setQueryString(e.target.value)} placeholder="({val1} and {val2}) and authenticate" className="h-8 font-mono text-xs" />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-muted-foreground">Default View Columns (Comma-Separated)</label>
              <Input type="text" value={defaultColumns} onChange={(e) => setDefaultColumns(e.target.value)} placeholder="message,contextMap.apiType" className="h-8 font-mono text-xs" />
            </div>

            {/* DYNAMIC FILTER BUILDER */}
            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-[11px] mb-2">Layered Elastic Query Filters</h4>
              
              <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto bg-muted p-2 rounded-md border">
                {filterRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between items-center bg-card p-1.5 border rounded text-[11px] font-mono">
                    <span>
                      Field: <strong className="text-foreground">{rule.field}</strong> | 
                      Type: <span className="text-muted-foreground">{rule.type}</span> | 
                      Logic: <span className="text-muted-foreground">{rule.negate ? "Exclude (!=)" : "Include (==)"}</span> | 
                      Val: <strong className="text-foreground">{rule.value}</strong>
                    </span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 rounded-sm text-destructive"
                      onClick={() => onRemoveFilterRule(rule.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {filterRules.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-2 italic">No active filters configured for this layout.</p>}
              </div>

              <div className="bg-muted p-3 rounded-md border space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-medium text-muted-foreground">Field Target Key</label>
                    <Input type="text" value={inputField} onChange={(e) => setInputField(e.target.value)} placeholder="e.g., message" className="h-8 bg-background text-xs" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-medium text-muted-foreground">Match Operator Condition</label>
                    <Select value={inputNegate ? "exclude" : "include"} onValueChange={(val) => setInputNegate(val === "exclude")}>
                      <SelectTrigger className="h-8 bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="include" className="text-xs">Include / Match Phrases</SelectItem>
                        <SelectItem value="exclude" className="text-xs">Exclude / Negate Phrases</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="flex flex-col space-y-1 col-span-1">
                    <label className="text-[10px] font-medium text-muted-foreground">Filter Type</label>
                    <Select value={inputType} onValueChange={(val: "phrases" | "exists") => setInputType(val)}>
                      <SelectTrigger className="h-8 bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phrases" className="text-xs">Phrases Match</SelectItem>
                        <SelectItem value="exists" className="text-xs">Exists Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1 col-span-2">
                    <label className="text-[10px] font-medium text-muted-foreground">Target Value / Array Placeholder</label>
                    <Input 
                      type="text" 
                      disabled={inputType === "exists"} 
                      value={inputType === "exists" ? "Checks key existence" : inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} 
                      placeholder="e.g., {passedPhrases} or static_word" 
                      className="h-8 bg-background text-xs disabled:opacity-50" 
                    />
                  </div>
                </div>

                <Button type="button" variant="secondary" size="sm" onClick={onAddFilterRule} className="w-full text-[11px] font-bold">
                  + Commit Filter Line to Stack
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-muted-foreground">Workspace Notes Description</label>
              <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Document context rules here..." className="text-xs resize-none" />
            </div>
          </div>

          <div className="pt-3 border-t flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
            <Button type="submit" size="sm" disabled={isSaving || isUpdating}>
              {isSaving || isUpdating ? "Processing..." : selectedTemplate ? "Update Matrix" : "Save Matrix Template"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
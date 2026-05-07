import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface FieldItemProps {
  field: string;
  isSelected?: boolean;
  onToggle: (field: string) => void;
}

export function FieldItem({ field, isSelected, onToggle }: FieldItemProps) {
  const isMandatory = field === "@timestamp";

  return (
    <div 
      onClick={() => !isSelected && onToggle(field)}
      className={cn(
        "group w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer",
        isSelected ? "hover:bg-muted/80" : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="truncate pr-2">{field}</span>
      <div className="flex items-center gap-1 shrink-0">
        {isMandatory ? (
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mx-1" />
        ) : isSelected ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(field); }} 
            className="p-1 hover:bg-background rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ClearInputFieldProps {
  onClick: () => void;
}
export const ClearInputFieldButton = ({ onClick }: ClearInputFieldProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Clear input"
      className="h-7 w-7 rounded-full text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-95"
    >
      <X className="h-4 w-4" strokeWidth={2.25} />
    </Button>
  );
};
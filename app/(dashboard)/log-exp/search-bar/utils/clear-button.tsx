import { X } from "lucide-react";

interface ClearButtonProps {
    onClick: () => void;
}

export const ClearButton = ({
    onClick,
}: ClearButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                p-1.5
                rounded-md
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-600
            "
        >
            <X className="h-4 w-4" />
        </button>
    );
};
import {
    Loader2,
    Sparkles,
} from "lucide-react";

interface GenerateQueryButtonProps {
    isLoading: boolean;

    onClick: () => void;
}

export const GenerateQueryButton =
    ({
        isLoading,
        onClick,
    }: GenerateQueryButtonProps) => {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={isLoading}
                className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-lg
                    border
                    border-blue-200
                    bg-blue-50
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-blue-700
                    transition-all
                    hover:bg-blue-100
                    hover:border-blue-300
                    disabled:opacity-50
                "
            >
                {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                )}
            </button>
        );
    };
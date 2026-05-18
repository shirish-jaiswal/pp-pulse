import {
    Loader2,
    Search,
} from "lucide-react";

interface SearchLoadingIconProps {
    isLoading: boolean;
}

export const SearchLoadingIcon =
    ({
        isLoading,
    }: SearchLoadingIconProps) => {
        return (
            <div className="relative w-4 h-4 shrink-0">
                <Search className="absolute inset-0 h-4 w-4 text-slate-400" />

                {isLoading && (
                    <Loader2
                        className="
                            absolute
                            inset-0
                            h-4
                            w-4
                            animate-spin
                            text-blue-500
                        "
                    />
                )}
            </div>
        );
    };
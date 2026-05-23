import React from "react";

interface LogicalDividerProps {
    relation: "AND" | "OR";
    onToggle: () => void;
}

export const LogicalDivider: React.FC<LogicalDividerProps> = ({ relation, onToggle }) => {
    const buttonStyles = relation === "AND"
        ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";

    const descriptiveLabel = relation === "OR"
        ? "either condition can be true"
        : "all conditions are required";

    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={onToggle}
                className={`inline-flex h-7 items-center justify-center cursor-pointer select-none rounded-md px-3 text-sm font-black tracking-wider text-white shadow-sm transition-colors outline-none focus:ring-2 focus:ring-offset-1 ${relation === "AND" ? "focus:ring-blue-400" : "focus:ring-purple-400"
                    } ${buttonStyles}`}
                title={`Click to change grouping logic to ${relation === "AND" ? "OR" : "AND"}`}
            >
                {relation}
            </button>

            <span className="text-sm font-medium text-slate-400">
                ({descriptiveLabel})
            </span>
        </div>
    );
};
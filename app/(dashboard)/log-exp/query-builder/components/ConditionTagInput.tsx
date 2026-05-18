import React, { useState, useCallback } from "react";

interface ConditionTagInputProps {
    values: string[];
    onChange: (nextValues: string[]) => void;
}

export const ConditionTagInput: React.FC<ConditionTagInputProps> = ({ values, onChange }) => {
    const [inputValue, setInputValue] = useState("");

    const appendTags = useCallback((text: string) => {
        const tokens = text
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "");

        if (tokens.length > 0) {
            const mergedUnique = Array.from(new Set([...values, ...tokens]));
            onChange(mergedUnique);
        }
        setInputValue("");
    }, [values, onChange]);

    const removeTag = useCallback((indexToRemove: number) => {
        onChange(values.filter((_, idx) => idx !== indexToRemove));
    }, [values, onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.endsWith(",")) {
            appendTags(val);
        } else {
            setInputValue(val);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            appendTags(inputValue);
        }
        if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
            removeTag(values.length - 1);
        }
    };

    return (
        <div className="flex min-w-50 flex-1 flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 focus-within:border-blue-500 min-h-[32px]">

            {values.map((val, index) => (
                <span
                    key={`${val}-${index}`}
                    className="flex items-center gap-1 rounded bg-slate-100 pl-2 pr-1 py-0.5 text-sm font-medium text-slate-600"
                >
                    <span className="max-w-30 truncate">{val}</span>

                    <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}

            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={() => inputValue.trim() && appendTags(inputValue)}
                placeholder={values.length === 0 ? "e.g. error, 500" : ""}
                className="min-w-15 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
        </div>
    );
};
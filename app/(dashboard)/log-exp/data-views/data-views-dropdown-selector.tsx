"use client";

import { useDataViews } from "@/hooks/excel-db/use-kibana-data-views";
import React, { useMemo, useEffect } from "react";
import { DropdownSelector } from "../query-builder/components/DropdownSelector";

interface DataViewsDropdownSelectorProps {
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder?: string;
}

const DEFAULT_VIEW = "filebeat-casino-*";

export const DataViewsDropdownSelector: React.FC<DataViewsDropdownSelectorProps> = ({
    selectedValue,
    onSelect,
    placeholder = "Select Data View...",
}) => {
    const { data: dataViews, isLoading, error } = useDataViews();

    // Automatically set default value if nothing is currently selected
    useEffect(() => {
        if (!selectedValue) {
            onSelect(DEFAULT_VIEW);
        }
    }, [selectedValue, onSelect]);

    const options = useMemo(() => {
        if (!dataViews) return [];

        const mappedOptions = dataViews.map((view) => ({
            value: view.id.toString(),
            label: view.name,
        }));

        // Fallback guarantee: If the API doesn't return the default option, inject it manually
        const hasDefault = mappedOptions.some(opt => opt.value === DEFAULT_VIEW);
        if (!hasDefault) {
            mappedOptions.unshift({ value: DEFAULT_VIEW, label: DEFAULT_VIEW });
        }

        return mappedOptions;
    }, [dataViews]);

    // UI Consistency adjustments for all states
    if (isLoading) {
        return (
            <div className="w-44 shrink-0">
                <div className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 animate-pulse font-medium">
                    <span className="truncate">{selectedValue || DEFAULT_VIEW}</span>
                    <span className="text-xs text-slate-400 ml-2">▼</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-44 shrink-0">
                <div className="flex h-10 w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500 font-medium">
                    <span className="truncate">Error loading views</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-44 shrink-0">
            <DropdownSelector
                selectedValue={selectedValue || DEFAULT_VIEW}
                options={options}
                onSelect={onSelect}
                placeholder={placeholder}
                className="h-10 py-2 px-3 rounded-lg font-medium text-slate-700"
            />
        </div>
    );
};
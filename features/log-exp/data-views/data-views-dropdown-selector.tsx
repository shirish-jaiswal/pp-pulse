"use client";

import React, { useMemo, useEffect } from "react";
import { DropdownSelector } from "@/features/log-exp/query-builder/components/DropdownSelector";
import { useKibanaFormStore } from "@/features/log-exp/context/kibana-form-context";
import { useDataViews } from "@/features/log-exp/data-views/use-kibana-data-views";

interface DataViewsDropdownSelectorProps {
    placeholder?: string;
}

export const DataViewsDropdownSelector: React.FC<DataViewsDropdownSelectorProps> = ({
    placeholder = "Select Data View...",
}) => {
    const { data: dataViews, isLoading, error } = useDataViews();
    const { selectedDataView, setSelectedDataView } = useKibanaFormStore();

    const options = useMemo(() => {
        if (!dataViews?.length) return [];
        return dataViews.map((view) => ({
            value: view.name,
            label: view.name,
        }));
    }, [dataViews]);

    useEffect(() => {
        if (!selectedDataView && options.length > 0) {
            setSelectedDataView(options[0].value);
        }
    }, [selectedDataView, options, setSelectedDataView]);

    if (isLoading) {
        return (
            <div className="w-44 shrink-0" aria-busy="true" aria-label="Loading data views">
                <div className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 animate-pulse font-medium">
                    <span className="truncate">Loading views...</span>
                    <span className="text-xs ml-2" aria-hidden="true">▼</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-44 shrink-0" role="alert">
                <div className="flex h-10 w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500 font-medium">
                    <span className="truncate">Error loading views</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-44 shrink-0">
            <DropdownSelector
                selectedValue={selectedDataView}
                options={options}
                onSelect={setSelectedDataView}
                placeholder={placeholder}
                className="h-10 py-2 px-3 rounded-lg font-medium text-slate-700"
            />
        </div>
    );
};
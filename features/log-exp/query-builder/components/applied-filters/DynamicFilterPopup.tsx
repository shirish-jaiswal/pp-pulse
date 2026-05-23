import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { QueryBuilderProvider, useMultiFilters } from "../../context/QueryBuilderContext";
import QueryBuilderContent from "../QueryBuilderContent";


interface DynamicFilterPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    triggerElement: React.ReactNode;
    filterIdToEdit: string | null;
}

export default function DynamicFilterPopup({ open, onOpenChange, triggerElement, filterIdToEdit }: DynamicFilterPopupProps) {
    const { filters } = useMultiFilters();

    // Key Strategy: If filterIdToEdit exists, pull up its configuration tree, else leave it undefined to run clean initial state
    const activeTreeState = filterIdToEdit ? filters[filterIdToEdit]?.state : undefined;

    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger asChild>
                {triggerElement}
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    align="start"
                    sideOffset={6}
                    className="z-50 outline-none animate-in fade-in-0 zoom-in-95 duration-100"
                >
                    {/* The key pattern is critical: it triggers re-mounting the scratch tree cleanly contextually */}
                    <QueryBuilderProvider key={`${open}-${filterIdToEdit}`} initialState={activeTreeState}>
                        <QueryBuilderContent
                            filterIdToEdit={filterIdToEdit}
                            onClose={() => onOpenChange(false)}
                        />
                    </QueryBuilderProvider>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
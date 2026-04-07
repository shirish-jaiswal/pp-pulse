"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { ResolutionHeader } from "@/features/resolution-template/components/form/resolution-header";
import { useResolutionForm } from "@/features/resolution-template/context/use-resolution-form";
import { ResolutionTabs } from "@/features/resolution-template/components/form/resolution-tabs";
import { ResolutionForm } from "@/features/resolution-template/components/form/resolution-form";
import { ResolutionEditor } from "@/features/resolution-template/components/form/resolution-editor";
import { ResolutionFooter } from "@/features/resolution-template/components/form/resolution-footer";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: ResolutionTemplate | null;
    onSave: (data: any) => Promise<void>;
}

export function ResolutionSheet(props: Props) {
    const form = useResolutionForm(props);

    return (
        <Sheet open={props.isOpen} onOpenChange={props.onOpenChange}>
            <SheetContent className="min-w-225 max-w-full flex flex-col gap-0 p-1">
                <ResolutionHeader initialData={props.initialData} />
                <Tabs
                    value={form.tabValue}
                    onValueChange={form.setTabValue}
                    className="flex flex-col flex-1"
                >
                    <ResolutionTabs />
                    <ResolutionForm form={form} />
                    <ResolutionEditor form={form} />
                </Tabs>
                <ResolutionFooter form={form} />
            </SheetContent>
        </Sheet>
    );
}
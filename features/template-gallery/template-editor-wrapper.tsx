"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { ResolutionHeader } from "@/features/resolution-template/components/form/resolution-header";
import { useResolutionForm } from "@/features/resolution-template/context/use-resolution-form";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";
import { TemplateEditor } from "@/features/template-gallery/components/editor/template-editor";

interface TemplateEditorWrapperProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: ResolutionTemplate | null;
}

export function TemplateEditorWrapper(props: TemplateEditorWrapperProps) {
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
                    <TemplateEditor form={form} />
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
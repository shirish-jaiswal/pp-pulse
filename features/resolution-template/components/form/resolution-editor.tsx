import { TabsContent } from "@/components/ui/tabs";
import { EditorBlock } from "@/features/resolution-template/components/form/editor-block";

export function ResolutionEditor({ form }: any) {
    return (
        <div className="flex-1 px-2">
            <TabsContent value="summary" className="h-full">
                <EditorBlock
                    content={form.content}
                    setContent={form.setContent}
                />
            </TabsContent>

            <TabsContent value="response" className="h-full">
                <EditorBlock
                    content={form.content}
                    setContent={form.setContent}
                />
            </TabsContent>
        </div>
    );
}
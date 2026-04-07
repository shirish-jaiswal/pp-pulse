import { TabsContent } from "@/components/ui/tabs";
import { EditorBlock } from "@/features/resolution-template/components/form/editor-block";

export function ResolutionEditor({ form }: any) {
    const categories = form.categories || [];
    return (
        <div className="flex-1 px-2">
            {categories.map((cat: any) => (
                <TabsContent 
                    key={cat.id} 
                    value={cat.title}
                    className="h-full mt-0 border-none shadow-none focus-visible:ring-0"
                >
                    <EditorBlock
                        content={form.content}
                        setContent={form.setContent}
                    />
                </TabsContent>
            ))}

            {categories.length === 0 && (
                <TabsContent value={form.tabValue} className="h-full mt-0">
                    <EditorBlock
                        content={form.content}
                        setContent={form.setContent}
                    />
                </TabsContent>
            )}
        </div>
    );
}
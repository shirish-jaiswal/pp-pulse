"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";

export function ResolutionSummary() {
    const handleSave = (content: string) => {
        console.log("Resolution Summary saved:", content);
    };

    return (
        <TabsContent value="details">
            <Card className="py-0">
                <CardContent className="p-2">
                    <h3 className="text-sm font-semibold text-foreground pb-2">
                        Resolution Summary
                    </h3>

                    <RichTextEditor
                        onChange={handleSave}
                        placeholder="Write resolution summary..."
                    />
                </CardContent>
            </Card>
        </TabsContent>
    );
}
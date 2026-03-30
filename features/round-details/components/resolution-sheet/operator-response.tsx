"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";

export function OperatorResponse() {
    const handleSave = (content: string) => {
        console.log("Operator Response saved:", content);
    };

    return (
        <TabsContent value="response">
            <Card className="py-2">
                <CardContent className="p-2 py-0">
                    <h3 className="text-sm font-semibold text-foreground pb-2">
                        Operator Response
                    </h3>

                    <RichTextEditor
                        initialValue={undefined}
                        onChange={handleSave}
                        placeholder="Write operator response..."
                    />

                </CardContent>
            </Card>
        </TabsContent>
    );
}
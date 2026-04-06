"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";
import { findResolutionsAction } from "@/features/round-details/server/actions";

type ResolutionSummaryProps = {
    gameName: string;
    tabSelected: string;
};

type Resolution = {
    id: number;
    title: string;
    subcategory: string;
    content: string;
};

export function OperatorResponse({ gameName, tabSelected }: ResolutionSummaryProps) {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [editorContent, setEditorContent] = useState<string>("");

    const handleChange = (value: string) => {
        console.log("Operator Response saved:", value);
        
        setEditorContent(value);
    };

    console.log("Operator Response :: ", editorContent);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await findResolutionsAction({
                    game: "All",
                    category: "Operator Response",
                });

                if (res && res.length > 0) {
                    setResolutions(res);
                    const firstRes = res[0];
                    setSelectedId(firstRes.id.toString());
                    setEditorContent(firstRes.content);
                }
            } catch (err) {
                console.error("Error fetching resolutions:", err);
            }
        };

        fetchData();
    }, [gameName, tabSelected]);

    const handleSubcategoryChange = (id: string) => {
        setSelectedId(id);
        const match = resolutions.find((r) => r.id.toString() === id);
        if (match) {
            setEditorContent(match.content);
        }
    };

    return (
        <TabsContent value="response">
            <Card className="py-2">
                <CardContent className="p-2 py-0 space-y-1">
                    <div className="flex gap-2 items-baseline justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                            Operator Response
                        </h3>
                        
                        <Select value={selectedId} onValueChange={handleSubcategoryChange}>
                            <SelectTrigger className="w-96" size="sm">
                                <SelectValue placeholder="Select a subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                {resolutions.map((res) => (
                                    <SelectItem key={res.id} value={res.id.toString()}>
                                        {res.subcategory} - {res.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-[calc(100vh-10rem)] overflow-auto">
                        <RichTextEditor
                        key={selectedId}
                        initialValue={editorContent}
                        onChange={handleChange}
                        placeholder="Write operator response..."
                    />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
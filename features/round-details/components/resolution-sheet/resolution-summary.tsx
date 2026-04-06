"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/custom/text-editor/rich-text-editor";
import { findResolutionsAction } from "@/features/round-details/server/actions";

type ResolutionSummaryProps = {
    gameName: string;
    tabSelected: string;
};

type ResolutionItem = {
    id: number;
    title: string;
    subcategory: string;
    content: string;
};

export function ResolutionSummary({ gameName, tabSelected }: ResolutionSummaryProps) {
    const [resolutions, setResolutions] = useState<ResolutionItem[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [editorContent, setEditorContent] = useState<string>("");

    const handleSave = (content: string) => {
        setEditorContent(content);
    };

    useEffect(() => {
        const fetchResolutions = async () => {
            try {
                const res = await findResolutionsAction({
                    game: "All",
                    category: "Resolution Summary",
                });

                if (res && res.length > 0) {
                    setResolutions(res);
                    setSelectedId(res[0].id.toString());
                    setEditorContent(res[0].content);
                }
            } catch (err) {
                console.error("Failed to fetch resolution summaries:", err);
            }
        };

        fetchResolutions();
    }, [gameName, tabSelected]);

    const handleSelectChange = (id: string) => {
        setSelectedId(id);
        const selected = resolutions.find((r) => r.id.toString() === id);
        if (selected) {
            setEditorContent(selected.content);
        }
    };

    return (
        <TabsContent value="details">
            <Card className="py-2">
                <CardContent className="p-2 py-0 space-y-1">
                    <div className="flex gap-2 items-baseline justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                            Resolution Summary
                        </h3>

                        <Select value={selectedId} onValueChange={handleSelectChange}>
                            <SelectTrigger className="w-96" size="sm">
                                <SelectValue placeholder="Select subcategory..." />
                            </SelectTrigger>
                            <SelectContent>
                                {resolutions.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.subcategory} - {item.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-[calc(100vh-10rem)] overflow-auto">
                        <RichTextEditor
                            key={selectedId}
                            initialValue={editorContent}
                            onChange={handleSave}
                            placeholder="Write resolution summary..."
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
import { useFindResolutionTemplates } from "@/hooks/excel-db/use-find-resolution-template";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { fillAndTransformData } from "@/features/round-details/components/resolution-sheet/insert-values";

interface ResolutionEditorContentProps {
    gameName: string;
    category: string;
    tabsValue: string;
}

export function ResolutionEditorContent({
    gameName,
    category,
    tabsValue
}: ResolutionEditorContentProps) {
    const { data: resolutions = [], isLoading } = useFindResolutionTemplates({
        game: gameName,
        category: category,
    });
    const { data } = useRoundDetails();

    const dataValues = {
        casinoid: "12345++++ ",
        casinoName: "Grand Royale Casino New York",
        roundId: "987654321",
        playerId: "USR_777",
        gameId: "SLOT_X",
        currentUrl: "ss",
        c_bet_details: "$10.00 on Red",
        c_transaction_details: "TXN_ABC_001"
    };

    const [selectedId, setSelectedId] = useState<string>("");
    const [editorContent, setEditorContent] = useState<string>("");

    const getPopulatedContent = useCallback((rawContent: string) => {
        if (!rawContent) return "";

        try {
            const editorStateObj = JSON.parse(rawContent);
            if (editorStateObj && editorStateObj.root) {
                editorStateObj.root = fillAndTransformData(editorStateObj.root, dataValues);
            } else {
                return JSON.stringify(fillAndTransformData(editorStateObj, dataValues));
            }
            return JSON.stringify(editorStateObj);
        } catch (e) {
            console.error("Transformation Error:", e);
            return rawContent;
        }
    }, [dataValues]);

    useEffect(() => {
        if (resolutions.length > 0 && !selectedId) {
            const first = resolutions[0];
            setSelectedId(first.id.toString());
            setEditorContent(getPopulatedContent(first.content));
        }
    }, [resolutions, selectedId, getPopulatedContent]);

    const handleSelectChange = (id: string) => {
        const selected = resolutions.find((r) => r.id.toString() === id);
        if (selected) {
            setSelectedId(id);
            setEditorContent(getPopulatedContent(selected.content));
        }
    };

    const handleContentChange = useCallback((content: string) => {
        setEditorContent(content);
    }, []);

    return (
        <TabsContent value={tabsValue} className="mt-0 border-none">
            <Card className="py-2 border-none shadow-none">
                <CardContent className="p-2 py-0 space-y-2">
                    <div className="flex gap-2 items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                        <Select
                            value={selectedId}
                            onValueChange={handleSelectChange}
                            disabled={isLoading || resolutions.length === 0}
                        >
                            <SelectTrigger className="w-96" size="sm">
                                <SelectValue placeholder={isLoading ? "Loading..." : "Select..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {resolutions.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        <span className="opacity-80">{item.title}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-[calc(100vh-12rem)] overflow-auto border rounded-md">
                        <RichTextEditor
                            key={`${category}-${selectedId}`}
                            initialValue={editorContent}
                            onChange={handleContentChange}
                            placeholder={`Write ${category.toLowerCase()}...`}
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
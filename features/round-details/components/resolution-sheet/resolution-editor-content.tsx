"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

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

import { findResolutionTemplatesAction } from "@/lib/excel-engine/resolution-template/find";

import { useSubcategories } from "@/features/resolution-template/hooks/use-subcategories";

type ResolutionItem = {

    id: number;

    title: string;

    subcategory: string;

    content: string;

};

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

    const [resolutions, setResolutions] = useState<ResolutionItem[]>([]);

    const [selectedId, setSelectedId] = useState<string>("");

    const [editorContent, setEditorContent] = useState<string>("");

    // 1. Fetch global subcategories using your hook

    const { data: subcategories = [], isLoading: isLoadingSubs } = useSubcategories();

    const handleContentChange = useCallback((content: string) => {

        setEditorContent(content);

    }, []);

    useEffect(() => {

        let isMounted = true;

        const fetchResolutions = async () => {

            try {

                const res = await findResolutionTemplatesAction({

                    game: gameName,

                    category: category,

                });

                if (!isMounted) return;

                if (res && res.length > 0) {

                    setResolutions(res);

                    setSelectedId(res[0].id.toString());

                    setEditorContent(res[0].content);

                } else {

                    setResolutions([]);

                    setSelectedId("");

                    setEditorContent("");

                }
            } catch (err) {
                console.error(`Failed to fetch ${category}:`, err);
            }
        };

        fetchResolutions();

        return () => { isMounted = false; };

    }, [gameName, category]);

    // const getSubcategoryLabel = (subId: string) => {

    //     const sub = subcategories.find(s => s.key === subId || s.value === subId);

    //     return sub ? sub.value : subId;

    // };

    const handleSelectChange = (id: string) => {

        const selected = resolutions.find((r) => r.id.toString() === id);

        if (selected) {

            setSelectedId(id);

            setEditorContent(selected.content);

        }

    };

    return (

        <TabsContent value={tabsValue} className="mt-0 border-none">

            <Card className="py-2 border-none shadow-none">

                <CardContent className="p-2 py-0 space-y-2">

                    <div className="flex gap-2 items-center justify-between">

                        <h3 className="text-sm font-semibold text-foreground">

                            {category}

                        </h3>

                        <Select

                            value={selectedId}

                            onValueChange={handleSelectChange}

                            disabled={resolutions.length === 0 || isLoadingSubs}

                        >

                            <SelectTrigger className="w-96" size="sm">

                                <SelectValue placeholder={

                                    isLoadingSubs ? "Loading..." : `Select ${category.toLowerCase()}...`

                                } />

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
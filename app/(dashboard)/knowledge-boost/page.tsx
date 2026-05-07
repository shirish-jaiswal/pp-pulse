"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpNotesTabs } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-tab";
import { QnaTabs } from "@/features/knowledge-boost/components/tabs/qna/qna-tabs";


function KnowledgeBoost() {
    return (
        <>
            <Tabs defaultValue="qna" className="w-full">
                <TabsList>
                    <TabsTrigger value="qna">QNA</TabsTrigger>
                    <TabsTrigger value="help">Help Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="qna">
                    <QnaTabs />
                </TabsContent>

                <TabsContent value="help">
                    <HelpNotesTabs />
                </TabsContent>
            </Tabs>
        </>
    );
}

export default KnowledgeBoost;
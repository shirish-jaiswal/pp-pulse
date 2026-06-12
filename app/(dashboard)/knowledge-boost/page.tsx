"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpNotesTabs } from "@/features/knowledge-boost/components/tabs/help-notes/help-notes-tab";
import { QnaTabs } from "@/features/knowledge-boost/components/tabs/qna/qna-tabs";
import SyncArticlesTab from "@/features/knowledge-boost/components/tabs/sync-kbs/sync-kb-articles";


function KnowledgeBoost() {
    return (
        <>
            <Tabs defaultValue="qna" className="w-full">
                <TabsList>
                    <TabsTrigger value="qna">QNA</TabsTrigger>
                    <TabsTrigger value="help">Help Notes</TabsTrigger>
                    <TabsTrigger value="sync-kb">Sync KB</TabsTrigger>

                </TabsList>

                <TabsContent value="qna">
                    <QnaTabs />
                </TabsContent>

                <TabsContent value="help">
                    <HelpNotesTabs />
                </TabsContent>

                <TabsContent value="sync-kb">
                    <SyncArticlesTab/>
                </TabsContent>
            </Tabs>
        </>
    );
}

export default KnowledgeBoost;
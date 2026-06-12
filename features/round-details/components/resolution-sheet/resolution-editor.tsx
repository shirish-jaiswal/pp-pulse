"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useEffect, useState, useRef } from "react";
import { useCategories } from "@/hooks/excel-db/use-categories";
import { ResolutionEditorContent } from "@/features/round-details/components/resolution-sheet/resolution-editor-content";
import FreshdeskWorkspace from "../freshdesk/freshdesk-workspace";
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import PushResolutionButton from "./push-resolution-button";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/context/use-profile";
import { toast } from "sonner";
import { useTicketContext } from "../freshdesk/ticket-context";
import RelatedArticlesPanel from "../freshdesk/RelatedArticlesPanel";

type Props = {
    gameName: string;
};

export function ResolutionEditor({ gameName }: Props) {
    const { resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
    const { data: categories = [], isLoading } = useCategories();
    const [tabSelected, setTabSelected] = useState<string>();

    // Controls the LEFT Freshdesk sidebar workspace display limits
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [ticketInput, setTicketInput] = useState("");
    const { user } = useProfile();

    // Context synchronization handles state injection across distant components
    const { ticketId, setTicketData, setTicketId } = useTicketContext();

    const workspaceRef = useRef<{ triggerSearch: (id: string) => void } | null>(null);

    // Auto-select the first category tab once loaded
    useEffect(() => {
        if (categories.length > 0 && !tabSelected) {
            setTabSelected(categories[0].title);
        }
    }, [categories, tabSelected]);

    // RESET SIDEBAR AND CLEAR CONTEXT EXPLICITLY WHEN SHEET CLOSES:
    useEffect(() => {
        if (!resolutionEditorOpen) {
            setIsWorkspaceOpen(false);
            setTicketInput("");
            setTicketData(null);
            setTicketId(null);
        }
    }, [resolutionEditorOpen, setTicketData, setTicketId]);

    const checkFreshdeskIntegration = (): boolean => {
        if (!user?.isFreshDesk) {
            toast.warning("Freshdesk integration not configured. Redirecting to profile...");
            window.open("/portal/profile", "_blank", "noopener,noreferrer");
            return false;
        }
        return true;
    };

    const handleHeaderSearch = () => {
        if (!checkFreshdeskIntegration()) return;

        const cleanId = ticketInput.trim();
        if (!cleanId) return;

        setIsWorkspaceOpen(true);

        setTimeout(() => {
            workspaceRef.current?.triggerSearch(cleanId);
        }, 50);
    };

    if (isLoading) return null;

    return (
        <Sheet open={resolutionEditorOpen} onOpenChange={setResolutionEditorOpen}>
            <SheetContent
                className={`p-0 flex flex-col h-screen gap-1 transition-all duration-300 ease-in-out sm:max-w-none ${isWorkspaceOpen ? "w-screen min-w-[100vw]" : "w-[52vw] min-w-[50vw]"
                    }`}
            >
                {/* HEADER */}
                <SheetHeader className="shrink-0 border-b px-6 py-3 flex flex-row items-center justify-between space-y-0 gap-4">
                    <div>
                        <SheetTitle className="text-lg font-bold">
                            Resolution Workspace
                        </SheetTitle>
                        <SheetDescription>
                            Build resolution and sync with Freshdesk.
                        </SheetDescription>
                    </div>

                    <div className="flex items-center gap-2 mr-10">
                        <RelatedArticlesPanel />

                        {/* HEADER INPUT FIELD */}
                        {!isWorkspaceOpen && (
                            <div className="flex items-center gap-1.5 border rounded-md px-2 bg-background h-9 focus-within:ring-1 focus-within:ring-ring">
                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                <Input
                                    type="text"
                                    placeholder="Ticket number..."
                                    value={ticketInput}
                                    onChange={(e) => setTicketInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleHeaderSearch()}
                                    className="border-0 bg-transparent p-0 h-full w-20 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                                />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                if (!checkFreshdeskIntegration()) return;

                                if (!isWorkspaceOpen && ticketInput.trim()) {
                                    handleHeaderSearch();
                                } else {
                                    setIsWorkspaceOpen(!isWorkspaceOpen);
                                }
                            }}
                            className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-secondary hover:bg-secondary/80 transition-colors shrink-0"
                        >
                            {isWorkspaceOpen ? (
                                <>
                                    <PanelLeftClose className="h-4 w-4" />
                                    Hide Tickets
                                </>
                            ) : (
                                <>
                                    <PanelLeftOpen className="h-4 w-4" />
                                    {ticketInput.trim() ? "Load & Show Ticket" : "Show Tickets"}
                                </>
                            )}
                        </button>
                    </div>
                </SheetHeader>

                {/* MAIN SPLIT AREA */}
                <div className="flex flex-1 min-h-0 overflow-hidden">

                    {/* LEFT PANEL (Freshdesk Ticket Workspace Context Sync View) */}
                    <div
                        className={`transition-all duration-300 ease-in-out flex flex-col min-h-0 overflow-hidden ${isWorkspaceOpen ? "flex-1 opacity-100" : "w-0 opacity-0 pointer-events-none"
                            }`}
                    >
                        <FreshdeskWorkspace
                            ref={workspaceRef}
                            sharedTicketNumber={ticketInput}
                            onTicketNumberChange={setTicketInput}
                        />
                    </div>

                    {/* RIGHT PANEL (Resolution Editor Templates Workspace) */}
                    <div
                        className={`transition-all duration-300 ease-in-out flex flex-col min-h-0 ${isWorkspaceOpen ? "w-[50%] border-l" : "w-full"
                            }`}
                    >
                        <Tabs
                            value={tabSelected}
                            onValueChange={setTabSelected}
                            className="flex flex-col flex-1 min-h-0"
                        >
                            <TabsList className="relative w-full justify-start rounded-none border-b bg-transparent p-0 h-auto gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {categories.map((cat) => {
                                    const isActive = tabSelected === cat.title;
                                    return (
                                        <TabsTrigger
                                            key={cat.id}
                                            value={cat.title}
                                            className="relative rounded-none bg-transparent px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground shadow-none transition-colors duration-200 hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                        >
                                            <span className="relative z-10">{cat.title}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabUnderline"
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            {/* FIXED INTERIOR CONTENT CONTEXT */}
                            <div className="flex-1 min-h-0 overflow-y-auto p-1">
                                {categories.map((cat) => (
                                    <TabsContent
                                        key={cat.id}
                                        value={cat.title}
                                        className="h-full m-0 data-[state=inactive]:hidden focus-visible:outline-none focus-visible:ring-0"
                                    >
                                        <ResolutionEditorContent
                                            gameName={gameName}
                                            category={cat.title}
                                            tabsValue={cat.title}
                                        />
                                    </TabsContent>
                                ))}
                            </div>

                            <div className="p-1 border-t bg-background shrink-0">
                                {/* Component now picks up activeTicketId globally from the context pipeline */}
                                <PushResolutionButton activeTicketId={ticketId} />
                            </div>
                        </Tabs>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
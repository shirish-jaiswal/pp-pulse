"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTicketContext } from "@/features/round-details/components/freshdesk/ticket-context";
import useSearchArticles from "@/hooks/excel-db/use-search-articles";

import {
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    ChevronDown,
    Loader2,
    Search,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FreshdeskArticleRow } from "@/lib/excel-engine/knowledge-base/articles/load-all-articles";
import { Conversation } from "./types";

type TargetedArticleSubset = Pick<
    FreshdeskArticleRow,
    "article_id" | "title" | "seo_title" | "seo_description"
>;
/**
 * Extract high-signal keywords from noisy tickets - Stripping ALL conversational, 
 * grammatical, and structural ticketing noise.
 */
function extractHighSignalKeywords(
    text: string,
    convo_data: string[]
): string[] {
    if (!text) return convo_data;

    // 1. Scrub HTML tags, URLs, and email addresses aggressively
    const cleanText = text
        .replace(/<[^>]*>/g, " ")
        .replace(/https?:\/\/[^\s]+/g, " ")
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, " ");

    // Split text into clean alphanumeric tokens (stripping out raw conversational punctuation)
    const tokens = cleanText.split(/[\s\-,.:()"'{}@\[\]\/\\!?;*#+=%&|^~`<>]+/);

    const uniqueTargets = new Set<string>();
    const tokenFrequency: Record<string, number> = {};

    // Map structural word frequencies to safely eliminate excessively repeating phrasing
    tokens.forEach((t) => {
        const term = t.toLowerCase().trim();
        if (term.length >= 2) {
            tokenFrequency[term] = (tokenFrequency[term] || 0) + 1;
        }
    });

    // MASTER NOISE DICTIONARY: Standard English Stop Words + Conversational Jargon + Ticketing Debris
    const masterNoiseList = new Set([
        // --- 1. Basic English Grammar Stop Words ---
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
        "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
        "but", "by", "can", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
        "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has",
        "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers",
        "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in",
        "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself",
        "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
        "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should",
        "shouldnt", "so", "some", "such", "than", "that", "thatis", "the", "their", "theirs", "them",
        "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve",
        "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we",
        "wed", "well", "were", "werent", "weve", "what", "whats", "when", "whens", "where", "wheres",
        "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt",
        "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves",

        // --- 2. Conversational Jargon & Greetings ---
        "hi", "hello", "hey", "dear", "team", "regards", "thanks", "thank", "sincerely", "bye",
        "please", "kindly", "appreciate", "assistance", "help", "support", "ticket", "issue",
        "problem", "error", "bug", "urgent", "note", "attention", "request", "need", "want",
        "check", "review", "look", "see", "fix", "solve", "working", "broken", "fail", "failed",
        "good", "morning", "afternoon", "evening", "day", "hope", "well", "find", "attached",

        // --- 3. Document Layout & Ticketing Architecture Noise ---
        "confidential", "automatic", "zoom", "actual", "page", "width", "specification", "update",
        "latest", "version", "intended", "purposes", "recipients", "example", "possible", "values",
        "brand", "brands", "settings", "configuration", "response", "details", "integrations",
        "system", "phrases", "statement", "attachments", "file", "link", "view", "thread",
        "environment", "production", "completed", "attachment", "date", "time", "user", "client",
        "host", "post", "cache", "control", "api", "service", "string", "boolean", "integer", "list"
    ]);

    // Words indicating a technical key parameter follows immediately after
    const triggerWords = [
        "enable", "enables", "send", "sends", "disable", "disables",
        "including", "parameter", "options", "feature", "type", "value"
    ];

    for (let i = 0; i < tokens.length; i++) {
        const rawToken = tokens[i].trim();
        const token = rawToken.toLowerCase();

        if (token.length < 2) continue;
        if (!isNaN(Number(token))) continue; 
        if (tokenFrequency[token] > 6) continue;
        if (masterNoiseList.has(token)) continue;

        // 2. Extract technical signatures cleanly (CamelCase, PascalCase, SCREAMING_SNAKE)
        const isCamelOrPascalCase = /[a-z][A-Z]|[A-Z][a-z]/.test(rawToken);
        const isScreamingSnakeCase = /^[A-Z][A-Z0-9_]+$/.test(rawToken) && rawToken.length > 2;

        if (isCamelOrPascalCase || isScreamingSnakeCase) {
            uniqueTargets.add(rawToken);
            continue;
        }

        // 3. Extract target functional game strings (e.g., vs20olympgate, vs50amt)
        if (/^vs\d+[a-z]+/.test(token)) {
            uniqueTargets.add(token);
            continue;
        }

        // 4. Capture key targets following structural action verbs
        if (triggerWords.includes(token) && i < tokens.length - 1) {
            const adjacentToken = tokens[i + 1].trim();
            const adjacentLower = adjacentToken.toLowerCase();

            if (
                adjacentToken.length >= 3 &&
                isNaN(Number(adjacentToken)) &&
                !masterNoiseList.has(adjacentLower) &&
                tokenFrequency[adjacentLower] <= 5
            ) {
                uniqueTargets.add(adjacentToken);
                continue;
            }
        }

        // 5. Clean parameter signatures that contain joining hooks (e.g., game_id, user-token)
        if (rawToken.includes("_") || rawToken.includes("-")) {
            const fragments = token.split(/[_\-]/);
            const hasJargonFragment = fragments.some(frag => masterNoiseList.has(frag));

            // Rejects fragments compiled of jargon (e.g., "please-find", "thanks-regards")
            if (!hasJargonFragment) {
                uniqueTargets.add(rawToken);
            }
        }
    }

    // Append clean custom labels/tags
    convo_data.forEach((convo_data) => {
        const cleanTag = convo_data.toLowerCase().trim();
        if (cleanTag.length >= 2 && !masterNoiseList.has(cleanTag)) {
            uniqueTargets.add(convo_data);
        }
    });

    return Array.from(uniqueTargets);
}

export default function RelatedArticlesPanel() {
    const { ticketData } = useTicketContext();

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Create reference to panel element container
    const containerRef = useRef<HTMLDivElement>(null);

    const descriptionText =
        ticketData?.ticket?.description || "";

    const convo_data = ticketData?.conversations?.map((item: Conversation) => item.body_text) || [];

    const searchKeywords = extractHighSignalKeywords(
        descriptionText,
        convo_data
    );

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useSearchArticles(searchKeywords);

    const rawArticles = (response?.data || []) as TargetedArticleSubset[];

    // Uniqueness baseline configuration
    const articles = useMemo(() => {
        const seenIds = new Set<number | string>();
        return rawArticles.filter((article) => {
            if (!article.article_id || seenIds.has(article.article_id)) {
                return false;
            }
            seenIds.add(article.article_id);
            return true;
        });
    }, [rawArticles]);

    // Client-side text filter over matching loaded docs
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return articles;
        const lowerQuery = searchQuery.toLowerCase().trim();

        return articles.filter(
            (article) =>
                article.title?.toLowerCase().includes(lowerQuery) ||
                article.seo_title?.toLowerCase().includes(lowerQuery) ||
                article.seo_description?.toLowerCase().includes(lowerQuery)
        );
    }, [articles, searchQuery]);

    // Outside click event engine
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isOpen &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);


    if (!ticketData) return <></>
    

    return (
        <div ref={containerRef} className="w-full">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="relative w-full min-w-0 overflow-visible rounded-lg border bg-card text-card-foreground shadow-sm"
            >
                <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none">
                        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                            <BookOpen className="h-4 w-4 shrink-0 text-blue-500" />

                            <span className="truncate text-xs font-semibold tracking-tight text-foreground">
                                Related KB Ref Docs
                            </span>

                            {!isLoading && !isError && (
                                <Badge
                                    variant="secondary"
                                    className="h-4 shrink-0 bg-blue-50 px-1.5 text-[10px] font-medium text-blue-700 hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
                                    itemID="test"
                                >
                                    {filteredArticles.length === articles.length
                                        ? `${articles.length} Available`
                                        : `${filteredArticles.length} Found`}
                                </Badge>
                            )}
                        </div>

                        <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </CollapsibleTrigger>

                {/* CONTENT */}
                <CollapsibleContent className="relative w-full overflow-visible">
                    <div className="absolute inset-x-0 top-full z-50 mt-1 flex max-h-[340px] min-w-0 max-w-full flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
                        <CardContent className="flex min-w-0 flex-1 flex-col overflow-hidden p-0">

                            {/* INLINE SEARCH BAR */}
                            {!isError && (
                                <div className="relative border-b bg-background px-3 py-2 shrink-0">
                                    <Search className="absolute left-4.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
                                    <input
                                        type="text"
                                        placeholder="Filter loaded knowledge base docs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-md border bg-muted/10 pl-7 pr-3 py-1 text-xs outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-400 focus:bg-background"
                                    />
                                </div>
                            )}

                            {/* KEYWORDS */}
                            {searchKeywords.length > 0 && (
                                <div className="flex max-h-[55px] min-w-0 w-full flex-wrap gap-1 overflow-y-auto border-b bg-muted/10 px-3 pt-2 pb-1 shrink-0">
                                    {searchKeywords
                                        .slice(0, 15)
                                        .map((word, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="max-w-full whitespace-nowrap bg-background px-1 py-0 font-mono text-[9px] text-muted-foreground"
                                            >
                                                {word}
                                            </Badge>
                                        ))}

                                    {searchKeywords.length > 15 && (
                                        <span className="self-center whitespace-nowrap px-1 font-mono text-[9px] text-muted-foreground">
                                            +
                                            {searchKeywords.length - 15} keys
                                            isolated...
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* LOADING */}
                            {isLoading && (
                                <div className="flex w-full items-center justify-center space-x-2 bg-background py-8">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />

                                    <span className="text-xs text-muted-foreground">
                                        Analyzing parameter signatures...
                                    </span>
                                </div>
                            )}

                            {/* ERROR */}
                            {isError && (
                                <div className="w-full bg-background p-3">
                                    <Alert
                                        variant="destructive"
                                        className="py-2"
                                    >
                                        <AlertCircle className="h-4 w-4" />

                                        <AlertDescription className="break-all text-xs font-mono">
                                            {error?.message ||
                                                "Failed to execute lookup logic."}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}

                            {/* EMPTY */}
                            {!isLoading &&
                                !isError &&
                                filteredArticles.length === 0 && (
                                    <div className="w-full bg-background py-8 text-center text-xs italic text-muted-foreground">
                                        {articles.length === 0
                                            ? "No matching configuration articles found."
                                            : "No articles match your search filter."}
                                    </div>
                                )}

                            {/* ARTICLES */}
                            {!isLoading &&
                                !isError &&
                                filteredArticles.length > 0 && (
                                    <ScrollArea className="h-[230px] w-full min-w-0 max-w-full overflow-hidden bg-background px-3 py-2">
                                        <div className="w-[42%] max-w-full space-y-2 pb-1">
                                            {filteredArticles.map((article) => (
                                                <a
                                                    key={article.article_id}
                                                    href={`https://pragmaticplay.freshdesk.com/a/solutions/articles/${article.article_id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group block w-full min-w-[85%] max-w-[50%] overflow-hidden rounded-md border bg-background p-2.5 shadow-sm transition-all duration-150 hover:border-blue-200 hover:bg-blue-50/5 box-border"
                                                >
                                                    <div className="flex w-full min-w-0 items-start gap-2 overflow-hidden">
                                                        {/* TEXT CONTENT */}
                                                        <div className="flex-1 min-w-0 overflow-hidden space-y-0.5">
                                                            <h4 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium leading-snug text-foreground transition-colors group-hover:text-blue-600">
                                                                {article.title}
                                                            </h4>

                                                            {article.seo_title && (
                                                                <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-mono text-muted-foreground">
                                                                    SEO: {article.seo_title}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* ACTION ICON WRAPPER */}
                                                        <div className="shrink-0 rounded-sm p-0.5 text-muted-foreground opacity-60 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100">
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </div>
                                                    </div>

                                                    {/* DESCRIPTION */}
                                                    {article.seo_description && (
                                                        <p className="mt-1 w-full min-w-0 overflow-hidden break-words text-xs leading-normal text-muted-foreground/90 line-clamp-2">
                                                            {article.seo_description}
                                                        </p>
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                        </CardContent>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
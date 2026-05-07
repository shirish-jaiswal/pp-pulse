"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { UserManagementResult, UserManagementResultById } from "./user-management-result";
import { useUserManagementQuery } from "@/features/user-management/hooks/use-user-management";

type Tab = "email" | "userId";

function UserManagementContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Derive initial state from URL params
    const initialTab = (searchParams.get("tab") as Tab) || "email";
    const initialEmail = searchParams.get("email") || "";
    const initialUserId = searchParams.get("userId") || "";

    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [emailQuery, setEmailQuery] = useState(initialEmail);
    const [userIdQuery, setUserIdQuery] = useState(initialUserId);

    const { data, loading, error, fetchState, fetchByEmail, fetchByUserId } = useUserManagementQuery();

    // Track whether the initial URL-driven search has been triggered
    const didInitialFetch = useRef(false);

    // On mount, if URL already has a query param, auto-trigger search
    useEffect(() => {
        if (didInitialFetch.current) return;
        didInitialFetch.current = true;

        if (initialTab === "email" && initialEmail.trim()) {
            fetchByEmail(initialEmail.trim());
        } else if (initialTab === "userId" && initialUserId.trim()) {
            fetchByUserId(initialUserId.trim());
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Push the search query into the URL
    const updateURL = (tab: Tab, query: string) => {
        const params = new URLSearchParams();
        params.set("tab", tab);
        if (tab === "email") {
            params.set("email", query);
        } else {
            params.set("userId", query);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "email" && emailQuery.trim()) {
            updateURL("email", emailQuery.trim());
            fetchByEmail(emailQuery.trim());
        } else if (activeTab === "userId" && userIdQuery.trim()) {
            updateURL("userId", userIdQuery.trim());
            fetchByUserId(userIdQuery.trim());
        }
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        // Reflect tab change in URL, clearing the old query value
        const params = new URLSearchParams();
        params.set("tab", tab);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentQuery = activeTab === "email" ? emailQuery : userIdQuery;

    return (
        <div className="flex flex-col gap-2">

            {/* Search Card */}
            <Card className="shadow-sm border-border/60 p-0 bg-background">
                <CardContent className="p-2 pb-3 space-y-2">

                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                            User Management
                        </span>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex gap-0 border border-border rounded-md w-fit overflow-hidden">
                        <button
                            type="button"
                            onClick={() => handleTabChange("email")}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                activeTab === "email"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            Search by Email
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange("userId")}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-border ${
                                activeTab === "userId"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            Search by User ID
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        {activeTab === "email" ? (
                            <Input
                                className="h-9 text-sm max-w-sm"
                                placeholder="Search by email address or username"
                                value={emailQuery}
                                onChange={(e) => setEmailQuery(e.target.value)}
                                disabled={loading}
                            />
                        ) : (
                            <Input
                                className="h-9 text-sm max-w-sm"
                                placeholder="User ID (e.g. 58nz9ra4kdhws92w)"
                                value={userIdQuery}
                                onChange={(e) => setUserIdQuery(e.target.value)}
                                disabled={loading}
                            />
                        )}
                        <Button
                            type="submit"
                            className="h-9 text-sm px-4"
                            disabled={loading || !currentQuery.trim()}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Loading */}
            {loading && (
                <div className="rounded-md border border-border bg-card p-6 text-center">
                    <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
            )}

            {/* Error */}
            {!loading && fetchState === "error" && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive font-medium">Error</p>
                    <p className="text-xs text-destructive/80 mt-1">{error}</p>
                </div>
            )}

            {/* No data */}
            {!loading && fetchState === "empty" && (
                <div className="rounded-md border border-border bg-card p-6 text-center">
                    <p className="text-sm text-muted-foreground">No user found.</p>
                </div>
            )}

            {/* Results */}
            {!loading && fetchState === "success" && (
                activeTab === "userId"
                    ? <UserManagementResultById data={data} />
                    : <UserManagementResult data={data} />
            )}
        </div>
    );
}

export function UserManagementWrapper() {
    return <UserManagementContent />;
}

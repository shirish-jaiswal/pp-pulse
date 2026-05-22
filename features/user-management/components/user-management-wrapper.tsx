"use client";

import {  useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { UserManagementResult, UserManagementResultById } from "./user-management-result";
import { useUserManagementQuery } from "@/features/user-management/hooks/use-user-management";

import { useSearchParams } from "next/navigation";


type Tab = "email" | "userId";

function UserManagementContent() {
    const [activeTab, setActiveTab] = useState<Tab>("email");
    const [emailQuery, setEmailQuery] = useState("");
    const [userIdQuery, setUserIdQuery] = useState("");

    const searchParams = useSearchParams();
    const queryUserId = searchParams.get("userId");

    const { data, loading, error, fetchState, fetchByEmail, fetchByUserId } = useUserManagementQuery();

    useEffect(() => {
    if (queryUserId) {
        setActiveTab("userId");
        setUserIdQuery(queryUserId);
        fetchByUserId(queryUserId);
    }
    }, [queryUserId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "email" && emailQuery.trim()) {
            fetchByEmail(emailQuery.trim());
        } else if (activeTab === "userId" && userIdQuery.trim()) {
            fetchByUserId(userIdQuery.trim());
        }
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
                            onClick={() => setActiveTab("email")}
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
                            onClick={() => setActiveTab("userId")}
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

            {/* Results — flat KV for userId, collapsible cards for email */}
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

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

import {
    UserManagementResult,
    UserManagementResultById
} from "./user-management-result";

import { useUserManagementQuery } from "@/features/user-management/hooks/use-user-management";

type Tab = "email" | "userId";

function UserManagementContent() {
    const [activeTab, setActiveTab] = useState<Tab>("email");
    const [emailQuery, setEmailQuery] = useState("");
    const [userIdQuery, setUserIdQuery] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    const queryUserId = searchParams.get("userId");

    const {
        data,
        loading,
        error,
        fetchState,
        fetchByEmail,
        fetchByUserId
    } = useUserManagementQuery();

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
            router.push(`/user-management?email=${emailQuery.trim()}`);
        }

        if (activeTab === "userId" && userIdQuery.trim()) {
            fetchByUserId(userIdQuery.trim());
            router.push(`/user-management?userId=${userIdQuery.trim()}`);
        }
    };

    const currentQuery =
        activeTab === "email" ? emailQuery : userIdQuery;

    return (
        <div className="flex flex-col gap-2">

            <Card className="shadow-sm border-border/60 p-0 bg-background">
                <CardContent className="p-2 pb-3 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                            User Management
                        </span>
                    </div>

                    <div className="flex border border-border rounded-md w-fit overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setActiveTab("email")}
                            className={`px-3 py-1.5 text-xs font-medium ${
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
                            className={`px-3 py-1.5 text-xs font-medium border-l ${
                                activeTab === "userId"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            Search by User ID
                        </button>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        {activeTab === "email" ? (
                            <Input
                                className="h-9 text-sm max-w-sm"
                                placeholder="Search by email address"
                                value={emailQuery}
                                onChange={(e) => setEmailQuery(e.target.value)}
                                disabled={loading}
                            />
                        ) : (
                            <Input
                                className="h-9 text-sm max-w-sm"
                                placeholder="User ID"
                                value={userIdQuery}
                                onChange={(e) => setUserIdQuery(e.target.value)}
                                disabled={loading}
                            />
                        )}

                        <Button
                            type="submit"
                            className="h-9 px-4"
                            disabled={loading || !currentQuery.trim()}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Loading */}
            {loading && (
                <div className="rounded-md border p-6 text-center">
                    <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
            )}

            {/* Error */}
            {!loading && fetchState === "error" && (
                <div className="rounded-md border p-4">
                    <p className="text-sm text-destructive font-medium">Error</p>
                    <p className="text-xs">{error}</p>
                </div>
            )}

            {/* Empty */}
            {!loading && fetchState === "empty" && (
                <div className="rounded-md border p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        No user found.
                    </p>
                </div>
            )}

            {/* ✅ RESULTS */}
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
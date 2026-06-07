"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, AlertCircle, Loader2, Inbox } from "lucide-react";

import {
  UserManagementResult,
  UserManagementResultById,
} from "./user-management-result";

import { useUserManagementQuery } from "@/features/user-management/hooks/use-user-management";
import { UserData } from "@/lib/api/user-management/user-management";

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
    fetchByUserId,
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

  const currentQuery = activeTab === "email" ? emailQuery : userIdQuery;
  const normalizedData: UserData[] = data;

  return (
    <div className="flex flex-col gap-5 mx-auto w-full p-1">
      
      {/* ✅ SEARCH CARD */}
      <Card className="shadow-xs border-gray-200 bg-white rounded-xl p-2 shadow-lg">
        <CardContent className="px-2 space-y-1">
          
          {/* Header Title Accent */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-gray-500 stroke-[2.5]" />
            <h1 className="text-sm font-bold text-foreground uppercase tracking-wider">
              User Management
            </h1>
          </div>

          {/* ✅ TABS WITH SOLID BLACK ACTIVE TRIGGER */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "email"
                  ? "bg-black text-white shadow-xs" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Search by Email
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("userId")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "userId"
                  ? "bg-black text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Search by User ID
            </button>
          </div>

          {/* ✅ CONTROLS & INPUT FORM */}
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              {activeTab === "email" ? (
                <Input
                  type="text"
                  placeholder="Enter operator email address"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  disabled={loading}
                  className="pl-9 h-9 text-sm border-gray-200 focus-visible:ring-black rounded-lg bg-white"
                />
              ) : (
                <Input
                  type="text"
                  placeholder="Enter exact user ID"
                  value={userIdQuery}
                  onChange={(e) => setUserIdQuery(e.target.value)}
                  disabled={loading}
                  className="pl-9 h-9 text-sm border-gray-200 focus-visible:ring-black rounded-lg bg-white"
                />
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 font-semibold text-xs uppercase tracking-wider bg-black hover:bg-gray-800 text-white transition-all"
              disabled={loading || !currentQuery.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Searching
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>

        </CardContent>
      </Card>

      {/* ✅ LOADING INDICATOR */}
      {loading && (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
          <Loader2 className="h-6 w-6 animate-spin text-gray-800" />
          <p className="text-sm font-medium text-muted-foreground">Querying lookup registries...</p>
        </div>
      )}

      {/* ✅ ERROR BOX SYSTEM */}
      {!loading && fetchState === "error" && (
        <div className="rounded-xl border border-red-200 p-4 bg-red-50/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm text-red-800 font-semibold">Query Resolution failure</p>
            <p className="text-xs text-red-600/90 font-medium">{error || "An unknown exception occurred during query runtime execution."}</p>
          </div>
        </div>
      )}

      {/* ✅ EMPTY DATA PLACEHOLDER */}
      {!loading && fetchState === "empty" && (
        <div className="rounded-xl border border-gray-200 bg-gray-50/30 p-12 text-center flex flex-col items-center justify-center gap-2.5">
          <Inbox className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">No Records Found</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              No entities matching your query could be mapped inside our active system domains.
            </p>
          </div>
        </div>
      )}

      {/* ✅ ACTIVE DYNAMIC RESULTS VIEW */}
      {!loading && fetchState === "success" && (
        <div className="space-y-2">
          {activeTab === "userId" ? (
            <UserManagementResultById data={normalizedData} />
          ) : (
            <UserManagementResult data={normalizedData} />
          )}
        </div>
      )}

    </div>
  );
}

export function UserManagementWrapper() {
  return <UserManagementContent />;
}
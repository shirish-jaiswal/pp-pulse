"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

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

  const currentQuery =
    activeTab === "email" ? emailQuery : userIdQuery;

  /* ✅ ✅ ✅ ✅ FINAL FIX */
  const normalizedData: UserData[] = data;

  return (
    <div className="flex flex-col gap-4">

      {/* ✅ SEARCH CARD */}
      <Card className="shadow-sm border bg-white">
        <CardContent className="p-4 space-y-4">

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm font-semibold text-gray-800">
              User Management
            </span>
          </div>

          {/* ✅ TABS */}
          <div className="flex rounded-md border overflow-hidden w-fit">
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 text-sm ${
                activeTab === "email"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Search by Email
            </button>

            <button
              onClick={() => setActiveTab("userId")}
              className={`px-4 py-2 text-sm border-l ${
                activeTab === "userId"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Search by User ID
            </button>
          </div>

          {/* ✅ INPUT */}
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            {activeTab === "email" ? (
              <Input
                placeholder="Enter email address"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                disabled={loading}
                className="max-w-sm"
              />
            ) : (
              <Input
                placeholder="Enter user ID"
                value={userIdQuery}
                onChange={(e) => setUserIdQuery(e.target.value)}
                disabled={loading}
                className="max-w-sm"
              />
            )}

            <Button
              type="submit"
              disabled={loading || !currentQuery.trim()}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

        </CardContent>
      </Card>

      {/* ✅ LOADING */}
      {loading && (
        <div className="rounded-md border p-6 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}

      {/* ✅ ERROR */}
      {!loading && fetchState === "error" && (
        <div className="rounded-md border p-4 bg-red-50">
          <p className="text-sm text-red-600 font-medium">Error</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* ✅ EMPTY */}
      {!loading && fetchState === "empty" && (
        <div className="rounded-md border p-6 text-center text-sm text-gray-500">
          No user found
        </div>
      )}

      {/* ✅ RESULTS */}
      {!loading && fetchState === "success" && (
        activeTab === "userId"
          ? <UserManagementResultById data={normalizedData} />
          : <UserManagementResult data={normalizedData} />
      )}

    </div>
  );
}

export function UserManagementWrapper() {
  return <UserManagementContent />;
}
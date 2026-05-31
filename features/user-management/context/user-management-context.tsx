"use client";

import { createContext, useContext, useState } from "react";
import { UserData } from "@/lib/api/user-management/user-management";

export type SearchTab = "email" | "userId";

type UserManagementContextType = {
    activeTab: SearchTab;
    setActiveTab: (v: SearchTab) => void;

    emailQuery: string;
    setEmailQuery: (v: string) => void;

    userIdQuery: string;
    setUserIdQuery: (v: string) => void;

    // ✅ FIXED → ARRAY
    data: UserData[];
    setData: (v: UserData[]) => void;

    loading: boolean;
    setLoading: (v: boolean) => void;

    error: string | null;
    setError: (v: string | null) => void;
};

const UserManagementContext = createContext<UserManagementContextType | null>(null);

export function UserManagementProvider({ children }: { children: React.ReactNode }) {

    const [activeTab, setActiveTab] = useState<SearchTab>("email");
    const [emailQuery, setEmailQuery] = useState("");
    const [userIdQuery, setUserIdQuery] = useState("");

    // ✅ FIXED → array default
    const [data, setData] = useState<UserData[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <UserManagementContext.Provider
            value={{
                activeTab, setActiveTab,
                emailQuery, setEmailQuery,
                userIdQuery, setUserIdQuery,
                data, setData,
                loading, setLoading,
                error, setError,
            }}
        >
            {children}
        </UserManagementContext.Provider>
    );
}

export const useUserManagement = () => {
    const ctx = useContext(UserManagementContext);
    if (!ctx) {
        throw new Error("useUserManagement must be used inside UserManagementProvider");
    }
    return ctx;
};

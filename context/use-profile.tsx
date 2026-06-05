"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { c_getUser } from "@/lib/api/auth/user/me";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  freshdesk?: string;
  isFreshDesk?: boolean;
};

type ProfileContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  authReady: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
    useEffect(() => {
    let alive = true;

    const loadUser = async () => {
      try {
        const data = await c_getUser();

        if (!alive) return;

        setUser(data ?? null);
      } catch (err) {
        setUser(null);
      } finally {
        if (alive) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    };

    loadUser();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{ user, setUser, loading, authReady }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);

  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return ctx;
}
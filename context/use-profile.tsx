"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
};

type ProfileContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <ProfileContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
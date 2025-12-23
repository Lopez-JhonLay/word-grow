"use client";

import { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
  user: User | null;
};

export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

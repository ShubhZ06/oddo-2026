"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Role } from "@/types";

interface UserSession {
  id: number;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionStr = localStorage.getItem("transitops_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session);
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

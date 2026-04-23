"use client";

import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";
import { AUTH_EMAIL_KEY } from "@/lib/constants/auth";

interface AuthContextType {
  authenticated: boolean;
  email: string | null;
  setAuth: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  email: null,
  setAuth: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => {
      setAuthenticated(d.authenticated);
      if (d.authenticated) setEmail(localStorage.getItem(AUTH_EMAIL_KEY));
    });
  }, []);

  const setAuth = useCallback(async (email: string, token: string) => {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    localStorage.setItem(AUTH_EMAIL_KEY, email);
    setEmail(email);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    localStorage.removeItem(AUTH_EMAIL_KEY);
    setEmail(null);
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, email, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

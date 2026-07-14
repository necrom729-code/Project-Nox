"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type User = { email: string; uid: string };

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "necrom.session";

function uidFor(email: string): string {
  if (typeof btoa === "function") return btoa(email).replace(/=/g, "");
  return encodeURIComponent(email);
}

function initialUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw new Error("required");
    await new Promise((r) => setTimeout(r, 500));
    persist({ email, uid: uidFor(email) });
  }, [persist]);

  const register = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw new Error("required");
    await new Promise((r) => setTimeout(r, 500));
    persist({ email, uid: uidFor(email) });
  }, [persist]);

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type AuthUser,
  apiMe,
  apiLogin,
  apiSignup,
  apiLogout,
  saveToken,
  clearToken,
} from '@/lib/client-api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    marketingConsent: boolean;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const me = await apiMe();
    setUser(me);
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  async function login(email: string, password: string) {
    const { token, user: u } = await apiLogin({ email, password });
    saveToken(token);
    setUser(u);
  }

  async function signup(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    marketingConsent: boolean;
  }) {
    const { token, user: u } = await apiSignup(data);
    saveToken(token);
    setUser(u);
  }

  function logout() {
    apiLogout();
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

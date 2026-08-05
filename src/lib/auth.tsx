import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "./api";

export type PublicUser = {
  id: number;
  username: string;
  email: string;
  chips: number;
};

type AuthCtx = {
  ready: boolean;
  token: string | null;
  user: PublicUser | null;
  busy: boolean;
  error: string | null;
  loginPromptOpen: boolean;
  promptLogin: () => void;
  closeLoginPrompt: () => void;
  register: (email: string, password: string, username?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setChips: (chips: number) => void;
  clearError: () => void;
};

const TOKEN_KEY = "onyx_token";
const ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    apiFetch<PublicUser>("/api/auth/me", { token })
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const promptLogin = useCallback(() => setLoginPromptOpen(true), []);
  const closeLoginPrompt = useCallback(() => setLoginPromptOpen(false), []);

  const register = useCallback(async (email: string, password: string, username?: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{ token: string; user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username: username || undefined, source: "casino-app-web" }),
      });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      setLoginPromptOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo crear la cuenta");
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{ token: string; user: PublicUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      setLoginPromptOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Credenciales inválidas");
      throw e;
    } finally {
      setBusy(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setLoginPromptOpen(false);
  }, []);

  const setChips = useCallback((chips: number) => {
    setUser((u) => (u ? { ...u, chips } : u));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      ready,
      token,
      user,
      busy,
      error,
      loginPromptOpen,
      promptLogin,
      closeLoginPrompt,
      register,
      login,
      logout,
      setChips,
      clearError,
    }),
    [ready, token, user, busy, error, loginPromptOpen, promptLogin, closeLoginPrompt, register, login, logout, setChips, clearError]
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

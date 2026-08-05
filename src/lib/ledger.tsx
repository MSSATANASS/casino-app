import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LedgerEntry = {
  id: string;
  ts: number;
  kind: "deposit" | "bet" | "win" | "withdraw";
  amount: number;
  note: string;
};

export type GameSession = {
  game: "crash" | "mines" | "plinko" | "towers";
  serverSeed: string;
  serverHash: string;
  clientSeed: string;
  nonce: number;
};

type LedgerCtx = {
  balance: number;
  entries: LedgerEntry[];
  session: GameSession;
  newSession: (game: GameSession["game"]) => void;
  deposit: (amount: number) => void;
  bet: (amount: number, game: GameSession["game"]) => void;
  win: (amount: number, note: string) => void;
  withdraw: (amount: number) => void;
};

const START_BALANCE = 1000;

const ctx = createContext<LedgerCtx | null>(null);

function randHex(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(() => {
    const v = Number(localStorage.getItem("onyx_balance"));
    return Number.isFinite(v) && v > 0 ? v : START_BALANCE;
  });
  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    try {
      const v = localStorage.getItem("onyx_entries");
      return v ? (JSON.parse(v) as LedgerEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [session, setSession] = useState<GameSession>(() => ({
    game: "crash",
    serverSeed: randHex(32),
    serverHash: randHex(32),
    clientSeed: "onyx-demo-client",
    nonce: 0,
  }));

  useEffect(() => {
    localStorage.setItem("onyx_balance", String(balance));
  }, [balance]);
  useEffect(() => {
    localStorage.setItem("onyx_entries", JSON.stringify(entries.slice(0, 200)));
  }, [entries]);

  const push = useCallback((e: Omit<LedgerEntry, "id" | "ts">) => {
    setEntries((prev) => [{ id: randHex(8), ts: Date.now(), ...e }, ...prev].slice(0, 200));
  }, []);

  const newSession = useCallback((game: GameSession["game"]) => {
    setSession((s) => ({ ...s, game, serverSeed: randHex(32), nonce: s.nonce + 1 }));
  }, []);

  const deposit = useCallback(
    (amount: number) => {
      setBalance((b) => b + amount);
      push({ kind: "deposit", amount, note: `Depósito USDT confirmado (sandbox)` });
    },
    [push]
  );

  const bet = useCallback(
    (amount: number, game: GameSession["game"]) => {
      setBalance((b) => b - amount);
      push({ kind: "bet", amount: -amount, note: `Apuesta en ${game}` });
    },
    [push]
  );

  const win = useCallback(
    (amount: number, note: string) => {
      setBalance((b) => b + amount);
      push({ kind: "win", amount, note });
    },
    [push]
  );

  const withdraw = useCallback(
    (amount: number) => {
      setBalance((b) => b - amount);
      push({ kind: "withdraw", amount: -amount, note: "Retiro USDT (sandbox — no enviado)" });
    },
    [push]
  );

  const value = useMemo(
    () => ({ balance, entries, session, newSession, deposit, bet, win, withdraw }),
    [balance, entries, session, newSession, deposit, bet, win, withdraw]
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}

export function useLedger(): LedgerCtx {
  const v = useContext(ctx);
  if (!v) throw new Error("useLedger must be used inside LedgerProvider");
  return v;
}

export function hashSession(serverSeed: string, clientSeed: string, nonce: number): string {
  return serverSeed + "|" + clientSeed + "|" + nonce;
}

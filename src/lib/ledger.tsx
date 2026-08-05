import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, newIdempotencyKey } from "./api";
import { useAuth } from "./auth";

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
  deposit: (amount: number) => Promise<void>;
  bet: (amount: number, game: GameSession["game"]) => void;
  win: (amount: number, note: string) => void;
  withdraw: (amount: number) => void;
};

type ApiEntry = {
  id: number;
  kind: string;
  amount: number;
  idempotency_key: string;
  meta: string;
  created_at: string;
};

const ctx = createContext<LedgerCtx | null>(null);

function randHex(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function noteFromMeta(kind: string, metaRaw: string): string {
  try {
    const meta = JSON.parse(metaRaw || "{}") as { note?: string; game?: string };
    if (meta.note) return meta.note;
    if (meta.game) return `${kind === "bet" ? "Apuesta" : "Resultado"} en ${meta.game}`;
  } catch {
    /* noop */
  }
  return kind === "deposit" ? "Compra de fichas" : kind;
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const { token, user, setChips } = useAuth();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [session, setSession] = useState<GameSession>(() => ({
    game: "crash",
    serverSeed: randHex(32),
    serverHash: randHex(32),
    clientSeed: "onyx-demo-client",
    nonce: 0,
  }));

  useEffect(() => {
    if (!token) {
      setEntries([]);
      return;
    }
    let cancelled = false;
    apiFetch<ApiEntry[]>("/api/ledger/entries?limit=100", { token })
      .then((rows) => {
        if (cancelled) return;
        setEntries(
          rows.map((r) => ({
            id: String(r.id),
            ts: new Date(r.created_at).getTime(),
            kind: (r.kind === "payout" ? "win" : r.kind) as LedgerEntry["kind"],
            amount: r.kind === "bet" || r.kind === "withdraw" ? -Math.abs(r.amount) : Math.abs(r.amount),
            note: noteFromMeta(r.kind, r.meta),
          }))
        );
      })
      .catch(() => {
        /* si falla, se conserva lo que ya hay en memoria */
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const push = useCallback((e: Omit<LedgerEntry, "id" | "ts">) => {
    setEntries((prev) => [{ id: randHex(8), ts: Date.now(), ...e }, ...prev].slice(0, 200));
  }, []);

  const newSession = useCallback((game: GameSession["game"]) => {
    setSession((s) => ({ ...s, game, serverSeed: randHex(32), nonce: s.nonce + 1 }));
  }, []);

  const deposit = useCallback(
    async (amount: number) => {
      if (!token) throw new Error("Inicia sesión para comprar fichas");
      const res = await apiFetch<{ chips: number; deposited: number }>("/api/ledger/deposit", {
        method: "POST",
        token,
        body: JSON.stringify({ amount, idempotency_key: newIdempotencyKey() }),
      });
      setChips(res.chips);
      push({ kind: "deposit", amount, note: "Compra de fichas confirmada" });
    },
    [token, setChips, push]
  );

  const adjust = useCallback(
    async (kind: "bet" | "win" | "withdraw", amount: number, game: string, note: string) => {
      if (!token) return;
      try {
        const res = await apiFetch<{ chips: number }>("/api/ledger/adjust", {
          method: "POST",
          token,
          body: JSON.stringify({ kind, amount, game, note, idempotency_key: newIdempotencyKey() }),
        });
        setChips(res.chips);
      } catch {
        /* la ronda ya se jugo en el cliente; el balance se resincroniza en el proximo refresh */
      }
    },
    [token, setChips]
  );

  const bet = useCallback(
    (amount: number, game: GameSession["game"]) => {
      setChips(Math.max(0, (user?.chips ?? 0) - amount));
      push({ kind: "bet", amount: -amount, note: `Apuesta en ${game}` });
      void adjust("bet", amount, game, `Apuesta en ${game}`);
    },
    [user, setChips, push, adjust]
  );

  const win = useCallback(
    (amount: number, note: string) => {
      setChips((user?.chips ?? 0) + amount);
      push({ kind: "win", amount, note });
      void adjust("win", amount, session.game, note);
    },
    [user, setChips, push, adjust, session.game]
  );

  const withdraw = useCallback(
    (amount: number) => {
      setChips(Math.max(0, (user?.chips ?? 0) - amount));
      push({ kind: "withdraw", amount: -amount, note: "Canje de fichas" });
      void adjust("withdraw", amount, "withdraw", "Canje de fichas");
    },
    [user, setChips, push, adjust]
  );

  const value = useMemo(
    () => ({ balance: user?.chips ?? 0, entries, session, newSession, deposit, bet, win, withdraw }),
    [user, entries, session, newSession, deposit, bet, win, withdraw]
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

import { useEffect, useMemo, useRef, useState } from "react";
import { useLedger } from "../lib/ledger";
import AmountInput from "./AmountInput";

const CRASH_MAX = 4.04;

function crashPointFromSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.abs(h);
  const pct = (h % 10000) / 10000;
  const crash = 1.01 + pct * (CRASH_MAX - 1.01);
  return Math.min(Math.max(crash, 1.01), CRASH_MAX);
}

type Phase = "idle" | "running" | "crashed";

export default function Crash() {
  const { balance, session, bet, win, newSession } = useLedger();
  const [amount, setAmount] = useState(5);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mult, setMult] = useState(1.0);
  const [cashed, setCashed] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const crashAt = useMemo(() => crashPointFromSeed(session.serverSeed), [session.serverSeed]);
  const raf = useRef(0);
  const lastTs = useRef(0);

  const start = () => {
    if (phase !== "idle" || amount <= 0 || amount > balance) return;
    bet(amount, "crash");
    setCashed(false);
    setMult(1.0);
    setPhase("running");
    lastTs.current = performance.now();
    const tick = (t: number) => {
      const dt = (t - lastTs.current) / 1000;
      lastTs.current = t;
      setMult((m) => m * (1 + dt * 0.55));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (phase === "running" && mult >= crashAt) {
      cancelAnimationFrame(raf.current);
      setMult(crashAt);
      setPhase("crashed");
      setHistory((h) => [crashAt, ...h].slice(0, 12));
    }
  }, [mult, phase, crashAt]);

  useEffect(() => {
    if (phase !== "crashed") return;
    const t = setTimeout(() => {
      setPhase("idle");
      newSession("crash");
    }, 1600);
    return () => clearTimeout(t);
  }, [phase, newSession]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const cashOut = () => {
    if (phase !== "running") return;
    cancelAnimationFrame(raf.current);
    const payout = amount * mult;
    win(payout, `Crash cash out a ${mult.toFixed(2)}x`);
    setCashed(true);
    setPhase("idle");
    setHistory((h) => [mult, ...h].slice(0, 12));
    newSession("crash");
  };

  const { points, path } = useMemo(() => buildCurve(mult), [mult]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black tracking-widest text-white">CRASH</h1>
          <p className="text-[11px] text-sub">Ronda {session.nonce} · seed firmado antes de jugar</p>
        </div>
        <div className="flex items-center gap-1.5">
          {history.map((h, i) => (
            <span
              key={i}
              className={`rounded-md px-2 py-1 text-[10px] font-black ${h >= 2 ? "bg-green/20 text-[#27AE60]" : "bg-red-500/20 text-red-400"}`}
            >
              {h.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      <div className="glass-neon relative overflow-hidden rounded-xl p-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(0,207,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative flex h-64 items-center justify-center">
          {phase === "idle" && (
            <div className="text-center">
              <p className="text-lg font-black text-white">ROUND IN PROGRESS</p>
              <p className="mt-1 text-xs text-sub">Apunta un multiplicador y saca tus fichas antes del crash</p>
            </div>
          )}
          {phase !== "idle" && (
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-sub">
                {phase === "crashed" ? "CRASH" : "ROUND IN PROGRESS"}
              </p>
              <p
                className={`mt-1 text-6xl font-black tabular-nums ${
                  phase === "crashed" ? "text-red-400" : "text-[#00CFFF] [text-shadow:0_0_30px_rgba(0,207,255,0.7)]"
                }`}
              >
                {mult.toFixed(2)}x
              </p>
              {phase === "running" && (
                <p className="mt-2 text-[11px] font-bold text-[#27AE60]">
                  {cashed ? "Cash out registrado" : "— cash out en " + (amount * mult).toFixed(2) + " —"}
                </p>
              )}
            </div>
          )}
        </div>
        <svg viewBox="0 0 600 220" className="absolute inset-x-6 bottom-4 h-28 w-[calc(100%-3rem)]">
          <path d={path} fill="none" stroke={phase === "crashed" ? "#f87171" : "#00CFFF"} strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 8px rgba(0,207,255,0.8))" }} />
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="#00CFFF" />
        </svg>
      </div>

      <div className="glass grid gap-4 rounded-xl p-4 md:grid-cols-[1fr_auto_auto]">
        <AmountInput value={amount} onChange={setAmount} disabled={phase !== "idle"} />
        <div className="flex flex-col justify-end gap-2">
          <button
            onClick={start}
            disabled={phase !== "idle" || amount <= 0 || amount > balance}
            className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
          >
            {phase === "idle" ? "BET" : "Ronda en curso"}
          </button>
          <button
            onClick={cashOut}
            disabled={phase !== "running"}
            className="btn-blue px-8 py-3 text-sm disabled:opacity-40"
          >
            CASH OUT
          </button>
        </div>
        <div className="flex flex-col justify-end text-right">
          <p className="text-[10px] uppercase tracking-wider text-sub">Payout si sacas ahora</p>
          <p className="text-xl font-black text-white">${(amount * mult).toFixed(2)}</p>
          <p className="mt-1 text-[10px] text-sub">
            Seed: <span className="font-mono text-[#00CFFF]">{session.serverSeed.slice(0, 10)}…</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function buildCurve(mult: number) {
  const w = 600;
  const h = 200;
  const t = Math.min(mult, CRASH_MAX);
  const n = 120;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const m = 1 + (t - 1) * Math.pow(f, 1.6);
    const x = (f * w) * 0.92;
    const y = h - ((m - 1) / 3) * h * 0.92 - 10;
    pts.push({ x, y });
  }
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  return { points: pts, path };
}

import { useEffect, useRef, useState } from "react";
import { useLedger } from "../lib/ledger";
import AmountInput from "./AmountInput";

const ROWS = 12;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PAYOUTS: Record<number, number> = { 0: 0.5, 1: 0.7, 2: 1, 3: 1.5, 4: 2.5, 5: 5, 6: 12, 7: 5, 8: 2.5, 9: 1.5, 10: 1, 11: 0.7, 12: 0.5 };

export default function Plinko() {
  const { balance, session, bet, win, newSession } = useLedger();
  const [amount, setAmount] = useState(5);
  const [dropping, setDropping] = useState(false);
  const [ball, setBall] = useState<{ x: number; y: number; col: number } | null>(null);
  const [result, setResult] = useState<{ col: number; mult: number; payout: number } | null>(null);
  const [history, setHistory] = useState<{ mult: number; payout: number }[]>([]);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const drop = () => {
    if (dropping || amount <= 0 || amount > balance) return;
    bet(amount, "plinko");
    setDropping(true);
    setResult(null);
    const rnd = mulberry32(seedFromString(session.serverSeed + "|plinko"));
    const cols: number[] = [];
    let pos = ROWS / 2;
    for (let r = 0; r < ROWS; r++) {
      pos += rnd() < 0.5 ? -1 : 1;
      cols.push(pos);
    }
    const target = Math.min(Math.max(pos, 0), ROWS);
    const xStart = ROWS / 2;
    let t = 0;
    const dur = 1800;
    const step = (ts: number) => {
      t = ts;
      const progress = Math.min(t / dur, 1);
      const x = xStart + (target - xStart) * progress;
      const y = (progress * (ROWS + 2) * 22) / 1.2;
      setBall({ x, y, col: target });
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        const mult = PAYOUTS[target] ?? 1;
        const payout = amount * mult;
        win(payout, `Plinko ${mult >= 1 ? "ganó" : "no ganó"} ${mult.toFixed(2)}x`);
        setResult({ col: target, mult, payout });
        setHistory((h) => [{ mult, payout }, ...h].slice(0, 10));
        setDropping(false);
        setBall(null);
        newSession("plinko");
      }
    };
    raf.current = requestAnimationFrame((ts) => {
      t = ts;
      step(ts);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black tracking-widest text-white">PLINKO</h1>
          <p className="text-[11px] text-sub">RTP 99.0% · Volatilidad baja · 12 filas</p>
        </div>
        <div className="flex items-center gap-1.5">
          {history.slice(0, 6).map((h, i) => (
            <span key={i} className={`rounded-md px-2 py-1 text-[10px] font-black ${h.mult >= 1 ? "bg-green/20 text-[#27AE60]" : "bg-red-500/20 text-red-400"}`}>
              {h.mult.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      <div className="glass-neon relative overflow-hidden rounded-xl p-4">
        <svg viewBox="0 0 200 300" className="mx-auto w-full max-w-md">
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: r + 1 }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={100 - r * 7 + c * 14}
                cy={30 + r * 20}
                r={2.2}
                fill={r % 2 === 0 ? "rgba(0,207,255,0.75)" : "rgba(45,127,255,0.75)"}
              />
            ))
          )}
          {Array.from({ length: ROWS + 1 }).map((_, c) => (
            <text
              key={c}
              x={c * 14 + 100 - ROWS * 7}
              y={ROWS * 20 + 48}
              textAnchor="middle"
              fontSize={7}
              fontWeight={900}
              fill={PAYOUTS[c] >= 1 ? "#27AE60" : "#f87171"}
            >
              {PAYOUTS[c].toFixed(1)}x
            </text>
          ))}
          {ball && <circle cx={ball.x} cy={ball.y} r={5} fill="#00CFFF" style={{ filter: "drop-shadow(0 0 6px #00CFFF)" }} />}
        </svg>
        {result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="glass-neon rounded-xl px-6 py-4 text-center">
              <p className={`text-2xl font-black ${result.mult >= 1 ? "text-[#27AE60]" : "text-red-400"}`}>
                {result.mult.toFixed(2)}x
              </p>
              <p className="mt-1 text-xs text-sub">
                {result.mult >= 1 ? `+$${(result.payout - amount).toFixed(2)}` : `-$${amount.toFixed(2)}`}
              </p>
              <button onClick={() => setResult(null)} className="btn-primary mt-3 px-4 py-1.5 text-xs">
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="glass grid gap-4 rounded-xl p-4 md:grid-cols-[1fr_auto]">
        <AmountInput value={amount} onChange={setAmount} disabled={dropping} presets={[1, 5, 10, 25, 50]} />
        <div className="flex flex-col justify-end">
          <button
            onClick={drop}
            disabled={dropping || amount <= 0 || amount > balance}
            className="btn-primary px-10 py-3 text-sm disabled:opacity-40"
          >
            BET {amount > 0 ? `$${amount.toFixed(2)}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

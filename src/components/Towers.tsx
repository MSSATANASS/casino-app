import { useMemo, useState } from "react";
import { Crown } from "lucide-react";
import { useLedger } from "../lib/ledger";
import AmountInput from "./AmountInput";

const ROWS = 8;
const COLS = 3;

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

const PAYOUTS = [1, 1.5, 2.4, 3.6, 5.5, 8.5, 13, 20, 31, 46, 68, 100];

export default function Towers() {
  const { balance, session, bet, win, newSession } = useLedger();
  const [amount, setAmount] = useState(5);
  const [level, setLevel] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [lost, setLost] = useState(false);
  const [done, setDone] = useState(false);

  const mult = useMemo(() => PAYOUTS[Math.min(level, PAYOUTS.length - 1)], [level]);

  const board = useMemo(() => {
    const rnd = mulberry32(seedFromString(session.serverSeed + "|towers"));
    const rows: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: number[] = [];
      while (row.length < COLS - 1) {
        const c = Math.floor(rnd() * COLS);
        if (!row.includes(c)) row.push(c);
      }
      rows.push(row[0]);
    }
    return rows;
  }, [session.serverSeed]);

  const startNew = () => {
    if (amount <= 0 || amount > balance) return;
    bet(amount, "towers");
    setLevel(0);
    setPicked({});
    setLost(false);
    setDone(false);
  };

  const pick = (r: number, c: number) => {
    if (r !== level || done || lost || picked[r] !== undefined) return;
    if (board[r] === c) {
      setLost(true);
      setPicked((p) => ({ ...p, [r]: c }));
      newSession("towers");
      return;
    }
    setPicked((p) => ({ ...p, [r]: c }));
    setLevel((l) => l + 1);
    if (r === ROWS - 1) {
      cashOut();
    }
  };

  const cashOut = () => {
    if (level === 0) return;
    const payout = amount * mult;
    win(payout, `Towers cash out nivel ${level} a ${mult.toFixed(2)}x`);
    setDone(true);
    newSession("towers");
  };

  const rowWasPicked = (r: number) => picked[r] !== undefined;
  const rowLost = (r: number) => picked[r] !== undefined && board[r] === picked[r];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black tracking-widest text-white">TOWERS</h1>
          <p className="text-[11px] text-sub">8 niveles · 1 trampa por fila · pago x{mult.toFixed(2)}</p>
        </div>
        {lost && <span className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-black text-red-400">CAÍSTE · PERDISTE</span>}
        {done && <span className="rounded-lg bg-green/20 px-3 py-1.5 text-xs font-black text-[#27AE60]">CASH OUT {mult.toFixed(2)}x</span>}
      </div>

      <div className="glass-neon rounded-xl p-5">
        <div className="flex flex-col-reverse gap-2">
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} className={`flex items-center gap-2 ${r === level && !done && !lost ? "opacity-100" : "opacity-80"}`}>
              <span className="w-16 text-right text-[10px] font-black text-sub">
                x{PAYOUTS[Math.min(r + 1, PAYOUTS.length - 1)].toFixed(1)}
              </span>
              <div className={`grid flex-1 gap-2 ${COLS === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                {Array.from({ length: COLS }).map((_, c) => {
                  const isPicked = picked[r] === c;
                  const isTrap = rowLost(r) && isPicked;
                  const isOk = rowWasPicked(r) && !isTrap;
                  return (
                    <button
                      key={c}
                      onClick={() => pick(r, c)}
                      disabled={done || lost || picked[r] !== undefined}
                      className={`flex aspect-[4/2] items-center justify-center rounded-md border text-[11px] font-black transition-all ${
                        isTrap
                          ? "border-red-500/60 bg-red-500/25 text-red-300"
                          : isOk
                            ? "border-[rgba(39,174,96,0.6)] bg-green/25 text-[#27AE60] [box-shadow:0_0_12px_rgba(39,174,96,0.45)]"
                            : "border-white/10 bg-[#141b33] text-white hover:border-[rgba(0,207,255,0.5)] hover:bg-[#1a2344]"
                      }`}
                    >
                      {isTrap ? "X" : isOk ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass grid gap-4 rounded-xl p-4 md:grid-cols-[1fr_auto]">
        <AmountInput value={amount} onChange={setAmount} disabled={level > 0 && !done && !lost} />
        <div className="flex flex-col justify-end gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-sub">Ganancia actual</p>
            <p className="text-xl font-black text-white">${(amount * mult).toFixed(2)}</p>
          </div>
          <button
            onClick={cashOut}
            disabled={level === 0 || done || lost}
            className="btn-blue px-8 py-3 text-sm disabled:opacity-40"
          >
            CASH OUT
          </button>
          <button
            onClick={startNew}
            disabled={(level > 0 && !done && !lost) || amount <= 0 || amount > balance}
            className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
          >
            <Crown size={13} className="mr-1 inline" /> NUEVA RONDA
          </button>
        </div>
      </div>
    </div>
  );
}

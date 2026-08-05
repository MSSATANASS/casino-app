import { useMemo, useState } from "react";
import { Gem, Bomb } from "lucide-react";
import { useLedger } from "../lib/ledger";
import AmountInput from "./AmountInput";

const SIZE = 5;
const MINES = 3;

type Cell = { mine: boolean; revealed: boolean };

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

export default function Mines() {
  const { balance, isAuthed, session, bet, win, newSession } = useLedger();
  const [amount, setAmount] = useState(5);
  const [grid, setGrid] = useState<Cell[]>(() => initGrid(session.serverSeed));
  const [picked, setPicked] = useState(0);
  const [lost, setLost] = useState(false);
  const [done, setDone] = useState(false);

  const mult = useMemo(() => (1 + picked * 0.45) * 1.0, [picked]);
  const chance = useMemo(() => 100 * ((SIZE * SIZE - MINES - picked) / (SIZE * SIZE - picked)), [picked]);

  function initGrid(seed: string): Cell[] {
    const rnd = mulberry32(seedFromString(seed));
    const cells: Cell[] = Array.from({ length: SIZE * SIZE }, () => ({ mine: false, revealed: false }));
    let placed = 0;
    while (placed < MINES) {
      const idx = Math.floor(rnd() * cells.length);
      if (!cells[idx].mine) {
        cells[idx].mine = true;
        placed++;
      }
    }
    return cells;
  }

  const startNew = () => {
    if (amount <= 0 || (isAuthed && amount > balance)) return;
    bet(amount, "mines");
    setGrid(initGrid(session.serverSeed));
    setPicked(0);
    setLost(false);
    setDone(false);
  };

  const reveal = (i: number) => {
    if (!isAuthed || done || lost || grid[i].revealed) return;
    if (grid[i].mine) {
      setLost(true);
      setGrid((g) => g.map((c, j) => (j === i ? { ...c, revealed: true } : c)));
      newSession("mines");
      return;
    }
    const next = grid.map((c, j) => (j === i ? { ...c, revealed: true } : c));
    setGrid(next);
    setPicked((p) => p + 1);
  };

  const cashOut = () => {
    if (picked === 0) return;
    const payout = amount * mult;
    win(payout, `Mines cash out con ${picked} diamantes a ${mult.toFixed(2)}x`);
    setDone(true);
    newSession("mines");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black tracking-widest text-white">MINES</h1>
          <p className="text-[11px] text-sub">
            {MINES} bombas ocultas · probabilidad de acierto {chance.toFixed(1)}%
          </p>
        </div>
        {lost && (
          <span className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-black text-red-400">
            BOMBA · PERDISTE
          </span>
        )}
        {done && (
          <span className="rounded-lg bg-green/20 px-3 py-1.5 text-xs font-black text-[#27AE60]">
            CASH OUT {mult.toFixed(2)}x
          </span>
        )}
      </div>

      <div className="glass-neon rounded-xl p-5">
        <div className="grid grid-cols-5 gap-2.5">
          {grid.map((c, i) => (
            <button
              key={i}
              onClick={() => reveal(i)}
              disabled={done || lost}
              className={`relative flex aspect-square items-center justify-center rounded-lg border text-lg transition-all ${
                c.revealed
                  ? c.mine
                    ? "border-red-500/60 bg-red-500/20 shadow-[0_0_14px_rgba(239,68,68,0.5)]"
                    : "border-[rgba(0,207,255,0.6)] bg-[#0c1a2e] shadow-[0_0_14px_rgba(0,207,255,0.4)]"
                  : "border-white/10 bg-[#141b33] hover:border-[rgba(0,207,255,0.5)] hover:bg-[#1a2344]"
              } ${done || lost ? "cursor-default" : "cursor-pointer"}`}
            >
              {c.revealed && (c.mine ? <Bomb size={20} className="text-red-400" /> : <Gem size={20} className="text-[#00CFFF]" />)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass grid gap-4 rounded-xl p-4 md:grid-cols-[1fr_auto]">
        <AmountInput
          value={amount}
          onChange={setAmount}
          disabled={picked > 0 && !done && !lost}
        />
        <div className="flex flex-col justify-end gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-sub">Ganancia actual</p>
            <p className="text-xl font-black text-white">${(amount * mult).toFixed(2)}</p>
            <p className="text-[11px] font-bold text-[#00CFFF]">x{mult.toFixed(2)}</p>
          </div>
          <button
            onClick={cashOut}
            disabled={picked === 0 || done || lost}
            className="btn-blue px-8 py-3 text-sm disabled:opacity-40"
          >
            CASH OUT
          </button>
          <button
            onClick={startNew}
            disabled={(picked > 0 && !done && !lost) || amount <= 0 || (isAuthed && amount > balance)}
            className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
          >
            {isAuthed ? "NUEVA RONDA" : "Inicia sesión para jugar"}
          </button>
        </div>
      </div>
    </div>
  );
}

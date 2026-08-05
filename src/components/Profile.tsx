import { Trophy, ArrowDownToLine, ArrowUpFromLine, Dice5 } from "lucide-react";
import { useLedger } from "../lib/ledger";
import { fmtMoney } from "../lib/games";

export default function Profile() {
  const { balance, entries } = useLedger();

  const totals = entries.reduce(
    (acc, e) => {
      if (e.kind === "deposit") acc.deposit += e.amount;
      if (e.kind === "win") acc.win += e.amount;
      if (e.kind === "bet") acc.bet += -e.amount;
      if (e.kind === "withdraw") acc.withdraw += -e.amount;
      return acc;
    },
    { deposit: 0, win: 0, bet: 0, withdraw: 0 }
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-sm font-black tracking-widest text-white">PROFILE</h1>
        <p className="text-[11px] text-sub">Ledger transparente — cada movimiento queda registrado y verificable</p>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#38e0ff] to-[#0077b6] text-lg font-black text-[#04121a]">
            MX
          </div>
          <div>
            <p className="text-sm font-black text-white">Jugador demo</p>
            <p className="text-[11px] text-sub">Cuenta sandbox · mayor de 18 · ONYX</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] uppercase tracking-wider text-sub">Saldo demo</p>
            <p className="text-xl font-black text-[#00CFFF]">{fmtMoney(balance)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MiniStat icon={<ArrowDownToLine size={13} />} label="Depositado" value={fmtMoney(totals.deposit)} />
          <MiniStat icon={<Dice5 size={13} />} label="Apostado" value={fmtMoney(totals.bet)} />
          <MiniStat icon={<Trophy size={13} />} label="Ganado" value={fmtMoney(totals.win)} />
          <MiniStat icon={<ArrowUpFromLine size={13} />} label="Retirado" value={fmtMoney(totals.withdraw)} />
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-white">Movimientos ({entries.length})</h2>
        {entries.length === 0 && <p className="py-6 text-center text-xs text-sub">Sin movimientos todavía — juega algo</p>}
        <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-lg bg-[#10162b]/70 px-3 py-2 text-xs">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md ${
                  e.amount >= 0 ? "bg-green/20 text-[#27AE60]" : "bg-red-500/20 text-red-400"
                }`}
              >
                {e.amount >= 0 ? "+" : "-"}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">{e.note}</p>
                <p className="text-[10px] text-sub">
                  {e.kind.toUpperCase()} · {new Date(e.ts).toLocaleString("es-MX")}
                </p>
              </div>
              <span className={`font-black ${e.amount >= 0 ? "text-[#27AE60]" : "text-red-400"}`}>
                {e.amount >= 0 ? "+" : ""}
                {fmtMoney(e.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#10162b]/80 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-sub">
        <span className="text-[#00CFFF]">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

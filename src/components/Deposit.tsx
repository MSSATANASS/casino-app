import { useState } from "react";
import { Copy, Check, QrCode, ShieldCheck } from "lucide-react";
import { useLedger } from "../lib/ledger";
import { fmtMoney } from "../lib/games";

const WALLET = "0x7F3aC0dE4B6e8F1a9C2d5E7b8F0a3C4d5E6f7A8B9";

const CURRENCIES = [
  { id: "usdt", name: "Tether (USDT)", net: "ERC20", color: "#26A17B" },
  { id: "usdc", name: "USD Coin (USDC)", net: "BEP20", color: "#2775CA" },
  { id: "tron", name: "TRON (TRX)", net: "TRC20", color: "#EB0029" },
];

export default function Deposit() {
  const { balance, deposit } = useLedger();
  const [cur, setCur] = useState(0);
  const [amount, setAmount] = useState(70);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [tx, setTx] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const confirm = () => {
    deposit(amount);
    setTx("tx-" + Math.random().toString(16).slice(2, 10));
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-sm font-black tracking-widest text-white">DEPÓSITO — SANDBOX</h1>
        <p className="text-[11px] text-sub">
          Flujo idéntico al de producción (USDT a wallet). <span className="font-bold text-[#00CFFF]">Ningún token se mueve: la demo acredita saldo de prueba.</span>
        </p>
      </div>

      <div className="glass-neon rounded-xl p-5">
        <h2 className="text-xs font-black uppercase tracking-wider text-white">01 · Select your Currency &amp; Network</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sub">Cryptocurrency</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#10162b] px-3 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: CURRENCIES[cur].color }}>
                {CURRENCIES[cur].id.slice(0, 1).toUpperCase()}
              </span>
              <span className="flex-1 text-sm font-semibold text-white">{CURRENCIES[cur].name}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {CURRENCIES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setCur(i)}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${i === cur ? "bg-blue text-white" : "bg-white/5 text-sub hover:text-white"}`}
                >
                  {c.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sub">Network</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#10162b] px-3 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#F0B90B] to-[#8a6505] text-[9px] font-black text-black">
                B
              </span>
              <span className="flex-1 text-sm font-semibold text-white">{CURRENCIES[cur].net}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-sub"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sub">Wallet Address</label>
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(0,207,255,0.4)] bg-[#10162b] px-3 py-2.5 [box-shadow:0_0_16px_rgba(0,207,255,0.15)]">
            <code className="flex-1 font-mono text-[11px] text-[#00CFFF]">{WALLET}</code>
            <button onClick={copy} className="text-sub transition-colors hover:text-[#00CFFF]">
              {copied ? <Check size={15} className="text-[#27AE60]" /> : <Copy size={15} />}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-sub">
            <QrCode size={13} className="text-[#00CFFF]" />
            <span>Escanea el QR en la app de tu wallet · red {CURRENCIES[cur].net} únicamente</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sub">Monto (mínimo $70.00)</label>
            <input type="number" min={70} step={1} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} className="num-input" />
          </div>
          <div className="flex flex-col justify-end gap-1 rounded-xl border border-white/10 bg-[#10162b] p-3 text-[11px]">
            <p className="flex justify-between text-sub"><span>Minimum Deposit</span><span className="font-bold text-white">$70.00</span></p>
            <p className="flex justify-between text-sub"><span>Network Fee</span><span className="font-bold text-white">{CURRENCIES[cur].net} (demo)</span></p>
            <p className="flex justify-between text-sub"><span>Saldo tras confirmar</span><span className="font-bold text-[#00CFFF]">{fmtMoney(balance + amount)}</span></p>
          </div>
        </div>

        <button onClick={confirm} disabled={amount < 70} className="btn-primary mt-4 w-full py-3 text-sm disabled:opacity-40">
          CONFIRMAR DEPÓSITO (SANDBOX)
        </button>
      </div>

      {sent && (
        <div className="glass rounded-xl border border-[rgba(39,174,96,0.4)] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[#27AE60]">
            <ShieldCheck size={16} /> Depósito acreditado en modo sandbox
          </p>
          <p className="mt-1 text-[11px] text-sub">
            +{fmtMoney(amount)} · tx {tx.slice(0, 12)}… · <span className="font-bold text-white">Saldo actual {fmtMoney(balance + amount)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { Check, Coins, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useLedger } from "../lib/ledger";
import { fmtMoney } from "../lib/games";

const PACKS = [
  { id: "starter", price: 99, chips: 1200, label: "Starter", bonus: "+20%" },
  { id: "pro", price: 249, chips: 3500, label: "Pro", bonus: "+40%", featured: true },
  { id: "elite", price: 499, chips: 8000, label: "Elite", bonus: "+60%" },
];

export default function Deposit() {
  const { balance, deposit } = useLedger();
  const [selected, setSelected] = useState(1);
  const [demoAdded, setDemoAdded] = useState(false);
  const pack = PACKS[selected];
  const paymentLink = (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined)?.trim();
  const configured = Boolean(paymentLink);
  const formattedRate = useMemo(() => (pack.chips / pack.price).toFixed(1), [pack]);

  const checkout = () => {
    if (paymentLink) {
      const url = new URL(paymentLink);
      url.searchParams.set("client_reference_id", pack.id);
      window.location.assign(url.toString());
      return;
    }
    deposit(pack.chips);
    setDemoAdded(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="text-center">
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-[#00CFFF]">
          <ShieldCheck size={13} /> CHECKOUT PROTEGIDO POR STRIPE
        </span>
        <h1 className="mt-3 text-2xl font-black text-white md:text-3xl">Compra fichas ONYX</h1>
        <p className="mt-2 text-xs text-sub">Fichas virtuales para jugar. No tienen valor monetario y no pueden retirarse ni canjearse por efectivo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PACKS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => { setSelected(index); setDemoAdded(false); }}
            className={`glass relative overflow-hidden rounded-2xl p-5 text-left transition-all ${selected === index ? "border-[rgba(0,207,255,0.75)] shadow-glow" : "hover:border-white/20"}`}
          >
            {item.featured && <span className="absolute right-3 top-3 rounded-full bg-blue px-2 py-1 text-[9px] font-black text-white">MÁS POPULAR</span>}
            <Coins className="text-[#00CFFF]" size={26} />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-sub">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-white">{item.chips.toLocaleString("es-MX")} fichas</p>
            <p className="mt-1 text-sm font-bold text-[#27AE60]">{item.bonus} de bonus</p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-[10px] text-sub">MXN · pago único</span>
              <span className="text-xl font-black text-white">${item.price}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="glass-neon grid gap-5 rounded-2xl p-5 md:grid-cols-[1fr_280px] md:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-black text-white"><Sparkles size={16} className="text-[#00CFFF]" /> Resumen de compra</h2>
          <div className="mt-4 space-y-2 rounded-xl bg-[#10162b] p-4 text-xs">
            <p className="flex justify-between text-sub"><span>Paquete</span><span className="font-bold text-white">{pack.label}</span></p>
            <p className="flex justify-between text-sub"><span>Fichas</span><span className="font-bold text-[#00CFFF]">{pack.chips.toLocaleString("es-MX")}</span></p>
            <p className="flex justify-between text-sub"><span>Rendimiento</span><span className="font-bold text-white">{formattedRate} fichas / MXN</span></p>
            <p className="flex justify-between border-t border-white/5 pt-2 text-sub"><span>Saldo después</span><span className="font-bold text-[#27AE60]">{fmtMoney(balance + pack.chips)}</span></p>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-sub">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#27AE60]" />
            <span>Pago cifrado y procesado por Stripe. ONYX no almacena datos de tarjeta. Solo mayores de 18 años.</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <button onClick={checkout} className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm">
            <CreditCard size={17} /> {configured ? `PAGAR $${pack.price} MXN` : "PROBAR PAQUETE DEMO"}
          </button>
          <p className="mt-2 text-center text-[10px] text-sub">{configured ? "Serás redirigido al checkout seguro" : "El pago estará disponible próximamente"}</p>
          {demoAdded && (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-[rgba(39,174,96,0.35)] bg-green/10 px-3 py-2 text-xs font-bold text-[#27AE60]">
              <Check size={14} /> {pack.chips.toLocaleString("es-MX")} fichas agregadas en demo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

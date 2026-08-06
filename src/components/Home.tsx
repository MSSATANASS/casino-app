import { motion } from "framer-motion";
import { ArrowRight, Target, Gem, ShieldCheck, Clock, Rocket, Bomb, CircleDot, Building2, Gift, Wallet2, Sparkles } from "lucide-react";
import type { Screen } from "../lib/games";
import { GAMES, fmtMoney } from "../lib/games";
import { useLedger } from "../lib/ledger";

export default function Home({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { balance } = useLedger();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative overflow-hidden rounded-2xl border border-[rgba(0,207,255,0.25)] p-6 md:p-10"
      >
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(0,207,255,0.25),transparent_70%)] blur-2xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-[#00CFFF]">
              <ShieldCheck size={13} /> ORIGINAL GAMES - PROVABLY FAIR
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
              Juegos que <span className="text-[#00CFFF] [text-shadow:0_0_24px_rgba(0,207,255,0.6)]">pagan de verdad</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-sub">
              Crash, Mines, Plinko y Towers con semillas verificables y ledger transparente. Cada ronda se
              puedes auditar: el azar es real, la demo también.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setScreen("crash")} className="btn-primary px-5 py-3 text-sm">
                Jugar Crash
              </button>
              <button
                onClick={() => setScreen("deposit")}
                className="glass flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[rgba(0,207,255,0.5)]"
              >
                <ArrowRight size={15} className="text-[#00CFFF]" /> Recargar demo
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-sub">
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#00CFFF]" /> Retiros demo 24/7</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#27AE60]" /> RNG auditable</span>
              <span className="flex items-center gap-1.5"><Gem size={12} className="text-[#2D7FFF]" /> Sin cuentas fantasma</span>
            </div>
          </div>

          <div className="glass grid grid-cols-2 gap-3 rounded-xl p-4">
            <Stat label="Saldo demo" value={fmtMoney(balance)} accent="#00CFFF" />
            <Stat label="RTP promedio" value="97.5%" accent="#27AE60" />
            <Stat label="Pago retiros" value="Real (sandbox)" accent="#2D7FFF" />
            <Stat label="Cero trucos" value="Verificable" accent="#F5C97B" />
          </div>
        </div>
      </motion.div>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="glass flex items-center justify-between gap-4 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#F5C97B] to-[#B8862F] text-lg">
              🥉
            </div>
            <div>
              <p className="text-xs font-bold text-white">Nivel Bronce</p>
              <p className="text-[11px] text-sub">320 / 600 XP para el siguiente nivel</p>
            </div>
          </div>
          <button onClick={() => setScreen("profile")} className="glass rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[#00CFFF] hover:border-[rgba(0,207,255,0.5)]">
            Ver VIP Club
          </button>
        </div>
        <div className="glass flex items-center gap-3 rounded-xl p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#A100FF] to-[#5c00a3]">
            <Gift size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Recompensa de bienvenida</p>
            <p className="text-[11px] text-sub">Saldo demo de $1,000 al depositar por primera vez</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-[#00CFFF]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-sub">Trending ahora</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setScreen(g.id)}
              className="glass flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-all hover:border-[rgba(0,207,255,0.5)] hover:shadow-glow"
            >
              <GameIcon id={g.id} size={22} />
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-black tracking-widest text-white">EL LOBBY</h2>
          <span className="text-[11px] text-sub">{GAMES.length} juegos originales - demo transparente</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              onClick={() => setScreen(g.id)}
              className="glass group relative overflow-hidden rounded-xl p-5 text-left transition-all hover:border-[rgba(0,207,255,0.5)] hover:shadow-glow"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#38e0ff] to-[#00a8d4] [box-shadow:0_0_18px_rgba(0,207,255,0.45)]">
                <GameIcon id={g.id} size={20} color="#04121a" />
              </div>
              <h3 className="text-sm font-black tracking-widest text-white">{g.name}</h3>
              <p className="mt-1 text-[11px] text-sub">{g.desc}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#27AE60]">RTP {g.rtp}</span>
                <span className="text-sub">Vol {g.vol}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <FeatureCard
          icon={<Target size={18} />}
          title="Original Games"
          body="Juegos propios con azar demostrable. El seed del servidor se firma antes de la ronda y puedes verificarlo después."
          cta="Probar crash"
          onClick={() => setScreen("crash")}
        />
        <FeatureCard
          icon={<Wallet2 size={18} />}
          title="Depósito instantáneo"
          body="USDT, USDC y TRON vía ERC20, BEP20 o TRC20. Acredita tu saldo de prueba en segundos."
          cta="Ir a depósito"
          onClick={() => setScreen("deposit")}
        />
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg bg-[#10162b]/80 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-sub">{label}</p>
      <p className="text-sm font-black" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  cta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="glass group flex flex-col rounded-xl p-5 transition-all hover:border-[rgba(45,127,255,0.5)] hover:shadow-glow-blue">
      <div className="mb-3 flex items-center gap-2 text-[#2D7FFF]">
        {icon}
        <h3 className="text-sm font-black tracking-widest text-white">{title}</h3>
      </div>
      <p className="flex-1 text-xs leading-relaxed text-sub">{body}</p>
      <button
        onClick={onClick}
        className="btn-blue mt-4 w-fit px-4 py-2 text-xs opacity-0 transition-all duration-200 group-hover:opacity-100"
      >
        {cta}
      </button>
    </div>
  );
}

function GameIcon({ id, size = 20, color = "#04121a" }: { id: Screen; size?: number; color?: string }) {
  switch (id) {
    case "crash":
      return <Rocket size={size} color={color} strokeWidth={2.5} />;
    case "mines":
      return <Bomb size={size} color={color} strokeWidth={2.5} />;
    case "plinko":
      return <CircleDot size={size} color={color} strokeWidth={2.5} />;
    case "towers":
      return <Building2 size={size} color={color} strokeWidth={2.5} />;
    default:
      return <Gem size={size} color={color} strokeWidth={2.5} />;
  }
}
import { Crown, Home, Banknote, MessageCircle, Settings, Trophy, Wallet } from "lucide-react";
import type { Screen } from "../lib/games";
import { useLedger } from "../lib/ledger";
import { fmtMoney } from "../lib/games";

export default function Shell({
  screen,
  setScreen,
  children,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  children: React.ReactNode;
}) {
  const { balance } = useLedger();
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-16 flex-col items-center gap-2 border-r border-white/5 bg-[#070b16]/80 py-4 md:flex">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#38e0ff] to-[#00a8d4] shadow-glow">
          <Crown size={20} className="text-[#04121a]" />
        </div>
        <SideIcon active={screen === "home"} onClick={() => setScreen("home")} icon={<Home size={18} />} label="Home" />
        <SideIcon active={screen === "profile"} onClick={() => setScreen("profile")} icon={<Trophy size={18} />} label="Perfil" />
        <SideIcon active={screen === "deposit"} onClick={() => setScreen("deposit")} icon={<Banknote size={18} />} label="Depósito" />
        <div className="mt-auto flex flex-col items-center gap-2">
          <SideIcon onClick={() => {}} icon={<MessageCircle size={18} />} label="Soporte 24/7" />
          <SideIcon onClick={() => {}} icon={<Settings size={18} />} label="Ajustes" />
          <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#38e0ff] to-[#0077b6] text-sm font-bold text-[#04121a]">
            MX
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="glass sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-xl px-4 py-2.5 md:mx-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-[#38e0ff] to-[#00a8d4]">
              <Crown size={14} className="text-[#04121a]" />
            </span>
            <span className="text-sm font-black tracking-[0.2em] text-white">ONYX</span>
          </div>
          <nav className="flex items-center gap-1 rounded-lg bg-[#0c1120] p-1">
            {(
              [
                { id: "home", label: "Home" },
                { id: "profile", label: "Profile" },
                { id: "deposit", label: "Free Money" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setScreen(t.id === "deposit" ? "deposit" : t.id === "profile" ? "profile" : "home")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  (t.id === "deposit" && screen === "deposit") ||
                  (t.id === "profile" && screen === "profile") ||
                  (t.id === "home" && (screen === "home" || screen === "crash" || screen === "mines" || screen === "plinko" || screen === "towers"))
                    ? "bg-blue text-white shadow-glow-blue"
                    : "text-sub hover:text-white"
                }`}
              >
                {t.id === "deposit" && <Banknote size={13} className="text-[#00CFFF]" />}
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="glass flex items-center gap-2 rounded-lg px-3 py-1.5">
              <Wallet size={14} className="text-[#00CFFF]" />
              <span className="text-sm font-bold text-white">{fmtMoney(balance)}</span>
            </div>
            <button
              onClick={() => setScreen("deposit")}
              className="btn-blue hidden px-3 py-1.5 text-xs sm:block"
            >
              + Depósito
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 md:px-4">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
          <div className="glass rounded-xl px-4 py-3 text-center">
            <p className="text-[11px] text-sub">
              ONYX Casino es una <span className="font-semibold text-white">demo de marketing con ledger sandbox</span>. No se procesa dinero real; los retiros no se envían. Provably fair con semillas verificables. Juega responsable: solo para mayores de 18.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SideIcon({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
        active ? "bg-blue/25 text-[#00CFFF] shadow-glow" : "text-sub hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
    </button>
  );
}

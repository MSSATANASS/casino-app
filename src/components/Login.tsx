import { useState } from "react";
import { Crown, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, register, busy, error, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (mode === "register") {
        await register(email, password, username);
      } else {
        await login(email, password);
      }
    } catch {
      /* el error ya queda expuesto via contexto */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-neon w-full max-w-sm rounded-2xl p-6">
        <div className="mb-5 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#38e0ff] to-[#00a8d4] shadow-glow">
            <Crown size={22} className="text-[#04121a]" />
          </span>
          <h1 className="text-lg font-black tracking-[0.2em] text-white">ONYX</h1>
          <p className="mt-1 text-[11px] text-sub">Crea tu cuenta real para guardar tus fichas y tu progreso</p>
        </div>

        <div className="mb-4 flex rounded-lg bg-[#0c1120] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              clearError();
            }}
            className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${mode === "register" ? "bg-blue text-white shadow-glow-blue" : "text-sub"}`}
          >
            Crear cuenta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              clearError();
            }}
            className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${mode === "login" ? "bg-blue text-white shadow-glow-blue" : "text-sub"}`}
          >
            Ya tengo cuenta
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <Field icon={<UserIcon size={14} />} label="Usuario (opcional)">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                maxLength={16}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-sub/60"
              />
            </Field>
          )}
          <Field icon={<Mail size={14} />} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-sub/60"
            />
          </Field>
          <Field icon={<Lock size={14} />} label="Contraseña">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-sub/60"
            />
          </Field>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-300">{error}</p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-sm disabled:opacity-50">
            {busy ? "Procesando..." : mode === "register" ? "Crear cuenta gratis" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-sub">
          <ShieldCheck size={12} className="text-[#27AE60]" /> Cuenta real, fichas virtuales sin valor monetario. Solo mayores de 18.
        </p>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sub">
        {icon} {label}
      </span>
      <div className="rounded-xl border border-white/10 bg-[#10162b] px-3 py-2.5 focus-within:border-[rgba(0,207,255,0.6)]">{children}</div>
    </label>
  );
}

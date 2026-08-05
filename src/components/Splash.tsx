import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

export default function Splash({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2600);
    const t2 = setTimeout(onDone, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060a14] transition-opacity duration-700 ${
        fade ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="mb-10 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#38e0ff] to-[#00a8d4] shadow-glow">
          <Crown size={24} className="text-[#04121a]" />
        </span>
        <span className="text-2xl font-black tracking-[0.3em] text-white">ONYX</span>
      </div>

      <div className="relative h-64 w-72 [perspective:900px]">
        <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full bg-[radial-gradient(circle,rgba(0,207,255,0.15),transparent_60%)] blur-2xl" />
        <div className="absolute inset-x-0 -bottom-2 mx-auto h-8 w-56 rounded-full bg-[radial-gradient(ellipse,rgba(0,207,255,0.5),transparent_70%)] blur-md" />

        <div className="absolute inset-x-4 top-0 [transform:rotateX(18deg)_rotateY(-14deg)]">
          <div className="glass-neon relative rounded-2xl border-2 border-[rgba(0,207,255,0.4)] p-3 shadow-glow">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="flex h-10 w-8 items-center justify-center rounded-md border border-white/10 bg-gradient-to-b from-[#dde7f5] via-[#8fa3c2] to-[#4d5f7e] text-lg font-black text-[#122033] [box-shadow:inset_0_-4px_6px_rgba(0,0,0,0.35)]"
                >
                  {["7", "O", "N"][i]}
                </span>
              ))}
              <span className="ml-1 flex h-10 w-4 items-center justify-center rounded-md bg-gradient-to-b from-[#e8ecf5] to-[#9aabc4] [box-shadow:inset_0_-3px_5px_rgba(0,0,0,0.3)]">
                <span className="h-7 w-1 rounded-full bg-[#00CFFF] [box-shadow:0_0_8px_#00CFFF]" />
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/40">
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#00CFFF] to-[#2D7FFF] [box-shadow:0_0_10px_#00CFFF]" />
            </div>
            <div className="mt-2 flex justify-between text-[9px] font-bold tracking-widest text-[#00CFFF]/80">
              <span>CRASH</span>
              <span>MINES</span>
              <span>PLINKO</span>
              <span>TOWERS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-[#00CFFF]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00CFFF] [box-shadow:0_0_8px_#00CFFF]" />
        Cargando demo segura…
      </div>
    </div>
  );
}

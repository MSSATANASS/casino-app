import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OnyxMark from "./OnyxMark";

export default function Splash({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2700);
    const t2 = setTimeout(onDone, 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <motion.div
      animate={fade ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060a14] ${fade ? "pointer-events-none" : ""}`}
    >
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, transparent, rgba(0,207,255,0.6), transparent 40%)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
          <span className="absolute inset-1 rounded-full bg-[#060a14]" />
          <motion.span
            initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#38e0ff] to-[#00a8d4] shadow-glow"
          >
            <OnyxMark size={28} className="text-[#04121a]" />
          </motion.span>
        </div>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-2xl font-black tracking-[0.3em] text-white"
        >
          ONYX
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative h-64 w-72 [perspective:900px]"
      >
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
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.6, delay: 0.5, ease: "easeInOut" }}
                className="h-2 rounded-full bg-gradient-to-r from-[#00CFFF] to-[#2D7FFF] [box-shadow:0_0_10px_#00CFFF]"
              />
            </div>
            <div className="mt-2 flex justify-between text-[9px] font-bold tracking-widest text-[#00CFFF]/80">
              <span>CRASH</span>
              <span>MINES</span>
              <span>PLINKO</span>
              <span>TOWERS</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-6 flex items-center gap-2 text-xs text-[#00CFFF]"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00CFFF] [box-shadow:0_0_8px_#00CFFF]" />
        Preparando tu mesa segura…
      </motion.div>
    </motion.div>
  );
}

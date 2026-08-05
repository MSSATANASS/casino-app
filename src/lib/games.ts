export type Screen = "home" | "crash" | "mines" | "plinko" | "towers" | "deposit" | "profile";

export const GAMES: { id: Screen; name: string; rtp: string; vol: string; desc: string }[] = [
  { id: "crash", name: "CRASH", rtp: "97%", vol: "Alta", desc: "Multiplicador en tiempo real" },
  { id: "mines", name: "MINES", rtp: "97%", vol: "Media", desc: "Diamantes y bombas" },
  { id: "plinko", name: "PLINKO", rtp: "99.0%", vol: "Baja", desc: "El disco decide tu suerte" },
  { id: "towers", name: "TOWERS", rtp: "97%", vol: "Media", desc: "Sube nivel por nivel" },
];

export function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

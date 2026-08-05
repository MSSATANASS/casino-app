export default function AmountInput({
  value,
  onChange,
  disabled,
  presets = [5, 10, 25, 50],
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  presets?: number[];
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sub">Monto de apuesta</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-sub">
          $
        </span>
        <input
          type="number"
          min={0.01}
          step={0.01}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="num-input pl-6"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            disabled={disabled}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              value === v ? "bg-blue text-white shadow-glow-blue" : "glass text-sub hover:text-white"
            }`}
          >
            ${v}
          </button>
        ))}
      </div>
    </div>
  );
}

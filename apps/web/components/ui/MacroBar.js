'use client';

const colorMap = {
  protein: { bar: '#14C06A', track: '#E8F8EF' },
  carbs:   { bar: '#F5A524', track: '#FEF3E2' },
  fat:     { bar: '#7C8CFF', track: '#EEEEFF' },
};

export default function MacroBar({ label, value, unit = 'g', max, type = 'protein', className = '' }) {
  const progress = max > 0 ? Math.min(1, value / max) : 0;
  const { bar, track } = colorMap[type] || colorMap.protein;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-ink-700">
          {value}<span className="text-ink-300 font-normal">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: track }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%`, backgroundColor: bar }}
        />
      </div>
    </div>
  );
}

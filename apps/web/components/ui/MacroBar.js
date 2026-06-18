'use client';

const trackClass = {
  protein: 'bg-[#E8F8EF] dark:bg-slate-700',
  carbs:   'bg-[#FEF3E2] dark:bg-slate-700',
  fat:     'bg-[#EEEEFF] dark:bg-slate-700',
};

const barColor = {
  protein: '#14C06A',
  carbs:   '#F5A524',
  fat:     '#7C8CFF',
};

export default function MacroBar({ label, value, unit = 'g', max, type = 'protein', className = '' }) {
  const progress = max > 0 ? Math.min(1, value / max) : 0;
  const bar = barColor[type] || barColor.protein;
  const track = trackClass[type] || trackClass.protein;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-ink-700 dark:text-slate-200">
          {value}<span className="text-ink-300 dark:text-slate-500 font-normal">{unit}</span>
        </span>
      </div>
      <div className={`h-1.5 rounded-full w-full ${track}`}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%`, backgroundColor: bar }}
        />
      </div>
    </div>
  );
}

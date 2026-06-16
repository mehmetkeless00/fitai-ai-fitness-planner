'use client';

// days: array of { label: 'M', state: 'done' | 'today' | 'upcoming' | 'rest' }
export default function WeekStrip({ days = [], className = '' }) {
  const stateStyles = {
    done:     { bar: 'bg-accent', label: 'text-ink-900 font-semibold' },
    today:    { bar: 'bg-accent opacity-60', label: 'text-accent font-semibold' },
    rest:     { bar: 'bg-line', label: 'text-ink-300' },
    upcoming: { bar: 'bg-line', label: 'text-ink-300' },
  };

  return (
    <div className={`flex items-end gap-1.5 ${className}`}>
      {days.map((day, i) => {
        const { bar, label } = stateStyles[day.state] || stateStyles.upcoming;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-full rounded-full ${bar}`} style={{ height: day.state === 'done' || day.state === 'today' ? 28 : 12 }} />
            <span className={`text-[10px] ${label}`}>{day.label}</span>
          </div>
        );
      })}
    </div>
  );
}

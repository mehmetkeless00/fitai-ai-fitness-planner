'use client';

export default function ChoiceCard({ value, selected, onSelect, icon, heading, description, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={`w-full text-left p-4 rounded-[14px] border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        selected
          ? 'border-accent bg-accent-wash dark:bg-accent/10'
          : 'border-line dark:border-slate-600 bg-paper dark:bg-slate-800 hover:border-accent/40 hover:bg-canvas dark:hover:bg-slate-700'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-[10px] flex items-center justify-center text-lg ${
            selected ? 'bg-accent/20' : 'bg-canvas dark:bg-slate-700'
          }`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${selected ? 'text-ink-900 dark:text-white' : 'text-ink-700 dark:text-slate-200'}`}>{heading}</p>
          {description && (
            <p className="text-xs text-ink-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 ${
          selected ? 'border-accent bg-accent' : 'border-line dark:border-slate-500 bg-paper dark:bg-slate-700'
        }`} />
      </div>
    </button>
  );
}

'use client';

export default function ChoiceCard({ value, selected, onSelect, icon, heading, description, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={`w-full text-left p-4 rounded-[14px] border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        selected
          ? 'border-accent bg-accent-wash'
          : 'border-line bg-paper hover:border-accent/40 hover:bg-canvas'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-[10px] flex items-center justify-center text-lg ${
            selected ? 'bg-accent/20' : 'bg-canvas'
          }`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${selected ? 'text-ink-900' : 'text-ink-700'}`}>{heading}</p>
          {description && (
            <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 ${
          selected ? 'border-accent bg-accent' : 'border-line bg-paper'
        }`} />
      </div>
    </button>
  );
}

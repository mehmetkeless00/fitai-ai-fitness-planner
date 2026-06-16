'use client';

export default function ToggleGroup({ options = [], value, onChange, label, required, error }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-700 dark:text-white mb-3">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-[10px] font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              ${
                value === opt.value
                  ? 'bg-accent border-accent text-[#062815] shadow-none'
                  : 'bg-paper dark:bg-dark-surface border-line dark:border-dark-border text-ink-700 dark:text-slate-300 hover:border-accent/40 hover:bg-canvas dark:hover:bg-dark-surface/80 cursor-pointer'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-2">{error}</p>}
    </div>
  );
}

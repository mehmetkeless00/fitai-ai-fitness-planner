'use client';

export default function ToggleGroup({ options = [], value, onChange, label, required, error }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-3">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              ${
                value === opt.value
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-500 text-white shadow-lg shadow-sky-500/30 ring-1 ring-sky-400/50'
                  : 'bg-slate-100 dark:bg-dark-surface border-slate-300 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-dark-surface/80 cursor-pointer'
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

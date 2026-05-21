'use client';

export default function ToggleGroup({ options = [], value, onChange, label, required }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all border
              ${
                value === opt.value
                  ? 'bg-sky-500 border-sky-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-surface border-gray-300 dark:border-dark-border text-gray-700 dark:text-slate-300 hover:border-sky-400 hover:bg-gray-50 dark:hover:bg-dark-surface/80'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

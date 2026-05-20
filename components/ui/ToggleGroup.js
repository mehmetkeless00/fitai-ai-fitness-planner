'use client';

export default function ToggleGroup({ options = [], value, onChange, label, required }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-3">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
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
                  : 'bg-dark-surface border-dark-border text-slate-300 hover:border-sky-400'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

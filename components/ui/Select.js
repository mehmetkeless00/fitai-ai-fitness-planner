'use client';

export default function Select({
  label,
  options = [],
  error,
  required,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg
          text-white focus:outline-none focus:border-sky-500
          focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none ${className}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

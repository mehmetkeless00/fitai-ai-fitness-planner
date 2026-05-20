'use client';

export default function Input({
  label,
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
      <input
        className={`w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg
          text-white placeholder-slate-400 focus:outline-none focus:border-sky-500
          focus:ring-2 focus:ring-sky-500/20 transition-all ${className}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

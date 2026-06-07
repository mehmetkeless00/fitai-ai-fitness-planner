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
        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-white mb-1.5 sm:mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-dark-surface border border-slate-300 dark:border-dark-border rounded-lg
          text-slate-900 dark:text-white text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500
          focus:ring-2 focus:ring-sky-500/20 transition-all ${className}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      {error && <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1.5 sm:mt-2">{error}</p>}
    </div>
  );
}

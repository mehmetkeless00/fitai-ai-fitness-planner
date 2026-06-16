'use client';

import { useId } from 'react';

export default function Input({
  label,
  error,
  required,
  className = '',
  as,
  type,
  id,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = `${fieldId}-error`;

  const fieldClasses = `w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-paper dark:bg-dark-surface border border-line dark:border-dark-border rounded-[10px]
    text-ink-900 dark:text-white text-sm sm:text-base placeholder-ink-300 dark:placeholder-slate-500 focus:outline-none focus:border-accent
    focus:ring-2 focus:ring-accent/20 transition-all ${className}
    ${error ? 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20' : ''}`;

  const a11yProps = {
    id: fieldId,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-xs sm:text-sm font-medium text-ink-700 dark:text-white mb-1.5 sm:mb-2"
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea className={`${fieldClasses} resize-y`} {...a11yProps} {...props} />
      ) : (
        <input type={type} className={fieldClasses} {...a11yProps} {...props} />
      )}
      {error && (
        <p id={errorId} className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1.5 sm:mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

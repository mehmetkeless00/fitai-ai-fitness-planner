'use client';

import { useId } from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Select({
  label,
  options = [],
  error,
  required,
  className = '',
  placeholder,
  id,
  ...props
}) {
  const { t } = useLanguage();
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = `${fieldId}-error`;

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
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-paper dark:bg-dark-surface border border-line dark:border-dark-border rounded-[10px]
          text-ink-900 dark:text-white text-sm sm:text-base focus:outline-none focus:border-accent
          focus:ring-2 focus:ring-accent/20 transition-all appearance-none ${className}
          ${error ? 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20' : ''}`}
        {...props}
      >
        <option value="" className="text-slate-900 dark:text-white">
          {placeholder || t.common.selectOption}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-900 dark:text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1.5 sm:mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

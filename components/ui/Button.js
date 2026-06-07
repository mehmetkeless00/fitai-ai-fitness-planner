'use client';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 font-medium';

  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-slate-200 dark:bg-dark-surface hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-dark-border',
    outline: 'bg-transparent border border-slate-300 dark:border-dark-border text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-dark-surface',
    ghost: 'bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-dark-surface',
  };

  const sizes = {
    sm: 'px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

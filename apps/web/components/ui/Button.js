'use client';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles =
    'font-semibold rounded-[12px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';

  const variants = {
    primary:
      'bg-accent hover:bg-accent-600 text-[#062815] shadow-[0_6px_16px_-8px_rgba(20,192,106,0.7)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-ink-900 hover:bg-ink-700 text-white',
    outline: 'bg-paper border border-line text-ink-900 hover:border-accent/40 hover:bg-canvas',
    ghost: 'bg-transparent text-ink-900 dark:text-white hover:bg-canvas dark:hover:bg-dark-surface',
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

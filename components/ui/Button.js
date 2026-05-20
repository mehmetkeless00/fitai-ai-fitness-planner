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
    secondary: 'bg-dark-surface hover:bg-slate-700 text-white border border-dark-border',
    outline: 'bg-transparent border border-dark-border text-white hover:bg-dark-surface',
    ghost: 'bg-transparent text-white hover:bg-dark-surface',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
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

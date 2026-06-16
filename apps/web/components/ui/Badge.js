'use client';

const variants = {
  success: 'bg-accent-wash text-accent-600 border-accent/20',
  warning: 'bg-[#FEF3E2] text-[#9A6000] border-[#F5A524]/20',
  danger: 'bg-[#FDECEA] text-semantic-danger border-semantic-danger/20',
  neutral: 'bg-canvas text-ink-500 border-line',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

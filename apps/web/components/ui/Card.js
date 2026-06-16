'use client';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-paper dark:bg-dark-surface border border-line dark:border-dark-border rounded-[20px] p-4 sm:p-6
        shadow-[0_1px_2px_rgba(20,22,30,0.04),0_10px_26px_-18px_rgba(20,22,30,0.22)] transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

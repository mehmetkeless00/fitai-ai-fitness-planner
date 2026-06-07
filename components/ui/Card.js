'use client';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-2xl p-4 sm:p-6
        backdrop-blur-xs bg-opacity-100 dark:bg-opacity-80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

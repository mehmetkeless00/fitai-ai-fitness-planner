'use client';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-dark-surface border border-dark-border rounded-2xl p-6
        backdrop-blur-xs bg-opacity-80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

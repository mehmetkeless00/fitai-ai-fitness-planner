'use client';

export default function FormGroup({ label, children, description }) {
  return (
    <div className="mb-6">
      {label && <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-1.5 md:mb-2">{label}</h3>}
      {description && <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3 md:mb-4">{description}</p>}
      <div className="space-y-3 md:space-y-4">{children}</div>
    </div>
  );
}

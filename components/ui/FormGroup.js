'use client';

export default function FormGroup({ label, children, description }) {
  return (
    <div className="mb-6">
      {label && <h3 className="text-lg font-semibold text-white mb-2">{label}</h3>}
      {description && <p className="text-slate-400 text-sm mb-4">{description}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

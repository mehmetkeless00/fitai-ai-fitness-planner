'use client';

export default function PageHeader({ title, description, children }) {
  return (
    <div className="text-center mb-12 pt-20">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-slideUp">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

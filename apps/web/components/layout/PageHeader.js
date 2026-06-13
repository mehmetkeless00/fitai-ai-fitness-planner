'use client';

export default function PageHeader({ title, description, children }) {
  return (
    <div className="text-center mb-8 md:mb-12 pt-8 md:pt-12 px-3">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 animate-slideUp">
        {title}
      </h1>
      {description && (
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

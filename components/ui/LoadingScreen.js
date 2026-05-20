'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 text-center max-w-md">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-dark-border border-t-sky-500 rounded-full animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Generating Your Plan</h2>
        <p className="text-slate-400">
          Our AI coach is creating a personalized workout and meal plan just for you...
        </p>
        <div className="flex gap-1 justify-center mt-6">
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}

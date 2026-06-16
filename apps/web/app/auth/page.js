'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getSupabase, isCloudEnabled } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const s = t.auth;

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;

    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data?.session) {
          router.push('/plans');
        } else {
          setNotice(s.checkEmail);
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push('/plans');
      }
    } catch (err) {
      setError(err?.message || s.genericError);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/plans` },
      });
    } catch (err) {
      setError(err?.message || s.genericError);
    }
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen pt-20 pb-12 md:pb-20">
        <Container>
          <PageHeader title={s.pageTitle} description={s.pageDescription} />

          <Card className="max-w-md mx-auto">
            {!isCloudEnabled ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center py-4">
                {s.cloudDisabled}
              </p>
            ) : (
              <>
                <div className="flex gap-1 p-1 mb-6 bg-slate-100 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border rounded-xl">
                  {['signin', 'signup'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setError(null); setNotice(null); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                        ${mode === m
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {m === 'signin' ? s.signIn : s.signUp}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label={s.email}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <Input
                    label={s.password}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />

                  {error && (
                    <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}
                  {notice && (
                    <p role="status" className="text-sm text-green-700 dark:text-green-400">{notice}</p>
                  )}

                  <Button type="submit" disabled={busy} className="w-full">
                    {mode === 'signin' ? s.signIn : s.signUp}
                  </Button>
                </form>

                <div className="flex items-center gap-3 my-5" aria-hidden="true">
                  <span className="flex-1 h-px bg-slate-200 dark:bg-dark-border" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{s.or}</span>
                  <span className="flex-1 h-px bg-slate-200 dark:bg-dark-border" />
                </div>

                <Button variant="outline" onClick={handleGoogle} className="w-full">
                  {s.google}
                </Button>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-5">
                  {mode === 'signin' ? s.noAccount : s.haveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    {mode === 'signin' ? s.signUp : s.signIn}
                  </button>
                </p>
              </>
            )}
          </Card>
        </Container>
      </main>
    </>
  );
}

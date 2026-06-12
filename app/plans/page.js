'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { listPlans, getActivePlan, setActivePlan, renamePlan, deletePlan } from '@/utils/planStorage';

export default function PlansPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const s = t.plans;

  const [plans, setPlans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const refresh = () => {
    setPlans(listPlans());
    setActiveId(getActivePlan()?.id || null);
  };

  useEffect(() => {
    refresh();
    setMounted(true);
  }, []);

  const goalLabel = (value) =>
    t.createPlan.goals.goalOptions.find((g) => g.value === value)?.label || value || '';

  const displayName = (plan) =>
    plan.name ||
    `${goalLabel(plan.data?.fitnessGoal)} · ${new Date(plan.createdAt).toLocaleDateString(
      lang === 'tr' ? 'tr-TR' : 'en-US'
    )}`;

  const handleView = (id) => {
    setActivePlan(id);
    router.push('/result');
  };

  const startRename = (plan) => {
    setConfirmingId(null);
    setEditingId(plan.id);
    setEditingName(plan.name || displayName(plan));
  };

  const submitRename = (e) => {
    e.preventDefault();
    renamePlan(editingId, editingName);
    setEditingId(null);
    refresh();
  };

  const handleDelete = (id) => {
    if (confirmingId !== id) {
      setEditingId(null);
      setConfirmingId(id);
      return;
    }
    deletePlan(id);
    setConfirmingId(null);
    refresh();
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 md:pb-20">
        <Container>
          <PageHeader title={s.pageTitle} description={s.pageDescription} />

          {mounted && plans.length === 0 && (
            <div className="text-center max-w-md mx-auto py-12">
              <div className="text-6xl mb-6" aria-hidden="true">📋</div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {s.emptyTitle}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">{s.emptyDesc}</p>
              <Link href="/create-plan">
                <Button size="lg">{s.emptyCta}</Button>
              </Link>
            </div>
          )}

          {plans.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex justify-end">
                <Link href="/create-plan">
                  <Button size="sm">{s.newPlan}</Button>
                </Link>
              </div>

              {plans.map((plan) => (
                <Card key={plan.id} className="hover:border-sky-500/40 transition-all">
                  {editingId === plan.id ? (
                    <form onSubmit={submitRename} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                      <div className="flex-1">
                        <Input
                          label={s.renamePlaceholder}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          maxLength={60}
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">{s.save}</Button>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                          {s.cancel}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-2">
                          {displayName(plan)}
                          {plan.id === activeId && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">
                              {s.active}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {goalLabel(plan.data?.fitnessGoal)}
                          {plan.data?.dailyCalories ? ` · ${plan.data.dailyCalories.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} kcal` : ''}
                          {` · ${s.created}: ${new Date(plan.createdAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => handleView(plan.id)}>
                          {s.view}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => startRename(plan)}>
                          {s.rename}
                        </Button>
                        <Button
                          size="sm"
                          variant={confirmingId === plan.id ? 'primary' : 'outline'}
                          className={confirmingId === plan.id ? '!bg-red-500 !from-red-500 !to-red-600 hover:!from-red-400 hover:!to-red-500' : ''}
                          onClick={() => handleDelete(plan.id)}
                          onBlur={() => setConfirmingId((c) => (c === plan.id ? null : c))}
                        >
                          {confirmingId === plan.id ? s.confirmDelete : s.delete}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{s.limitNote}</p>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

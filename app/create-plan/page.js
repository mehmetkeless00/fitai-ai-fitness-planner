'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import FormStepper from '@/components/features/form/FormStepper';
import PersonalInfoForm from '@/components/features/form/PersonalInfoForm';
import GoalsForm from '@/components/features/form/GoalsForm';
import PreferencesForm from '@/components/features/form/PreferencesForm';
import PremiumLoadingScreen from '@/components/ui/PremiumLoadingScreen';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function CreatePlan() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { t, lang } = useLanguage();

  const steps = [
    { title: t.createPlan.steps[0], component: PersonalInfoForm },
    { title: t.createPlan.steps[1], component: GoalsForm },
    { title: t.createPlan.steps[2], component: PreferencesForm },
  ];

  const handleGeneratePlan = async (formData) => {
    setError(null);
    setIsGenerating(true);
    track('plan_generation_started', { goal: formData.fitnessGoal, lang });

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, lang }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.createPlan.genericError);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || t.createPlan.genericError);
      }

      const planData = {
        ...formData,
        ...data.plan,
        generatedAt: new Date().toISOString(),
      };

      localStorage.setItem('userPlan', JSON.stringify(planData));
      track('plan_generated', { goal: formData.fitnessGoal, lang });
      router.push('/result');
    } catch (err) {
      track('plan_generation_failed');
      setError(err.message || t.createPlan.genericError);
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 md:pb-20">
        {isGenerating && <PremiumLoadingScreen />}

        <Container>
          <PageHeader
            title={t.createPlan.pageTitle}
            description={t.createPlan.pageDescription}
          />

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-medium">❌ {error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm text-red-400 hover:text-red-300 mt-2 underline"
              >
                {t.createPlan.errorDismiss}
              </button>
            </div>
          )}

          <Card className="max-w-2xl mx-auto">
            <FormStepper
              steps={steps}
              onComplete={handleGeneratePlan}
              isLoading={isGenerating}
            />
          </Card>
        </Container>
      </main>
    </>
  );
}

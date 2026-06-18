'use client';

import { useState } from 'react';
import ChoiceCard from '../../ui/ChoiceCard';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

const GOAL_ICONS = {
  'lose-weight': '⚡',
  'build-muscle': '💪',
  endurance: '🏃',
  flexibility: '🧘',
  'general-fitness': '🎯',
  performance: '🏆',
};

const EXP_ICONS = {
  beginner: '🌱',
  intermediate: '📈',
  advanced: '🔥',
  elite: '⚡',
};

export default function GoalsForm({ onNext, formData }) {
  const [data, setData] = useState(formData || {});
  const [errors, setErrors] = useState({});
  const { t } = useLanguage();
  const s = t.createPlan.goals;

  const validate = () => {
    const newErrors = {};
    if (!data.fitnessGoal) newErrors.fitnessGoal = s.errors.fitnessGoal;
    if (!data.experience) newErrors.experience = s.errors.experience;
    if (!data.frequency) newErrors.frequency = s.errors.frequency;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">{s.goalsLabel}</p>
        {s.goalsDesc && <p className="text-xs text-ink-500 dark:text-slate-400 mb-3">{s.goalsDesc}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={s.primaryGoal}>
          {s.goalOptions.map((opt) => (
            <ChoiceCard
              key={opt.value}
              value={opt.value}
              selected={data.fitnessGoal === opt.value}
              onSelect={(val) => setData({ ...data, fitnessGoal: val })}
              icon={GOAL_ICONS[opt.value]}
              heading={opt.label}
            />
          ))}
        </div>
        {errors.fitnessGoal && <p className="text-xs text-semantic-danger mt-1">{errors.fitnessGoal}</p>}
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">{s.expLabel}</p>
        {s.expDesc && <p className="text-xs text-ink-500 dark:text-slate-400 mb-3">{s.expDesc}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={s.workoutExp}>
          {s.expOptions.map((opt) => (
            <ChoiceCard
              key={opt.value}
              value={opt.value}
              selected={data.experience === opt.value}
              onSelect={(val) => setData({ ...data, experience: val })}
              icon={EXP_ICONS[opt.value]}
              heading={opt.label}
            />
          ))}
        </div>
        {errors.experience && <p className="text-xs text-semantic-danger mt-1">{errors.experience}</p>}
      </div>

      <FormGroup label={s.freqLabel}>
        <Select
          label={s.freqSelect}
          options={s.freqOptions}
          value={data.frequency || ''}
          onChange={(e) => setData({ ...data, frequency: e.target.value })}
          error={errors.frequency}
          required
        />
      </FormGroup>

      <Button type="submit" className="w-full">
        {s.continueBtn}
      </Button>
    </form>
  );
}

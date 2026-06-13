'use client';

import { useState } from 'react';
import ToggleGroup from '../../ui/ToggleGroup';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

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
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-section {
          animation: slideUp 0.5s ease-out forwards;
        }
        .form-section:nth-child(1) { animation-delay: 0.05s; }
        .form-section:nth-child(2) { animation-delay: 0.1s; }
        .form-section:nth-child(3) { animation-delay: 0.15s; }
      `}</style>

      <div className="form-section">
        <FormGroup label={s.goalsLabel} description={s.goalsDesc}>
          <ToggleGroup
            options={s.goalOptions}
            value={data.fitnessGoal || ''}
            onChange={(val) => setData({ ...data, fitnessGoal: val })}
            label={s.primaryGoal}
            error={errors.fitnessGoal}
            required
          />
        </FormGroup>
      </div>

      <div className="form-section">
        <FormGroup label={s.expLabel} description={s.expDesc}>
          <ToggleGroup
            options={s.expOptions}
            value={data.experience || ''}
            onChange={(val) => setData({ ...data, experience: val })}
            label={s.workoutExp}
            error={errors.experience}
            required
          />
        </FormGroup>
      </div>

      <div className="form-section">
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
      </div>

      <Button type="submit" className="w-full" style={{ animation: 'slideUp 0.5s ease-out forwards 0.2s both' }}>
        {s.continueBtn}
      </Button>
    </form>
  );
}

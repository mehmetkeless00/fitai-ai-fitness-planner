'use client';

import { useState } from 'react';
import ToggleGroup from '../../ui/ToggleGroup';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';

export default function GoalsForm({ onNext, formData }) {
  const [data, setData] = useState(formData || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.fitnessGoal) newErrors.fitnessGoal = 'Fitness goal is required';
    if (!data.experience) newErrors.experience = 'Experience level is required';
    if (!data.frequency) newErrors.frequency = 'Workout frequency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('[GoalsForm] Submitting:', data);
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
        <FormGroup
          label="Fitness Goals"
          description="Choose the goals that matter most to you"
        >
          <ToggleGroup
            options={[
              { value: 'lose-weight', label: 'Lose Weight' },
              { value: 'build-muscle', label: 'Build Muscle' },
              { value: 'endurance', label: 'Endurance' },
              { value: 'flexibility', label: 'Flexibility' },
              { value: 'general-fitness', label: 'General Fitness' },
              { value: 'performance', label: 'Performance' },
            ]}
            value={data.fitnessGoal || ''}
            onChange={(val) => setData({ ...data, fitnessGoal: val })}
            label="Primary Goal"
            required
          />
        </FormGroup>
      </div>

      <div className="form-section">
        <FormGroup
          label="Experience Level"
          description="Help us match your workouts to your fitness level"
        >
          <ToggleGroup
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
              { value: 'elite', label: 'Elite' },
            ]}
            value={data.experience || ''}
            onChange={(val) => setData({ ...data, experience: val })}
            label="Workout Experience"
            required
          />
        </FormGroup>
      </div>

      <div className="form-section">
        <FormGroup label="Workout Frequency">
          <Select
            label="Days per week"
            options={[
              { value: '3', label: '3 days/week' },
              { value: '4', label: '4 days/week' },
              { value: '5', label: '5 days/week' },
              { value: '6', label: '6 days/week' },
              { value: '7', label: '7 days/week' },
            ]}
            value={data.frequency || ''}
            onChange={(e) => setData({ ...data, frequency: e.target.value })}
            error={errors.frequency}
            required
          />
        </FormGroup>
      </div>

      <Button type="submit" className="w-full" style={{ animation: 'slideUp 0.5s ease-out forwards 0.2s both' }}>
        Continue →
      </Button>
    </form>
  );
}

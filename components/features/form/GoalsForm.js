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

      <Button type="submit" className="w-full">
        Continue →
      </Button>
    </form>
  );
}

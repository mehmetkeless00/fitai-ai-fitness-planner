'use client';

import { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';

export default function PersonalInfoForm({ onNext, formData }) {
  const [data, setData] = useState(formData || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.age) newErrors.age = 'Age is required';
    if (!data.gender) newErrors.gender = 'Gender is required';
    if (!data.height) newErrors.height = 'Height is required';
    if (!data.weight) newErrors.weight = 'Weight is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('[PersonalInfoForm] Submitting:', data);
      onNext(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormGroup label="Your Profile" description="Tell us about yourself so we can create a personalized plan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            min="13"
            max="120"
            value={data.age || ''}
            onChange={(e) => setData({ ...data, age: e.target.value })}
            error={errors.age}
            required
          />

          <Select
            label="Gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            value={data.gender || ''}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
            error={errors.gender}
            required
          />

          <Input
            label="Height (cm)"
            type="number"
            min="100"
            max="250"
            value={data.height || ''}
            onChange={(e) => setData({ ...data, height: e.target.value })}
            error={errors.height}
            required
          />

          <Input
            label="Weight (kg)"
            type="number"
            min="30"
            max="300"
            value={data.weight || ''}
            onChange={(e) => setData({ ...data, weight: e.target.value })}
            error={errors.weight}
            required
          />
        </div>
      </FormGroup>

      <Button type="submit" className="w-full">
        Continue →
      </Button>
    </form>
  );
}

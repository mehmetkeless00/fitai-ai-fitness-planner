'use client';

import { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';

export default function PreferencesForm({ onNext, formData }) {
  const [data, setData] = useState(formData || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.dietaryPreference) newErrors.dietaryPreference = 'Dietary preference is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('[PreferencesForm] Submitting:', data);
      onNext(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormGroup
        label="Dietary Preferences"
        description="Customize your meal plan based on your preferences"
      >
        <Select
          label="Main Dietary Preference"
          options={[
            { value: 'omnivore', label: 'Omnivore (eat everything)' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'keto', label: 'Keto' },
            { value: 'paleo', label: 'Paleo' },
            { value: 'mediterranean', label: 'Mediterranean' },
            { value: 'low-carb', label: 'Low Carb' },
          ]}
          value={data.dietaryPreference || ''}
          onChange={(e) => setData({ ...data, dietaryPreference: e.target.value })}
          error={errors.dietaryPreference}
          required
        />
      </FormGroup>

      <FormGroup
        label="Allergies & Restrictions"
        description="Let us know what foods to avoid"
      >
        <Input
          label="List any allergies or restrictions (e.g., nuts, dairy, gluten)"
          type="text"
          placeholder="Separate multiple items with commas"
          value={data.allergies || ''}
          onChange={(e) => setData({ ...data, allergies: e.target.value })}
        />
      </FormGroup>

      <FormGroup label="Additional Info">
        <Input
          label="Any other notes or preferences?"
          type="textarea"
          placeholder="Tell us anything else we should know..."
          value={data.notes || ''}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          as="textarea"
          rows="4"
        />
      </FormGroup>

      <Button type="submit" className="w-full">
        Generate My Plan →
      </Button>
    </form>
  );
}

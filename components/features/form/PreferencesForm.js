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
      </div>

      <div className="form-section">
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
      </div>

      <div className="form-section">
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
      </div>

      <Button type="submit" className="w-full" style={{ animation: 'slideUp 0.5s ease-out forwards 0.2s both' }}>
        Generate My Plan →
      </Button>
    </form>
  );
}

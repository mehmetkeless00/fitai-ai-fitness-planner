'use client';

import { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormGroup from '../../ui/FormGroup';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function PreferencesForm({ onNext, formData }) {
  const [data, setData] = useState(formData || {});
  const [errors, setErrors] = useState({});
  const { t } = useLanguage();
  const s = t.createPlan.preferences;

  const validate = () => {
    const newErrors = {};
    if (!data.dietaryPreference) newErrors.dietaryPreference = s.errors.dietaryPreference;
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
        <FormGroup label={s.dietLabel} description={s.dietDesc}>
          <Select
            label={s.dietSelect}
            options={s.dietOptions}
            value={data.dietaryPreference || ''}
            onChange={(e) => setData({ ...data, dietaryPreference: e.target.value })}
            error={errors.dietaryPreference}
            required
          />
        </FormGroup>
      </div>

      <div className="form-section">
        <FormGroup label={s.allergiesLabel} description={s.allergiesDesc}>
          <Input
            label={s.allergiesInput}
            type="text"
            placeholder={s.allergiesPlaceholder}
            value={data.allergies || ''}
            onChange={(e) => setData({ ...data, allergies: e.target.value })}
          />
        </FormGroup>
      </div>

      <div className="form-section">
        <FormGroup label={s.additionalLabel}>
          <Input
            label={s.additionalInput}
            type="textarea"
            placeholder={s.additionalPlaceholder}
            value={data.notes || ''}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            as="textarea"
            rows="4"
          />
        </FormGroup>
      </div>

      <Button type="submit" className="w-full" style={{ animation: 'slideUp 0.5s ease-out forwards 0.2s both' }}>
        {s.generateBtn}
      </Button>
    </form>
  );
}

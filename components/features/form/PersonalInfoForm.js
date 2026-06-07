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
    const age = parseInt(data.age);
    const height = parseInt(data.height);
    const weight = parseInt(data.weight);

    if (!data.age || isNaN(age) || age < 13 || age > 100) {
      newErrors.age = 'Age must be between 13 and 100';
    }
    if (!data.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!data.height || isNaN(height) || height < 100 || height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    if (!data.weight || isNaN(weight) || weight < 30 || weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }

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
        .form-field {
          animation: slideUp 0.5s ease-out forwards;
        }
        .form-field:nth-child(1) { animation-delay: 0.05s; }
        .form-field:nth-child(2) { animation-delay: 0.1s; }
        .form-field:nth-child(3) { animation-delay: 0.15s; }
        .form-field:nth-child(4) { animation-delay: 0.2s; }
      `}</style>

      <FormGroup label="Your Profile" description="Tell us about yourself so we can create a personalized plan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-field">
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
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-field">
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
        </div>
      </FormGroup>

      <Button type="submit" className="w-full" style={{ animation: 'slideUp 0.5s ease-out forwards 0.25s both' }}>
        Continue →
      </Button>
    </form>
  );
}

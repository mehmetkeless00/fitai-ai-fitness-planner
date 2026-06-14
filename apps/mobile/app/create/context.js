import { createContext, useContext, useState } from 'react';

const CreatePlanContext = createContext(null);

export function useCreatePlan() {
  return useContext(CreatePlanContext);
}

export function CreatePlanProvider({ children }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    experience: '',
    frequency: 3,
    dietaryPreference: '',
    allergies: '',
    lang: 'en',
  });

  const update = (fields) => setFormData((prev) => ({ ...prev, ...fields }));

  return (
    <CreatePlanContext.Provider value={{ formData, update }}>
      {children}
    </CreatePlanContext.Provider>
  );
}

import { useState, useCallback } from 'react';
import { getActivePlan, setActivePlan } from '@fitflow/core';

export function usePlan() {
  const [plan, setPlanState] = useState(() => getActivePlan());

  const activatePlan = useCallback((id) => {
    setActivePlan(id);
    setPlanState(getActivePlan());
  }, []);

  const refreshPlan = useCallback(() => {
    setPlanState(getActivePlan());
  }, []);

  return { plan, activatePlan, refreshPlan };
}

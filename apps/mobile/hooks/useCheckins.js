import { useState, useCallback } from 'react';
import { listCheckins, saveCheckin as coreSaveCheckin } from '@fitflow/core';

export function useCheckins() {
  const [checkins, setCheckins] = useState(() => listCheckins());

  const saveCheckin = useCallback((entry) => {
    coreSaveCheckin(entry);
    setCheckins(listCheckins());
  }, []);

  const refresh = useCallback(() => {
    setCheckins(listCheckins());
  }, []);

  return { checkins, saveCheckin, refresh };
}

import { Redirect } from 'expo-router';
import { getActivePlan } from '@fitflow/core';

export default function Index() {
  const plan = getActivePlan();
  return <Redirect href={plan ? '/(tabs)/overview' : '/welcome'} />;
}

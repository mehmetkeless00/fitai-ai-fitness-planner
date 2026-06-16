---
description: "Expo React Native development for FitFlow mobile app. Invoked for any mobile-specific task: screens, navigation, AsyncStorage, NativeWind, haptics, expo-router, native APIs, or Expo SDK questions."
---

# FitFlow React Native — Mobile (Expo SDK 54)

You are the mobile engineer for FitFlow. This is a managed Expo workflow targeting Expo SDK 54.

> **IMPORTANT**: Read https://docs.expo.dev/versions/v54.0.0/ before writing any Expo API code. The SDK changes every release.

## Stack

| Concern | Library | Version |
|---|---|---|
| Framework | Expo (managed workflow) | SDK 54 |
| Routing | expo-router | 6.x (file-based) |
| Styling | NativeWind | v4 |
| Storage | @react-native-async-storage/async-storage | 2.2.0 |
| Haptics | expo-haptics | ~15.0.8 — first-party, no plugin entry needed |
| PDF | expo-print + expo-sharing | built-in |
| SVG | react-native-svg | 15.12.1 |
| Gesture | react-native-gesture-handler + react-native-reanimated | included |
| Safe area | react-native-safe-area-context | ~5.6.0 |

## File Structure

```
apps/mobile/
├── app/
│   ├── _layout.js         Root: await initStorage() → setStorageAdapter → LanguageProvider → Stack
│   ├── index.js           Redirect: plan exists? → /(tabs)/overview : /welcome
│   ├── welcome.js         Onboarding: logo + feature bullets + CTA
│   ├── error.js           Error boundary (bilingual inline — no LanguageContext)
│   ├── create/
│   │   ├── _layout.js     Stack + CreatePlanContext provider
│   │   ├── index.js       Step 1: age, gender, height, weight
│   │   ├── goals.js       Step 2: fitnessGoal, experience, frequency
│   │   └── preferences.js Step 3: diet, allergies, language → generateSmartPlan()
│   ├── (tabs)/
│   │   ├── _layout.js     Bottom tab navigator (5 tabs)
│   │   ├── overview.js    Macros + recovery + hydration + share
│   │   ├── workout.js     7-day accordion + exercise modal
│   │   ├── meals.js       Day selector + meal slots
│   │   ├── progress.js    Check-in form + sparkline + coach
│   │   └── plans.js       Plan library with rename/delete
│   └── modal/
│       ├── exercise.js    Exercise detail sheet
│       ├── settings.js    Language, units, notifications, legal
│       └── privacy.js     Full privacy policy (EN + TR inline)
├── components/
│   ├── ui/                Button, Card, Input, Toggle
│   └── features/          WorkoutDay, MealRow, CoachCard, Sparkline
├── contexts/
│   └── createPlanContext.js  3-step form shared state
├── hooks/
│   ├── usePlan.js         getActivePlan() wrapper with refresh
│   └── useCheckins.js     listCheckins() + saveCheckin() wrapper
├── i18n/
│   ├── strings.js         Mobile UI strings (EN + TR, 170 keys)
│   └── LanguageContext.js Provides lang, setLang, t, units, setUnits, notifications, setNotifications
├── storage/
│   └── asyncAdapter.js    In-memory cache bridging AsyncStorage ↔ synchronous @fitflow/core
└── utils/
    ├── formatDate.js      Always Gregorian (avoids iOS Hijri bug)
    └── sharePlan.js       expo-print + expo-sharing → PDF share sheet
```

## Critical: Storage Bridge

`@fitflow/core` is synchronous. AsyncStorage is async. The bridge:

```js
// asyncAdapter.js — NEVER change this pattern
const FITFLOW_KEYS = ['fitflow.plans.v2', 'fitflow.progress.v1', 'fitflow.lang', 'fitflow.units', 'fitflow.notifications'];
const cache = new Map();

export async function initStorage() {
  const pairs = await AsyncStorage.multiGet(FITFLOW_KEYS);
  for (const [k, v] of pairs) { if (v !== null) cache.set(k, v); }
}

export const asyncAdapter = {
  getItem: (k) => cache.get(k) ?? null,               // synchronous
  setItem: (k, v) => { cache.set(k, String(v)); AsyncStorage.setItem(k, String(v)); },
  removeItem: (k) => { cache.delete(k); AsyncStorage.removeItem(k); },
};
```

**Adding a new persisted key**: add it to `FITFLOW_KEYS` in `asyncAdapter.js` AND to `LanguageContext.js` if it's a preference.

## NativeWind v4 Rules

- Use `contentContainerClassName` on ScrollView/FlatList, NOT `contentContainerStyle`.
- Dark mode: every color class needs `dark:` counterpart.
- `className` on custom components: pass through to root View/Pressable.
- Gap: `gap-N` works in flex containers (RN 0.71+).

```jsx
<ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
```

## expo-router Navigation

```js
const router = useRouter();
router.push('/create');           // push onto stack
router.replace('/(tabs)/overview'); // replace (used after plan creation)
router.back();                    // close modal
router.push({ pathname: '/modal/exercise', params: { ex: JSON.stringify(exercise) } });
```

Modal registration in `_layout.js`:
```jsx
<Stack.Screen name="modal/exercise" options={{ presentation: 'modal' }} />
<Stack.Screen name="modal/settings" options={{ presentation: 'modal' }} />
<Stack.Screen name="modal/privacy" options={{ presentation: 'modal' }} />
```

## Haptics Pattern

```js
import * as Haptics from 'expo-haptics';

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // save check-in
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);              // activate plan
```

**expo-haptics MUST NOT appear in `app.json` plugins array.** It is a first-party module with no config plugin.

## useFocusEffect Pattern

Use `useFocusEffect` to refresh data when a tab is revisited:
```js
useFocusEffect(useCallback(() => {
  refreshPlan();
  refresh();
}, [refreshPlan, refresh]));
```

## Date Formatting

Always use `formatDate(dateStr, lang)` from `utils/formatDate.js`. **Never use `new Date().toLocaleDateString()`** — it uses the device locale which triggers the iOS Hijri calendar bug when device region is Arabic.

## Plan Generation Flow (Step 3 → Overview)

```js
const plan = generateSmartPlan(profile);
const merged = { ...profile, ...plan, generatedAt: new Date().toISOString() };
const autoName = `${goalStr} — ${formatDate(new Date().toISOString(), uiLang)}`;
const id = savePlan(merged, autoName);   // data first, name second
setActivePlan(id);
router.replace('/(tabs)/overview');
```

## Weight Units Pattern

Weight is always stored in **kg**. Display conversion happens only at the UI layer:

```js
// Pre-fill from stored kg → display value
const displayVal = units === 'lbs'
  ? String(Math.round((today.weight / 0.453592) * 10) / 10)
  : String(today.weight);

// Save: lbs → kg conversion before storing
const weightKg = units === 'lbs' ? w * 0.453592 : w;
```

Validation ranges: `kg` → [20, 500]; `lbs` → [44, 1100].

## Accessibility Defaults

Every screen title:
```jsx
<Text className="text-xl font-bold text-slate-900 dark:text-white" accessibilityRole="header">
  {t.tabs.progress}
</Text>
```

Every Pressable: `accessibilityRole="button"` + `accessibilityLabel={i18nString}`.
FlatList items: `accessibilityRole="button"` + `accessibilityHint` for non-obvious interactions.

## Error Boundary Note

`app/error.js` intentionally does NOT use `useLanguage()`. It renders bilingual inline text. This is correct — it renders when the LanguageProvider itself may have crashed.

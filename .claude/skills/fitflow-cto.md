---
description: "Master architect skill for FitFlow. Invoked for cross-cutting decisions, architecture questions, tech debt triage, monorepo coordination, or any task that spans web + mobile + core. Automatically delegates to the right sub-skill."
---

# FitFlow CTO — Master Architect

You are the lead architect for FitFlow, a Turborepo monorepo that ships:
- **`apps/web`** — Next.js 14, Tailwind CSS, Vercel deployment, optional Supabase auth
- **`apps/mobile`** — Expo SDK 54, React Native 0.81.5, expo-router 6.x, NativeWind v4
- **`packages/core`** — zero-dependency shared business logic (plan engine, storage, i18n, coaching)

## Monorepo Architecture

```
fitflow/
├── apps/web/           Next.js 14 + Tailwind + Supabase (optional)
├── apps/mobile/        Expo SDK 54 + NativeWind + AsyncStorage
└── packages/core/      Pure-JS, zero-dep: plan engine, storage, translations
```

### The Storage Contract
`@fitflow/core` storage functions are **synchronous** (localStorage API shape).
- **Web**: uses `localStorage` directly via the default adapter.
- **Mobile**: uses an in-memory cache preloaded from AsyncStorage at boot (`asyncAdapter.js`). Reads are synchronous; writes go to cache immediately and fire async to AsyncStorage.
- **NEVER** make core storage functions async — it would break the synchronous adapter pattern.

### Core Public API
```js
// Plan engine
generateSmartPlan(profile)           // BMR → TDEE → macros → 7-day plan
recommendCalorieAdjustment(planData, checkins)
applyCalorieAdjustment(planData, deltaCalories)
blendRecoveryScore(base, checkins, workoutPlan)
generateCoachNarrative(planData, checkins, t)

// Plan storage
savePlan(data, name?)  → id         // data first, name second
setActivePlan(id), getActivePlan()
listPlans(), getPlan(id)
renamePlan(id, name), updatePlanData(id, data), deletePlan(id)
importPlans(entries), setSyncHandler(fn)
MAX_PLANS = 10

// Progress
saveCheckin({ date, weight?, workoutsDone? })
listCheckins(), importCheckins(entries)
setProgressSyncHandler(fn)
MAX_ENTRIES = 120

// i18n
translations[lang]    // 'en' | 'tr' — plan content + UI labels
getPlanStrings(lang)  // meal/workout data strings
getExerciseDemo(name, lang), getCategoryEmoji(category)

// Storage adapter
setStorageAdapter(adapter)  // called once at boot in _layout.js
```

### Key Architectural Decisions

| Decision | Rule |
|---|---|
| All business logic | In `packages/core` — never duplicate in web or mobile |
| Weight storage | Always kg internally; lbs conversion only at display layer |
| LanguageContext | Single source of truth for `lang`, `units`, `notifications` on mobile |
| Supabase | Optional — `isCloudEnabled` gates all cloud calls; app runs fully offline without env vars |
| Calorie adjustment cooldown | 7 days enforced in UI; stored as `calorieAdjustedAt` in plan data |
| Plan cap | `MAX_PLANS = 10` enforced in `planStorage.js` |
| Check-in cap | `MAX_ENTRIES = 120` enforced in `progressStorage.js` |
| expo-haptics | First-party Expo module — NO entry needed in `app.json` plugins array |
| Splash | `resizeMode: "contain"`, `backgroundColor: "#E6F4FE"` |
| Bundle ID | `com.fitflow.app` (iOS + Android) |

## When to Delegate

| User asks about | Delegate to |
|---|---|
| React Native, Expo, NativeWind | `fitflow-react-native` |
| Next.js, web UI, web components | `fitflow-frontend` |
| Design system, dark mode, accessibility | `fitflow-ui-ux` |
| Translations, EN/TR strings, i18n parity | `fitflow-i18n` |
| Performance, FlatList, bundle size | `fitflow-performance` |
| Tests, Vitest, coverage | `fitflow-testing` |
| Supabase, cloud sync, auth | `fitflow-supabase` |
| EAS builds, TestFlight, App Store | `fitflow-release-manager` |
| Feature prioritization, roadmap | `fitflow-product-manager` |

## Quality Gates (all changes must pass)

1. `npm run build --workspace=apps/web` → clean (no TS errors, no missing imports)
2. EN and TR string key counts must be equal (currently 170 keys)
3. No hardcoded English strings in any mobile screen (use `t.*` from `useLanguage()`)
4. New `@fitflow/core` functions must have a Vitest test in `packages/core/__tests__/`
5. `expo-haptics` never appears in `app.json` plugins array
6. Weight is stored in kg; lbs conversion only in progress.js display/save layer

## Architecture Principles

- **Local-first**: data on device is always authoritative; cloud is a mirror, never required
- **No abstractions ahead of need**: three similar lines > a premature utility
- **Shared logic lives in core**: web and mobile are thin shells over `@fitflow/core`
- **Zero API calls for plan generation**: `generateSmartPlan()` runs fully on-device

## Example: Adding a new feature

When asked to add a new tracked metric (e.g. body fat %):

1. Confirm it's stored in kg-equivalent internally or dimensionless
2. Add storage key to `FITFLOW_KEYS` in `asyncAdapter.js`
3. Extend `LanguageContext` if it's a user preference
4. Add strings to both EN and TR sections of `strings.js`
5. Write a Vitest test for any core logic
6. Verify 170+ key parity after changes

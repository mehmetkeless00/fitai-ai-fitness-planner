---
description: "Performance optimization for FitFlow (web and mobile). Invoked for bundle size concerns, FlatList/ScrollView optimization, memoization, re-render reduction, SVG performance, and startup time."
---

# FitFlow Performance

You are the performance engineer for FitFlow. Focus on measurable improvements; never optimize speculatively.

## Mobile Performance Priorities

### 1. App Startup (Critical Path)

The startup sequence in `_layout.js`:
```
1. JS bundle parse
2. initStorage() — AsyncStorage.multiGet(5 keys) ← only async operation
3. setStorageAdapter(asyncAdapter)
4. AsyncStorage.getItem('fitflow.lang'), 'fitflow.units', 'fitflow.notifications'
5. LanguageProvider renders
6. Stack renders → index.js → redirect
```

**Optimization**: All 5 keys are loaded in a single `multiGet` call. Do not add additional `getItem` calls after `initStorage()` — instead add new keys to `FITFLOW_KEYS` so they load in the same batch.

Current timing budget: `initStorage()` should complete in < 50ms on device. If additional storage operations are needed at boot, batch them all into `initStorage()`.

### 2. FlatList in Plans Tab

`plans.js` uses `FlatList` with plan objects. Keep renders fast:
```jsx
// Good: keyExtractor from a stable ID
keyExtractor={(item) => item.id}

// Good: simple renderItem with no nested state
renderItem={({ item }) => <PlanCard item={item} isActive={item.id === activeId} />}

// If list grows beyond ~20 items, add:
initialNumToRender={8}
maxToRenderPerBatch={5}
windowSize={5}
removeClippedSubviews={true}
```

Current plan cap is `MAX_PLANS = 10` — FlatList performance is not a concern at this scale. Do not over-optimize.

### 3. Sparkline SVG (`components/features/Sparkline.js`)

The Sparkline renders with `react-native-svg` directly — no memoization needed for up to ~120 check-ins (`MAX_ENTRIES`). The component only re-renders when `checkins` prop changes (controlled by `useCheckins` hook).

If the user has many check-ins:
```jsx
// Downsample to last 30 entries for the chart
const recent = checkins.slice(-30);
```

### 4. Re-render Reduction

Hooks `usePlan` and `useCheckins` use `useCallback` on all mutating functions. This is already done. When adding new hooks:
- `useCallback` on all `useCallback`-able functions
- `useState` initializer as a function: `useState(() => expensiveComputation())`

### 5. Heavy Components

`CoachCard` renders 5 narrative items. No optimization needed — they are pure Text components.

`WorkoutDay` accordion: keep state local (`useState` for isOpen), not in parent. Already done.

## Web Performance Priorities

### Bundle Size

The PDF generator imports a large base64 font file (`pdfFonts.js`). This is already behind a dynamic import:
```js
// Good — font loads only when share is clicked
const { openSansRegular, openSansBold } = await import('./pdfFonts');
```

Never static-import `pdfFonts.js`. It is intentionally isolated.

### Server vs Client Components

The web app defaults to React Server Components (Next.js 14 App Router). Only add `'use client'` when genuinely needed:
- `useLanguage()`, `useRouter()`, `useState`, `useEffect` → need `'use client'`
- Pure presentation with no interactivity → server component, no directive

`apps/web/app/privacy/page.js` is a server component (no client directive) — correct, it has no interactivity.

### Image Optimization

If adding images to the web app, always use Next.js `<Image>` component with explicit `width` and `height`. Never use raw `<img>`.

### Turbo Cache

Turborepo caches build outputs in `.turbo/cache/`. If a build is stale, run:
```bash
turbo build --force  # bypass cache
```

## Measurement Commands

```bash
# Mobile: check bundle size breakdown
cd apps/mobile && npx expo export --platform ios --output-dir dist-ios 2>&1 | grep -E "MB|kB"

# Web: check page weights from Next.js build output
npm run build --workspace=apps/web 2>&1 | grep -E "kB|First Load"

# Core: check that core package has no accidental deps
cat packages/core/package.json | grep dependencies
```

## What NOT to Optimize

- `generateSmartPlan()` — runs in < 5ms on any device. Do not memoize or lazy-load.
- `listPlans()` / `listCheckins()` — synchronous in-memory reads. Do not add caching.
- `translations` — small static object. Do not code-split.
- The 3-step create flow — it sees 3 screens total. No lazy loading needed.

## Performance Regression Checklist

When adding any new screen or component:
- [ ] No synchronous expensive computation in render body (move to `useMemo` if truly needed)
- [ ] `FlatList` `keyExtractor` returns a stable, unique string (use `item.id`)
- [ ] No anonymous inline functions in `FlatList` `renderItem` (extract to named function)
- [ ] Dynamic imports used for any module > 50kB that isn't needed on first paint
- [ ] `useFocusEffect` not adding extra fetches beyond what's necessary

---
description: "Design system, component quality, accessibility, and visual polish for FitFlow across web and mobile. Invoked for UI changes, dark mode, WCAG compliance, empty states, loading states, and component composition."
---

# FitFlow UI/UX — Design System & Accessibility

You are the design system engineer for FitFlow, responsible for component quality, accessibility, and visual consistency across both platforms.

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Brand blue | `#0ea5e9` (sky-500) | Primary CTA, active states, focus rings |
| Background light | `#f8fafc` (slate-50) | Screen backgrounds |
| Background dark | `#0f172a` (slate-900) | Dark mode screen background |
| Card light | `white` | Card surfaces |
| Card dark | `#1e293b` (slate-800) | Dark mode card surfaces |
| Text primary | `#0f172a` (slate-900) | Headings, important labels |
| Text secondary | `#475569` (slate-600) | Body text |
| Text muted | `#94a3b8` (slate-400) | Hints, timestamps, placeholders |
| Border light | `#e2e8f0` (slate-200) | Input borders, dividers |
| Success | `#10b981` (emerald-500) | On-track states, saved confirmations |
| Warning | `#f59e0b` (amber-400) | Recovery mid-range, adjustment suggestions |
| Danger | `#ef4444` (red-500) | Delete actions, error states, safety tips |

## Mobile UI Components

All mobile components live in `apps/mobile/components/`. Use RN primitives wrapped with NativeWind.

### Button
```jsx
// 3 variants: primary (sky-500), secondary (border only), danger (red-500)
<Button onPress={fn} variant="primary" loading={false} disabled={false}>
  {t.create.next}
</Button>
// Always set: accessibilityRole="button" (auto-set inside Button.js)
// Always set: accessibilityState={{ disabled, busy: loading }} (auto-set)
```

### Input
```jsx
<Input
  label={t.progress.weightLabel}
  placeholder={t.progress.weightPlaceholder}
  keyboardType="decimal-pad"
  value={weight}
  onChangeText={setWeight}
  error={errors.weight}
  accessibilityLabel={t.progress.weightLabel}  // explicit — don't rely on label prop alone
/>
// error prop: shows red border + red helper text below
```

### Toggle (pill-row radio group)
```jsx
<Toggle
  label={t.create.goal}
  options={[{ value: 'lose-weight', label: c.loseWeight }, ...]}
  value={formData.fitnessGoal}
  onChange={(v) => update({ fitnessGoal: v })}
/>
// accessibilityRole="radio" + accessibilityState={{ checked }} auto-set per pill
```

### Card
```jsx
<Card className="mb-3">
  {/* content */}
</Card>
// NativeWind: bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700
```

### OptionRow (Settings-style row with checkmark)
```jsx
<OptionRow
  label={s.unitKg}
  selected={units === 'kg'}
  onPress={() => setUnits('kg')}
/>
// accessibilityRole="radio" + accessibilityState={{ checked: selected }} auto-set
```

## Accessibility Requirements (WCAG 2.1 AA)

Every interactive element must have:
- `accessibilityRole` — `"button"`, `"radio"`, `"checkbox"`, `"switch"`, `"tab"`, `"header"`
- `accessibilityLabel` — i18n'd string, never raw English
- `accessibilityState` — `{ checked, selected, disabled, busy }` as appropriate
- `accessibilityHint` — for non-obvious interactions (e.g. long-press on plan cards)

Screen titles use `accessibilityRole="header"` on the Text component.

Minimum touch target: 44×44 pt. Pressable elements that look small must have sufficient padding.

## Dark Mode Rules

- Every class that sets a color must have a `dark:` counterpart.
- Background chain: `bg-slate-50 dark:bg-slate-900` (screen) → `bg-white dark:bg-slate-800` (card) → `bg-slate-50 dark:bg-slate-700` (input).
- Test dark mode for every new screen — Expo simulates it via Settings → Developer → Dark Appearance.

## State Requirements

Every screen that fetches or saves data needs:

| State | Component | Example |
|---|---|---|
| Loading | `ActivityIndicator` centered | Boot splash in `_layout.js` |
| Empty | `Text` with i18n'd message | `{pl.noPlan}` in plans.js |
| Error | `Alert.alert` or inline error text | Invalid weight in progress.js |
| Success | Transient feedback, 2s timeout | `justSaved → p.saved` in progress.js |

## Section Headers (Settings-style)

```jsx
<Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 mt-4 px-1">
  {title}
</Text>
```

## Dividers

```jsx
<View className="h-px bg-slate-100 dark:bg-slate-700 mx-4" />
```

## Coming Soon Badge

```jsx
<View className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md">
  <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.comingSoon}</Text>
</View>
```

## Quality Checklist for UI Changes

- [ ] All Text elements with color have a `dark:` counterpart
- [ ] All interactive elements have `accessibilityRole` + `accessibilityLabel`
- [ ] Empty state: what does the user see when there's no data?
- [ ] Loading state: what does the user see while saving?
- [ ] Error state: is the error message in the current language?
- [ ] Touch targets ≥ 44×44 pt
- [ ] Scroll areas use `contentContainerClassName` (NativeWind v4), not `contentContainerStyle`

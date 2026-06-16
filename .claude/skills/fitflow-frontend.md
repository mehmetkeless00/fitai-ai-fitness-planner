---
description: "Next.js web app development for FitFlow. Invoked for web-specific tasks: pages, API routes, web components, Tailwind CSS, Supabase auth UI, PDF export, SEO, and Vercel deployment."
---

# FitFlow Frontend — Web (Next.js 14)

You are the frontend engineer for FitFlow's web app at `apps/web/`.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 App Router, `"use client"` where needed |
| Language | JavaScript (no TypeScript in web app) |
| Styling | Tailwind CSS 3 + custom dark mode tokens |
| Auth | Supabase (optional — gated by `isCloudEnabled`) |
| PDF | `jspdf` + embedded OpenSans font for Turkish glyph support |
| Analytics | `@vercel/analytics/react` (already wired in layout.js) |
| Deployment | Vercel (`apps/web` is the project root) |
| i18n | `LanguageProvider` from `components/layout/LanguageProvider.js` using `@fitflow/core` `translations` |

## Directory Structure

```
apps/web/
├── app/
│   ├── layout.js           Root layout: ThemeProvider → LanguageProvider → AuthProvider → Analytics
│   ├── page.js             Home: Navigation + Hero + HowItWorks + Features + CTA + HomeFooter
│   ├── create-plan/page.js 3-step form (PersonalInfoForm → GoalsForm → PreferencesForm)
│   ├── result/page.js      Plan dashboard: NutritionSummary + WorkoutPlan + MealPlan + SmartCoach
│   ├── plans/page.js       Plan library (Supabase-synced or localStorage)
│   ├── auth/page.js        Supabase sign-in/sign-up (only renders if isCloudEnabled)
│   ├── privacy/page.js     Privacy Policy (static, no client components)
│   └── api/generate-plan/  Edge function wrapping generateSmartPlan()
├── components/
│   ├── layout/             Navigation, HomeFooter, Container, LanguageProvider, ThemeProvider, AuthProvider
│   ├── features/           home/, form/, results/
│   └── ui/                 Button, Card, Input, Select, FormGroup, ToggleGroup, PremiumLoadingScreen
├── lib/supabase.js         Lazy singleton; returns null if env vars absent
├── utils/
│   ├── cloudSync.js        Mirror mutations to Supabase; never blocks local state
│   └── pdf-generator.js    jsPDF with embedded fonts; called from result page
```

## Component Rules

- **`'use client'`** only when you need `useState`, `useEffect`, `useContext`, or browser APIs. Server components by default.
- Import path alias: `@/` maps to `apps/web/` (configured in `jsconfig.json`).
- `useLanguage()` from `@/components/layout/LanguageProvider` gives `{ lang, toggleLanguage, t }` where `t` is `translations[lang]`.
- Never access `localStorage` directly in server components. Always guard with `typeof window !== 'undefined'` or use `useEffect`.

## Tailwind Dark Mode

The project uses class-based dark mode (`darkMode: 'class'`). The `ThemeProvider` sets `dark` on `<html>`. Use:
```jsx
className="text-slate-900 dark:text-white bg-white dark:bg-slate-900"
```

Custom tokens in `tailwind.config.js`:
```js
dark: { surface: '#0f172a', border: '#1e293b' }  // bg-dark-surface, border-dark-border
```

## PDF Export

`utils/pdf-generator.js` uses `jsPDF` with dynamically-imported `pdfFonts.js` (base64 OpenSans). The dynamic import keeps fonts out of the initial bundle. Pattern:
```js
const { openSansRegular, openSansBold } = await import('./pdfFonts');
doc.addFileToVFS('OpenSans-Regular.ttf', openSansRegular);
doc.addFont('OpenSans-Regular.ttf', 'OpenSans', 'normal');
```
Never use built-in jsPDF fonts for Turkish content — they cannot render ğ, ş, ı, İ.

## API Route

`app/api/generate-plan/route.js` wraps `generateSmartPlan()`. Validation matches the mobile form. Returns the merged plan `{ ...profile, ...plan, generatedAt }`. No auth required — the plan engine is pure JS, zero network calls.

## Supabase Integration Pattern

```js
// Always gate on isCloudEnabled
import { isCloudEnabled, getSupabase } from '@/lib/supabase';

if (!isCloudEnabled) return null;  // app works without Supabase
const sb = getSupabase();
```

Cloud sync is fire-and-forget via `cloudSync.js`. Local storage is always updated first. Errors in cloud sync are logged but never surface to the user.

## Quality Standards

- Every new page needs an `export const metadata` with `title` and `description`.
- `sitemap.js` and `robots.js` are in `app/` — update sitemap when adding public pages.
- `HomeFooter.js` contains Privacy Policy + Contact links — update when adding legal pages.
- Web build must pass: `npm run build --workspace=apps/web`.

## Example: Adding a new result tab (e.g. Grocery List)

```jsx
// apps/web/components/features/results/GroceryList.js
'use client';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function GroceryList({ groceryList }) {
  const { t } = useLanguage();
  if (!groceryList?.length) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        {t.result.groceryList}
      </h2>
      <ul className="space-y-1">
        {groceryList.map((item) => (
          <li key={item} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span className="text-sky-500">•</span> {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

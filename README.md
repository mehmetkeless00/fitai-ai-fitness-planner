# FitFlow — Personalized Fitness & Nutrition Planner

**Generate a complete, science-based 7-day workout and meal plan in seconds — free, bilingual (EN/TR), no signup required.**

[![CI](https://github.com/mehmetkeless00/fitai-ai-fitness-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/mehmetkeless00/fitai-ai-fitness-planner/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-fitflow-0ea5e9?style=flat-square)](https://fitai-ai-fitness-planner.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

![FitFlow home page](docs/screenshots/home-dark.png)

**[→ Try the live app](https://fitai-ai-fitness-planner.vercel.app/)**

---

## What it does

FitFlow asks for your profile (age, height, weight, goals, experience, training frequency, dietary preference) in a 3-step form, then generates a full week of training and nutrition:

- **Workout plan** — 3–7 day splits with sets, reps, rest times, RPE targets, warm-up/cool-down routines, exercise alternatives, and per-exercise form instructions
- **Nutrition plan** — daily calories and macros calculated from your profile, four meals per day matched to 7 dietary preferences (omnivore → vegan → keto…), with allergy filtering
- **Coach insights** — recovery score, risk flags, daily habit tips, hydration targets, and a weekly grocery list
- **PDF export** — the entire plan as a downloadable PDF, fully localized (including embedded Unicode font support for Turkish characters)
- **Bilingual UI** — complete English and Turkish coverage via a hand-rolled i18n layer, including the generated plan content

## How the plan engine works

The generator is a transparent, rule-based engine built on established sports-science formulas — no black boxes:

```
Profile → BMR (Mifflin-St Jeor) → TDEE (activity factor by training frequency)
       → goal-adjusted calories (surplus/deficit) → macro split by goal
       → workout split by experience level & frequency → meals by diet + allergies
       → recovery score, risk flags, hydration & habit recommendations
```

Every number shown to the user is reproducible from the formulas in [`utils/generateSmartPlan.js`](utils/generateSmartPlan.js).

**The plan adapts over time.** Daily check-ins (weight + completed workouts) feed an adjustment loop: `recommendCalorieAdjustment` compares your actual weekly weight change against the goal's target rate (e.g. −0.25 to −0.5 kg/week for fat loss) and, when you drift outside tolerance, recommends a bounded ±100–250 kcal correction you can apply in one click — macros rescale automatically. Recent adherence also feeds back into the recovery score.

## Screenshots

| Result dashboard | Workout detail |
|---|---|
| ![Result dashboard](docs/screenshots/result-dark.png) | ![Workout plan](docs/screenshots/result-workout.png) |

| Light mode | Plan wizard | Mobile |
|---|---|---|
| ![Light mode](docs/screenshots/home-light.png) | ![Create plan](docs/screenshots/create-plan.png) | ![Mobile](docs/screenshots/home-mobile.png) |

## Tech stack

- **Next.js 14** (App Router) — static pages + one dynamic API route
- **React 18** with custom context providers for theme (dark/light) and language (EN/TR)
- **Tailwind CSS** — class-strategy dark mode, fully responsive
- **jsPDF** — client-side PDF export with an embedded Open Sans font for Turkish glyph support, lazy-loaded so it never touches the initial bundle
- **Supabase (optional)** — email/Google auth and cross-device plan sync with Row Level Security; the app is **local-first** and runs fully without it
- **Local-first storage** — versioned localStorage store behind a single seam (`utils/planStorage.js`); cloud sync mirrors mutations through a listener hook instead of replacing the storage layer

## Architecture

```
app/
  page.js               # Landing (server component + client sections)
  create-plan/          # 3-step wizard with per-step validation
  result/               # Tabbed dashboard (overview / workout / meals / coach)
  api/generate-plan/    # Validated POST endpoint → plan JSON
components/
  ui/                   # Button, Card, Input, Select, ToggleGroup, loaders
  layout/               # Navigation, providers (Theme, Language), footer
  features/             # Home sections, form steps, result views
utils/
  generateSmartPlan.js  # Rule-based plan engine (BMR → TDEE → macros → plan)
  planStrings.js        # Localized meal databases & coach advice (EN/TR)
  translations.js       # Central UI dictionary (EN/TR)
  pdf-generator.js      # Localized PDF export
  planStorage.js        # Versioned local-first plan store (the only storage seam)
  cloudSync.js          # Mirrors local mutations to Supabase for signed-in users
lib/
  supabase.js           # Client factory; cloud features auto-disable without env vars
supabase/
  schema.sql            # plans table + Row Level Security policies
```

**Design decision worth noting:** enum-like values (day names, difficulty, intensity, workout focus) are stored as English keys in the plan data and translated only at the display layer — so switching languages re-labels an existing plan without regenerating it.

## Getting started

```bash
git clone https://github.com/mehmetkeless00/fitai-ai-fitness-planner.git
cd fitai-ai-fitness-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables required — the app runs fully local-first.

### Optional: accounts & cross-device sync (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor (creates the `plans` table with owner-only Row Level Security)
3. Copy `.env.example` to `.env.local` and fill in your project URL + anon key
4. (Optional) enable the Google provider under Authentication → Providers

Signed-in users get their local plans uploaded once, then every save/rename/delete/swap is mirrored to the cloud. Signed-out users lose nothing — the UI simply hides the account features.

## Testing

```bash
npm test            # run the suite once
npm run test:watch  # watch mode
```

77 unit tests cover the plan engine (BMR/TDEE/macro math, frequency schedules, meal variety, risk flags, allergy filtering, localization fallbacks), the versioned plan store (including legacy migration and corruption recovery), the cloud sync adapter (with a stubbed Supabase client), and EN/TR dictionary parity — every key must exist in both languages or the suite fails. CI runs tests + build on every push.

## Roadmap

- [x] Bilingual UI + localized plan generation (EN/TR)
- [x] Localized PDF export with Unicode font embedding
- [x] Honest, science-based product messaging
- [x] Unit tests for the calculation engine + CI
- [x] Meal variety & swap functionality
- [x] Saved plan history (local-first, versioned storage with migration)
- [x] Authentication & cloud sync (Supabase, optional & local-first)
- [x] Progress tracking with adaptive calorie targets
- [x] Smart Coach — data-driven narrative panel synthesising weight trend, adherence, recovery, and calorie recommendation into plain-language insights
- [ ] Mobile app (Expo / React Native, sharing the plan engine)

## Known limitations

Honest notes on the current state:

- Without an account, plans live in this browser's localStorage — clearing browser data deletes them
- Cloud sync is last-write-wins with no conflict resolution (fine for a single user across devices, not for concurrent edits)
- Generated plan content (meal names, advice) stays in the language active at generation time; UI labels translate live
- Meal databases are curated but finite (4 options per meal slot per diet); the shuffle-deal selection guarantees even spread and no consecutive repeats, but a 7-day week still reuses some meals twice
- The "coach" is rule-based — advice is selected from goal-specific guidance written into the engine, not generated by an LLM

## License

[MIT](LICENSE)

## Author

**Mehmet Keleş** — Computer Engineering graduate, full-stack & AI development enthusiast

GitHub: [@mehmetkeless00](https://github.com/mehmetkeless00)

---
description: "Localization system for FitFlow (EN + TR). Invoked for any task involving text strings, translations, adding new keys, auditing for hardcoded English, or language-switching behavior."
---

# FitFlow i18n — Bilingual Localization (EN + TR)

You are the localization engineer for FitFlow. Every user-visible string must exist in both English and Turkish.

## Two i18n Layers

FitFlow has two separate string stores:

| Layer | File | Covers | Consumer |
|---|---|---|---|
| Core translations | `packages/core/src/translations.js` | Plan content, PDF labels, coach strings, result UI | Web (`useLanguage()` via LanguageProvider) and mobile (via `translations[lang]`) |
| Mobile UI strings | `apps/mobile/i18n/strings.js` | Tab names, form labels, settings, button text, error messages | Mobile only via `useLanguage()` → `t.*` |

**Never add mobile-only UI strings to `packages/core/src/translations.js`.**
**Never add plan-content strings to `apps/mobile/i18n/strings.js`.**

## Mobile String Structure (`strings.js`)

```js
const en = {
  welcome:   { headline, sub, cta, havePlan, feature1, feature2, feature3 },
  create:    { next, back, generate, ..., errors: { age, gender, height, weight, goal, experience, frequency, diet } },
  tabs:      { overview, workout, meals, progress, plans },
  overview:  { calories, protein, carbs, fat, perDay, grams, createdOn, recoveryTitle, recoveryDesc, macroBreakdown, hydration, sharePlan, shareError, noActivePlan },
  days:      { short: { Monday: 'Mon', ... } },
  workout:   { rest, sets, reps, exercises, noExercises, exerciseDetail, setsLabel, repsLabel, restLabel, intensityLabel, alternativesLabel, done, noActivePlan, exerciseNotFound },
  meals:     { breakfast, lunch, dinner, snacks, snack, kcal, alternatives, swapTitle, swapDone, noAlternatives, noActivePlan, noMealData },
  progress:  { todayCheckin, weightLabel, weightLabelLbs, weightPlaceholder, weightPlaceholderLbs, invalidWeight, invalidWeightMsgKg, invalidWeightMsgLbs, workoutsDone, save, saved, noData, trendTitle, coachTitle, adjustTitle, adjustOnTrack, adjustSuggest, adjustReduce, adjustIncrease, adjustApply, adjustDismiss, adjustApplied, adjustCooldown, trendHint },
  plans:     { title, active, activeSuffix, unnamed, newPlan, created, deleteConfirmTitle, deleteConfirmMsg, cancel, delete, rename, renamePlaceholder, renameTitle, renameSave, noPlan, longPressHint },
  settings:  { title, language, english, turkish, units, unitKg, unitLbs, notifications, notificationsDesc, cloudSync, cloudSyncDesc, comingSoon, about, version, offlineFirst, close, versionLabel, privacyPolicy, privacyPolicyDesc, terms, termsDesc, contact, contactEmail },
};
// Total: 170 keys (as of Phase 17.5) — EN and TR must match exactly
```

## LanguageContext API (Mobile)

```js
const { lang, setLang, t, units, setUnits, notifications, setNotifications } = useLanguage();

// t.welcome.headline   → 'Your personal fitness planner' (EN) | 'Kişisel fitness planlayıcın' (TR)
// units                → 'kg' | 'lbs'
// notifications        → true | false
```

Persisted keys in AsyncStorage (all preloaded in `FITFLOW_KEYS`):
- `fitflow.lang` — `'en'` | `'tr'`
- `fitflow.units` — `'kg'` | `'lbs'`
- `fitflow.notifications` — `'true'` | `'false'`

## Adding New Strings (Strict Protocol)

1. Add the key to **both** `en` and `tr` sections of `strings.js`.
2. Verify key count parity:
   ```bash
   node -e "
   const fs = require('fs');
   const src = fs.readFileSync('./apps/mobile/i18n/strings.js', 'utf8');
   const mod = {}; eval(src.replace('export const', 'mod.mobileStrings = ').replace(/export /g,''));
   function flat(o,p=''){return Object.entries(o).flatMap(([k,v])=>typeof v==='object'?flat(v,p?p+'.'+k:k):[p?p+'.'+k:k])}
   const en=flat(mod.mobileStrings.en), tr=flat(mod.mobileStrings.tr);
   console.log('EN:',en.length,'TR:',tr.length,'Match:',en.length===tr.length);
   const diff=en.filter(k=>!tr.includes(k)); if(diff.length) console.log('Only EN:',diff);
   "
   ```
3. Use the new key immediately via `t.<section>.<key>` — never leave a key unused.

## Turkish Writing Rules

- Use `ı` (dotless i) and `İ` (dotted I) correctly — they are different characters.
- Plural suffix: `lar` after back vowels (a, ı, o, u), `ler` after front vowels (e, i, ö, ü).
- "Cancel" = `İptal`, "Save" = `Kaydet`, "Delete" = `Sil`, "Done" = `Tamam`.
- Date format TR: `DD.MM.YYYY` (handled by `formatDate(str, 'tr')`).
- `snack` in meal data = `Atıştırmalık` (not `Atıştırmalıklar`).

## Hardcoded String Audit

Run this to find remaining hardcoded strings in mobile:
```bash
grep -rn "'\''[A-Z][a-z]" apps/mobile/app --include="*.js" \
  | grep -v "className\|import\|console\|//\|t\.\|pl\.\|p\.\|s\.\|c\.\|w\.\|o\.\|m\.\|POLICY\|Sunday\|Monday\|style=" \
  | head -20
```

## Error Boundary Exception

`apps/mobile/app/error.js` is intentionally bilingual inline (EN + TR hardcoded). This is correct — the error boundary renders before LanguageContext is available. Do not add `useLanguage()` to `error.js`.

## Plan Content Language

Plan content (meal names, workout descriptions, coach strings) is generated in the `lang` the user selected during plan creation (`formData.lang` in Step 3). This is stored in `plan.data.lang`. UI language (`fitflow.lang` in AsyncStorage) can differ from plan language — they are independent.

```js
const planLang = plan.data?.lang || lang;  // use plan's own language for content
const coreTr = (translations[planLang] || translations.en).coach;
```

## PDF i18n

The PDF generator (`apps/web/utils/pdf-generator.js` and mobile `utils/sharePlan.js`) uses `translations[lang].pdf.*` for labels. Turkish PDFs require the embedded OpenSans font — never use built-in jsPDF fonts for Turkish.

## Quality Checklist

- [ ] New key added to both `en` and `tr` in `strings.js`
- [ ] Key count parity check passes (both must equal N)
- [ ] Key is used via `t.<section>.<key>`, not hardcoded
- [ ] Turkish text reviewed for correct dotted/dotless i usage
- [ ] `accessibilityLabel` on any new interactive element uses i18n'd string

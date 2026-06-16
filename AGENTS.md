# FitFlow — Engineering Standards

Turborepo monorepo: `apps/web` (Next.js 14) + `apps/mobile` (Expo SDK 54) + `packages/core` (shared logic).

---

## Architecture Rules

### The Non-Negotiables

1. **All business logic lives in `packages/core`** — never duplicate plan generation, storage, or coaching logic in web or mobile.
2. **Storage is synchronous in `@fitflow/core`** — the adapter pattern (localStorage on web, in-memory cache on mobile) makes this work. Never make core storage functions async.
3. **Local-first always** — the app must work 100% offline. Cloud sync is a fire-and-forget mirror, never the source of truth.
4. **Weight stored in kg** — always. Unit conversion (lbs display) happens only in `progress.js` at the read/write boundary.
5. **`expo-haptics` never appears in `app.json` plugins** — it's a first-party Expo module, no config plugin needed.

### Monorepo Commands

```bash
npm run dev            # turbo dev (all apps)
npm run build          # turbo build (all apps)
npm test               # turbo test (all packages)

# Single workspace
npm run build --workspace=apps/web
npm test --workspace=packages/core
cd apps/mobile && npx expo start -c
```

### Adding a New Persisted Preference (Mobile)

1. Add key to `FITFLOW_KEYS` in `apps/mobile/storage/asyncAdapter.js`
2. Add state + setter to `apps/mobile/i18n/LanguageContext.js`
3. Read initial value in `apps/mobile/app/_layout.js` and pass as prop to `LanguageProvider`
4. Add EN and TR strings to `apps/mobile/i18n/strings.js`
5. Verify key parity: both EN and TR must have equal key counts

---

## Coding Standards

### JavaScript Style

- **No TypeScript in `apps/web` or `apps/mobile`** — pure JavaScript with JSDoc comments where types are non-obvious.
- **`packages/core`** — pure ESM JavaScript, zero dependencies.
- Import order: external libraries → `@fitflow/core` → local utils → local components.
- No default exports from `packages/core/src/` files — all named exports.
- Destructure at the call site: `const { lang, t } = useLanguage();`

### React Patterns

```js
// Mobile: always useFocusEffect for data refresh on tab focus
useFocusEffect(useCallback(() => {
  refreshPlan();
}, [refreshPlan]));

// Never useEffect for data that should reload on tab switch — use useFocusEffect

// LanguageContext is the single source of truth on mobile
const { lang, t, units, setUnits, notifications, setNotifications } = useLanguage();

// Date formatting — always use formatDate(), never toLocaleDateString()
formatDate(dateStr, lang)  // avoids iOS Hijri calendar bug
```

### Component Rules

- No component over ~150 lines without good reason
- Extract sub-components when a render function exceeds one screen
- `className` prop on custom components: pass through to root element
- No prop drilling past 2 levels — use context or co-locate state

### Comments

Only comment the **why**, not the **what**:
```js
// Always Gregorian — avoids the iOS Hijri calendar bug when device region is Arabic.
export function formatDate(dateStr, lang) { ... }

// Cloud mirroring must never break local persistence.
try { syncHandler(type, payload); } catch { }
```

---

## Localization Rules

**Every user-visible string must exist in both English and Turkish.**

### Mobile Strings (`apps/mobile/i18n/strings.js`)

- Current count: **170 keys**, strictly matched between `en` and `tr`
- File exports `mobileStrings = { en, tr }`
- All UI text accessed via `t.<section>.<key>` from `useLanguage()`
- **Never** use raw string literals in JSX for user-facing text

### Verify Parity After Any String Changes

```bash
node -e "
const fs = require('fs');
const src = fs.readFileSync('./apps/mobile/i18n/strings.js', 'utf8');
const mod = {};
eval(src.replace('export const', 'mod.mobileStrings = ').replace(/export /g,''));
function flat(o,p=''){return Object.entries(o).flatMap(([k,v])=>typeof v==='object'?flat(v,p?p+'.'+k:k):[p?p+'.'+k:k])}
const en=flat(mod.mobileStrings.en), tr=flat(mod.mobileStrings.tr);
const diff=en.filter(k=>!tr.includes(k));
console.log('EN:',en.length,'TR:',tr.length,'OK:',en.length===tr.length);
if(diff.length) console.log('Missing in TR:',diff);
"
```

### Turkish Writing Rules

- `ı` (dotless i) and `İ` (dotted I) are distinct characters — both required
- Date format: `DD.MM.YYYY` (handled by `formatDate(str, 'tr')`)
- `snack` meal slot = `Atıştırmalık`
- "Cancel" = `İptal`, "Done" = `Tamam`, "Save" = `Kaydet`, "Delete" = `Sil`

### Exception: Error Boundary

`apps/mobile/app/error.js` uses bilingual inline text — this is intentional. The error boundary renders before `LanguageProvider` is available. Do not add `useLanguage()` there.

---

## Accessibility Standards (WCAG 2.1 AA)

Every interactive element must have:
```jsx
accessibilityRole="button"   // or "radio", "checkbox", "switch", "tab", "header"
accessibilityLabel={t.someKey}  // i18n'd — never raw English
accessibilityState={{ checked, disabled, busy }}  // as appropriate
```

- Screen titles: `accessibilityRole="header"` on the Text component
- Minimum touch target: 44×44 pt
- All colors: every Tailwind class has a `dark:` counterpart
- Error states: `accessibilityHint` on the errored Input component

---

## Testing Requirements

### What Must Have Tests

| Code | Requirement |
|---|---|
| New `packages/core/src/*.js` function | Vitest unit test in `packages/core/__tests__/` |
| New `apps/web/utils/cloudSync.js` function | Vitest test with stub Supabase client |
| Bug fix in core | Regression test that fails before the fix |
| New string keys in `strings.js` | Verify key count parity still passes |

### What Does NOT Need Tests

- Mobile screens (`apps/mobile/app/**`) — no test infra; verified manually on device
- Web pages (`apps/web/app/**`) — verified via `next build`
- UI components (mobile and web) — test behavior through core, not UI

### Test Patterns

```js
// Always reset storage between tests
class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

beforeEach(() => { globalThis.localStorage = new MemoryStorage(); });
```

---

## Release Process

### Web (Vercel)

Push to `main` → Vercel auto-deploys. Always run `npm run build --workspace=apps/web` locally first.

### Mobile (EAS)

```bash
# TestFlight
cd apps/mobile
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

**Before every build:**
- Increment `buildNumber` in `app.json` → `"ios": { "buildNumber": "N+1" }`
- Run full test suite: `npm test`
- Verify `npm run build --workspace=apps/web` passes
- Verify EN/TR parity check passes

### Release Checklist

- [ ] All tests pass
- [ ] Web build clean
- [ ] EN/TR keys matched
- [ ] `buildNumber` incremented
- [ ] `expo-haptics` NOT in `app.json` plugins
- [ ] `ITSAppUsesNonExemptEncryption: false` in `infoPlist`
- [ ] Privacy policy URL live

---

## App Store Compliance

| Requirement | Status | Details |
|---|---|---|
| Privacy Policy URL | Live | `https://fitai-ai-fitness-planner.vercel.app/privacy` |
| `ITSAppUsesNonExemptEncryption` | `false` | In `app.json` `infoPlist` |
| Age rating | 12+ | No restricted content; age ≥ 13 enforced in create flow |
| Children's privacy | Compliant | Min age 13 during plan creation |
| Photo library usage | Declared | `NSPhotoLibraryUsageDescription` in `infoPlist` |
| Bundle ID | `com.fitflow.app` | iOS + Android |

---

## Supabase Architecture

Supabase is **optional**. App runs fully offline without env vars.

```
NEXT_PUBLIC_SUPABASE_URL=      ← optional
NEXT_PUBLIC_SUPABASE_ANON_KEY= ← optional
```

Cloud sync is a mirror, never the source of truth:
```
User action → Local storage → UI update → Cloud mirror (async, errors silent)
```

Always check `isCloudEnabled` before any Supabase call. The `syncHandler` registered via `setSyncHandler()` must never throw.

---

## Key File Reference

| File | Purpose |
|---|---|
| `packages/core/src/generateSmartPlan.js` | BMR → TDEE → macros → 7-day plan |
| `packages/core/src/planStorage.js` | Plan CRUD + sync handler hook |
| `packages/core/src/progressStorage.js` | Check-in CRUD + sync handler hook |
| `packages/core/src/translations.js` | EN/TR plan content strings |
| `apps/mobile/storage/asyncAdapter.js` | AsyncStorage ↔ synchronous core bridge |
| `apps/mobile/i18n/LanguageContext.js` | lang, units, notifications state |
| `apps/mobile/i18n/strings.js` | Mobile UI strings (170 keys EN + TR) |
| `apps/mobile/app/_layout.js` | Boot: storage init → LanguageProvider → Stack |
| `apps/mobile/utils/formatDate.js` | Gregorian date formatter (iOS Hijri fix) |
| `apps/web/lib/supabase.js` | Optional Supabase client singleton |
| `apps/web/utils/cloudSync.js` | Fire-and-forget plan/checkin mirroring |
| `apps/web/utils/pdf-generator.js` | jsPDF with embedded OpenSans for Turkish |
| `apps/mobile/eas.json` | EAS build profiles (needs appleTeamId + ascAppId) |

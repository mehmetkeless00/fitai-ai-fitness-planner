---
description: "Release management for FitFlow — TestFlight, App Store submission, Vercel deploys, EAS builds, versioning, and App Store compliance. Invoked for anything related to shipping the app."
---

# FitFlow Release Manager

You are the release engineer for FitFlow. You own the end-to-end ship process for both web (Vercel) and mobile (EAS + App Store/Play Store).

## Current Release State

| Platform | Status | Version |
|---|---|---|
| Web | Live at https://fitai-ai-fitness-planner.vercel.app/ | v1.0 |
| iOS | TestFlight-ready (needs appleTeamId + ascAppId) | v1.0 build 1 |
| Android | Configured, not yet submitted | v1.0 versionCode 1 |

## Web Deployment (Vercel)

Vercel auto-deploys on push to `main`. No manual action needed.

```bash
# Verify build passes before pushing
npm run build --workspace=apps/web

# Check current deployment
vercel --prod  # if vercel CLI installed
```

## iOS Release Pipeline

### Prerequisites Checklist

- [ ] Apple Developer Program membership ($99/yr) active
- [ ] `appleTeamId` from [developer.apple.com](https://developer.apple.com) → Membership
- [ ] App created in App Store Connect → copy numeric `ascAppId`
- [ ] Bundle ID `com.fitflow.app` registered in Apple Developer Portal
- [ ] `eas.json` filled in:
  ```json
  "ios": {
    "appleId": "mehmettkeles7@gmail.com",
    "ascAppId": "FILL_ME",
    "appleTeamId": "FILL_ME"
  }
  ```

### App Store Metadata Checklist

Required before first submission:
- [ ] App name: "FitFlow – Fitness & Nutrition" (max 30 chars)
- [ ] Subtitle: "AI Workout & Meal Planner" (max 30 chars)
- [ ] Description (EN): ≤ 4000 chars
- [ ] Description (TR): ≤ 4000 chars (App Store Connect supports localizations)
- [ ] Keywords (100 chars): `fitness,workout,nutrition,meal plan,diet,weight loss,gym,health,macro,calorie`
- [ ] Privacy Policy URL: `https://fitai-ai-fitness-planner.vercel.app/privacy`
- [ ] Support URL: `https://fitai-ai-fitness-planner.vercel.app/` or email
- [ ] Category: Health & Fitness (primary), Lifestyle (secondary)
- [ ] Age Rating: 12+ (fitness advice, no restricted content)

### Screenshot Requirements

Required device sizes (App Store Connect):
| Device | Dimensions |
|---|---|
| iPhone 6.9" (Pro Max) | 1320 × 2868 px |
| iPhone 6.5" | 1284 × 2778 px |
| iPhone 5.5" | 1242 × 2208 px |

Screens to screenshot:
1. Welcome screen (feature bullets)
2. Create plan flow (Step 1)
3. Overview tab (macros + recovery)
4. Workout tab (7-day accordion)
5. Progress tab (check-in + sparkline)

Use Expo Go on iPhone or iOS Simulator + Screenshot tool.

### Build Commands

```bash
# Log in to EAS
cd apps/mobile
npx eas login  # use mehmettkeles7@gmail.com

# Development build (simulator)
npx eas build --platform ios --profile development

# Preview build (internal testing, no App Store)
npx eas build --platform ios --profile preview

# Production build (App Store)
npx eas build --platform ios --profile production

# Submit to TestFlight
npx eas submit --platform ios --profile production

# All-in-one: build + submit
npx eas build --platform ios --profile production --auto-submit
```

### Versioning

`app.json` controls the user-visible version:
```json
"version": "1.0.0"       // shown in Settings About
"ios": { "buildNumber": "1" }   // increment for every build submitted to TestFlight
"android": { "versionCode": 1 } // increment for every Play Store build
```

After each TestFlight build, increment `buildNumber` before the next submission.

### app.json Compliance Fields

Current configuration (Phase 17.5):
```json
{
  "ios": {
    "bundleIdentifier": "com.fitflow.app",
    "buildNumber": "1",
    "infoPlist": {
      "NSPhotoLibraryUsageDescription": "FitFlow uses your photo library to let you share your plan as a PDF.",
      "ITSAppUsesNonExemptEncryption": false
    }
  }
}
```

`ITSAppUsesNonExemptEncryption: false` is required — without it Apple asks to fill out an encryption export compliance form on every build.

### TestFlight Review Process

1. Build uploaded to TestFlight
2. Beta App Review (typically 1 business day)
3. Add internal testers (up to 100 Apple IDs)
4. External testing requires completing App Store metadata

## Android Release Pipeline

```bash
# Production build
npx eas build --platform android --profile production

# Submit to Play Store
npx eas submit --platform android --profile production
```

Requires `apps/mobile/google-service-account.json` (from Google Play Console).

## Release Checklist (Every Release)

- [ ] `npm run build --workspace=apps/web` passes
- [ ] `npm test` passes
- [ ] EN/TR key parity: 170+ keys matched
- [ ] `buildNumber` (iOS) incremented
- [ ] `versionCode` (Android) incremented
- [ ] Privacy policy URL live at `/privacy`
- [ ] Changelog written
- [ ] `expo-haptics` NOT in `app.json` plugins
- [ ] `ITSAppUsesNonExemptEncryption: false` in `infoPlist`

## Rollback

Web: Vercel keeps all deployments. Use Vercel dashboard to promote a previous deployment.
Mobile: Cannot recall TestFlight builds. Submit a new build with the fix.

## EAS Configuration Reference

```json
// eas.json
{
  "cli": { "version": ">= 14.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "ios": { "simulator": false } },
    "production": { "autoIncrement": true }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "mehmettkeles7@gmail.com",
        "ascAppId": "",        ← fill from App Store Connect
        "appleTeamId": ""     ← fill from developer.apple.com
      }
    }
  }
}
```

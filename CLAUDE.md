@AGENTS.md

# FitFlow — Claude Code Instructions

This is the root CLAUDE.md for the FitFlow monorepo. The AGENTS.md file above contains all engineering standards.

## Skill System

Skills live in `.claude/skills/`. Invoke the right skill for every task:

| Task type | Skill to use |
|---|---|
| Architecture decisions, cross-cutting concerns | `fitflow-cto` |
| Web (Next.js, web components, Tailwind web) | `fitflow-frontend` |
| Design system, dark mode, accessibility | `fitflow-ui-ux` |
| Translations, EN/TR strings, i18n audit | `fitflow-i18n` |
| Mobile screens, Expo, NativeWind, haptics | `fitflow-react-native` |
| Bundle size, FlatList, startup time | `fitflow-performance` |
| Vitest tests, coverage, test patterns | `fitflow-testing` |
| Supabase, cloud sync, auth, RLS | `fitflow-supabase` |
| EAS builds, TestFlight, App Store | `fitflow-release-manager` |
| Roadmap, feature prioritization, launch | `fitflow-product-manager` |

## Expo SDK Note

The mobile app targets **Expo SDK 54** with **expo-router 6.x**. Read https://docs.expo.dev/versions/v54.0.0/ before writing any Expo API code — the SDK changes every release.

## Quick Facts

- Privacy policy: `https://fitai-ai-fitness-planner.vercel.app/privacy`
- Bundle ID: `com.fitflow.app`
- Contact: `support@fitflow.app`
- Developer Apple ID: `mehmettkeles7@gmail.com`
- Mobile i18n: 170 EN + TR keys (must stay equal)
- Weight storage: always kg; lbs is display-only

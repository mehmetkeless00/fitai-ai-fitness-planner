# FitAI Quick Reference Guide

**Last Updated:** June 7, 2026

---

## Quick Start (5 minutes)

```bash
# 1. Clone & setup
git clone https://github.com/mehmetkeless00/fitai-ai-fitness-planner.git
cd fitai-ai-fitness-planner

# 2. Install dependencies
npm install

# 3. Configure environment
# Create .env.local with OPENAI_API_KEY

# 4. Start development
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## Project Structure at a Glance

```
/app                    → Pages (home, create-plan, result, api)
/components/ui          → Reusable UI components (Button, Input, Card, etc.)
/components/features    → Feature-specific components (form, results, home)
/components/layout      → Layout components (Navigation, Container, Header)
/utils                  → Utility functions (plan generation, PDF, exercises)
/public                 → Static assets (empty for now)
```

---

## Key Technologies

| Tech | Purpose | Version |
|------|---------|---------|
| Next.js | Full-stack React framework | 14.2.3 |
| React | UI library | 18.3.1 |
| Tailwind CSS | Styling | 3.4.1 |
| jsPDF | PDF generation | 4.2.1 |
| OpenAI | AI (Phase 2) | 6.38.0 |

---

## Main Features

| Feature | Status | Files |
|---------|--------|-------|
| Home Page | ✅ Complete | app/page.js, Hero.js, Features.js |
| Create Plan Form | ✅ Complete | app/create-plan/page.js, FormStepper.js |
| Result Page | ✅ Complete | app/result/page.js, NutritionSummary.js, WorkoutPlan.js, MealPlan.js |
| PDF Export | ✅ Complete | pdf-generator.js |
| Dark/Light Mode | ✅ Complete | layout.js, globals.css |
| Mobile Responsive | ✅ Complete | All components |
| Exercise Demos | ✅ Complete | ExerciseDemo.js, exerciseMediaMap.js |
| Plan Generation | ✅ Complete (Rule-based) | generateSmartPlan.js |

---

## Current Deployment

- **Repository:** GitHub (main branch)
- **Deployment:** Vercel (auto-deploy on push)
- **Environment:** .env.local (OPENAI_API_KEY)

---

## Common Tasks

### Add a New Component

```javascript
// /components/ui/NewComponent.js
'use client';

export default function NewComponent({ prop1, prop2 }) {
  return (
    <div className="...">
      {/* Component code */}
    </div>
  );
}
```

### Add a New Page

```javascript
// /app/newpage/page.js
'use client';

import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';

export default function NewPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 md:pb-20">
        <Container>
          {/* Page content */}
        </Container>
      </main>
    </>
  );
}
```

### Add a New API Route

```javascript
// /app/api/endpoint/route.js
export async function POST(request) {
  try {
    const data = await request.json();
    // Process data
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### Responsive Tailwind Pattern

```jsx
// Mobile-first: default applies to mobile, breakpoints override
<div className="
  text-sm sm:text-base md:text-lg      // Text size scaling
  px-3 sm:px-6 lg:px-8                 // Padding scaling
  py-12 md:py-20 lg:py-24              // Vertical spacing
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Grid columns
  gap-3 md:gap-4 lg:gap-6              // Gap scaling
">
  {/* Content */}
</div>
```

### Dark Mode Implementation

```jsx
// Automatically supported in Tailwind with dark: prefix
<div className="
  bg-white dark:bg-dark-surface        // Background
  text-slate-900 dark:text-white       // Text
  border border-slate-200 dark:border-dark-border  // Borders
">
  {/* Content works in both themes */}
</div>
```

---

## Testing Checklist

After making changes:

- [ ] Run `npm run build` (no errors?)
- [ ] Run `npm run dev` (starts without errors?)
- [ ] Test on mobile (iPhone 375px)
- [ ] Test on tablet (iPad 768px)
- [ ] Test on desktop (1024px+)
- [ ] Test dark mode toggle
- [ ] Test light mode
- [ ] Check console for errors
- [ ] Test form validation
- [ ] Test PDF export
- [ ] Manual user flow test (create plan → generate → view result → export)

---

## Performance Tips

- Use `next/image` for images (not yet implemented)
- Lazy load components when possible
- Keep component files < 300 lines
- Cache expensive calculations
- Use `useMemo` for expensive renders
- Monitor bundle size with `npm run build`

---

## Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('theme')
localStorage.getItem('userPlan')
```

### Check API responses
```bash
# Make POST request to /api/generate-plan
curl -X POST http://localhost:3000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"age":"25","gender":"male",...}'
```

### Enable Next.js debug logs
```bash
DEBUG=* npm run dev
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` again |
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Tailwind classes not applying | Restart dev server, check content paths in tailwind.config.js |
| localStorage undefined | Check `mounted` state before accessing localStorage |
| Dark mode not persisting | Check ThemeContext provider in layout.js |
| Build fails with syntax error | Check for mismatched braces/quotes in JSX |

---

## Code Style Guidelines

### Naming Conventions
- Components: PascalCase (`MyComponent.js`)
- Utilities: camelCase (`generatePlan.js`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`)
- CSS classes: kebab-case (Tailwind default)

### Component Structure
```javascript
'use client';  // Always add for interactive components

import { useState } from 'react';
import SomeComponent from '@/components/...';

export default function MyComponent({ prop1, prop2 = 'default' }) {
  // 1. State management
  const [state, setState] = useState(null);
  
  // 2. Effects
  // useEffect(...) if needed
  
  // 3. Event handlers
  const handleClick = () => { ... };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Comments
```javascript
// Single line comments for quick notes
// Describe WHY, not WHAT

/*
 * Multi-line comments for important context
 * Used for complex logic or critical sections
 */
```

---

## Deployment Checklist

Before pushing to main:

- [ ] Code follows style guidelines
- [ ] All features tested locally
- [ ] No console errors
- [ ] No console warnings
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set (.env.local)
- [ ] Git commit message is descriptive
- [ ] No sensitive data in code

### Deploy Process
```bash
git add .
git commit -m "[Feature]: Description of changes"
git push origin main
# Vercel auto-deploys (1-2 minutes)
# Check deployment status at vercel.com
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [jsPDF Docs](https://github.com/parallax/jsPDF)

### Learning
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [React Hooks](https://react.dev/reference/react/hooks)

### Tools
- [VS Code](https://code.visualstudio.com/) (recommended editor)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [ES7+ React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

---

## Contact

- **Issues:** Create GitHub issue
- **Questions:** Check PROJECT_SUMMARY.md for details
- **Deploy Issues:** Check Vercel dashboard

---

**Remember:** Always test locally before pushing. Mobile responsiveness is critical!

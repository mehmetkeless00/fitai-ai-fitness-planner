# Developer Onboarding Checklist

**Before Starting Work on FitFlow**

---

## Phase 1: Environment Setup (15 minutes)

- [ ] Clone repository: `git clone https://github.com/mehmetkeless00/fitai-ai-fitness-planner.git`
- [ ] Navigate to directory: `cd fitai-ai-fitness-planner`
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file (ask for OPENAI_API_KEY)
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Verify home page loads without errors
- [ ] Check browser console for any warnings/errors

---

## Phase 2: Understanding the Project (30 minutes)

### Read Documentation
- [ ] Read `README.md` (project overview)
- [ ] Read `PROJECT_SUMMARY.md` (complete technical overview) ← **START HERE**
- [ ] Read `QUICK_REFERENCE.md` (developer shortcuts)
- [ ] Skim `package.json` (dependencies)

### Explore Codebase Structure
- [ ] Open `/app/page.js` (home page)
- [ ] Open `/app/create-plan/page.js` (form page)
- [ ] Open `/app/result/page.js` (results page)
- [ ] Open `/components/layout/Navigation.js` (header)
- [ ] Open `/utils/generateSmartPlan.js` (core algorithm)
- [ ] Understand folder structure: `/components/ui/`, `/components/features/`, `/components/layout/`

### Verify Everything Works
- [ ] Test home page (click links, check dark/light toggle)
- [ ] Test create plan form (fill form, submit, see results)
- [ ] Test result page tabs (navigate between tabs)
- [ ] Test PDF export (generate PDF, download)
- [ ] Test dark mode toggle (verify theme persists on reload)
- [ ] Test on mobile viewport (375px) using browser DevTools

---

## Phase 3: Git Workflow (10 minutes)

- [ ] Check current branch: `git branch` (should be `main`)
- [ ] View recent commits: `git log --oneline -10`
- [ ] Understand commit style (descriptive messages)
- [ ] Set up git user info if not already done:
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  ```
- [ ] Verify you can push: `git remote -v`

---

## Phase 4: Code Quality Checks (10 minutes)

- [ ] Run build: `npm run build`
  - [ ] Verify: "✓ Compiled successfully"
  - [ ] Verify: No errors in output
  - [ ] Verify: All routes generated
  
- [ ] Start dev server again: `npm run dev`
  - [ ] Verify: No console errors
  - [ ] Verify: Page loads instantly
  - [ ] Verify: Hot reload works (edit a file, page updates)

---

## Phase 5: Understand Key Concepts (20 minutes)

### Theme System
- [ ] Open `app/layout.js`
- [ ] Understand: ThemeContext, localStorage usage
- [ ] Find: How dark/light classes are applied to `<html>`
- [ ] Test: Toggle theme, refresh page, verify it persists

### Responsive Design
- [ ] Open `components/features/home/Hero.js`
- [ ] Find: `text-3xl sm:text-5xl md:text-7xl` pattern
- [ ] Understand: Mobile-first approach (default = mobile, then breakpoints)
- [ ] Test: Resize browser, watch text size change

### Component Architecture
- [ ] Open `/components/ui/Button.js`
- [ ] Understand: Props, variants, sizes, composition
- [ ] Find: How it's exported and imported in other files
- [ ] Note: Similar pattern used in all UI components

### Form Handling
- [ ] Open `/components/features/form/FormStepper.js`
- [ ] Understand: Multi-step form flow, state management
- [ ] Find: How data flows from step 1 → 2 → 3 → API
- [ ] Note: Form validation happens in each step

### Plan Generation
- [ ] Open `/utils/generateSmartPlan.js`
- [ ] Skim: Core algorithm (BMR, TDEE, macros calculations)
- [ ] Understand: Input (user profile) → Output (complete plan)
- [ ] Note: This is what will be replaced with OpenAI in Phase 2

---

## Phase 6: First Task - Make a Small Change (20 minutes)

**Goal:** Verify you can make, test, and push a change

### Task: Update Footer Text
1. [ ] Open `app/page.js`
2. [ ] Find: Footer section with "© 2024 FitFlow..."
3. [ ] Change text to: "© 2026 FitFlow. All rights reserved. Built with 💪 and ❤️"
4. [ ] Save file
5. [ ] Verify: Page refreshes in browser (hot reload)
6. [ ] Verify: Change appears on home page

### Commit and Push
```bash
# 1. Check what changed
git status

# 2. Add changes
git add app/page.js

# 3. Commit with descriptive message
git commit -m "[Docs]: Update footer year to 2026"

# 4. Push to main
git push origin main
```

- [ ] Commit successful
- [ ] Push successful
- [ ] No merge conflicts
- [ ] Check GitHub to verify commit appears

---

## Phase 7: Environment Verification (10 minutes)

- [ ] OPENAI_API_KEY in `.env.local` ✓
- [ ] Node.js version 16+ installed: `node --version`
- [ ] npm version 7+ installed: `npm --version`
- [ ] GitHub SSH keys configured (if pushing via SSH)
- [ ] Vercel account access (if deploying)

---

## Phase 8: Questions to Ask (Before Starting Real Work)

- [ ] What's the priority for my first task?
- [ ] Should I work on Phase 2 (AI integration)?
- [ ] Are there any known issues to fix?
- [ ] What's the timeline for next release?
- [ ] Who should I ask for design/UX decisions?
- [ ] How frequently should I commit/push?
- [ ] Are there any code review requirements?

---

## Phase 9: Recommended First Real Tasks (Pick One)

### Option A: Add Real AI Plan Generation ⭐ (HIGH IMPACT)
- Duration: 2-3 days
- Impact: Huge user value improvement
- Effort: Medium
- See: `PROJECT_SUMMARY.md` Phase 2 section

### Option B: Add TypeScript Support
- Duration: 2-3 days
- Impact: Better code quality, fewer bugs
- Effort: Medium-High
- Start: Add `tsconfig.json`, convert one component at a time

### Option C: Add Unit Tests
- Duration: 3-4 days
- Impact: Prevent regressions, faster development
- Effort: Medium
- Start: Set up Jest, write tests for `generateSmartPlan.js`

### Option D: Fix Known Limitations
- Duration: 1-2 days each
- Impact: Incremental improvements
- Effort: Low-Medium
- Examples: Add more exercises, improve meal variety, better error messages

### Option E: Add SEO Optimization
- Duration: 1-2 days
- Impact: Better search visibility
- Effort: Low
- Tasks: Meta tags, structured data, sitemap

---

## Phase 10: Daily Workflow Template

When you sit down to work:

```bash
# 1. Start day
git pull origin main  # Get latest changes

# 2. Create feature branch (if needed)
git checkout -b feature/your-feature-name

# 3. Start dev server
npm run dev

# 4. Make changes
# Edit files, test in browser

# 5. Before committing
npm run build  # Verify no build errors

# 6. Commit your work
git add .
git commit -m "[Type]: Description"
git push origin feature/your-feature-name

# 7. Create Pull Request on GitHub (if team workflow)
# OR push directly to main if solo development
```

---

## Phase 11: Debugging Guide

### When Something Breaks

**Problem: Changes not appearing in browser**
- [ ] Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- [ ] Restart dev server: `npm run dev`
- [ ] Check for syntax errors: Look at terminal output

**Problem: `npm run build` fails**
- [ ] Read error message carefully (usually at bottom)
- [ ] Check for typos in component names
- [ ] Verify all imports have correct paths
- [ ] Check for missing closing braces/parentheses

**Problem: Theme not persisting**
- [ ] Check `.env.local` has OPENAI_API_KEY
- [ ] Verify localStorage is not disabled in browser
- [ ] Check DevTools → Application → Local Storage

**Problem: API returns error**
- [ ] Check `.env.local` has OPENAI_API_KEY (even if not used yet)
- [ ] Check browser DevTools → Network tab
- [ ] Check terminal output for error logs
- [ ] Verify form data is complete and valid

---

## Phase 12: Next Steps After Onboarding

1. **Pick a task** from Phase 9
2. **Read relevant code** related to that task
3. **Make changes** incrementally (small commits)
4. **Test thoroughly** (mobile, desktop, dark/light mode)
5. **Commit and push** with descriptive message
6. **Request review** if team workflow
7. **Deploy** when approved
8. **Communicate** what you changed

---

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Git
git status               # See changed files
git diff                 # See exact changes
git log --oneline        # See recent commits
git pull origin main     # Get latest code
git push origin main     # Push to GitHub

# Debugging
npm run build 2>&1 | tail -20  # See last 20 lines of build output
```

---

## Troubleshooting Checklist

If you get stuck:

- [ ] Re-read the error message (really carefully!)
- [ ] Check `PROJECT_SUMMARY.md` for similar issues
- [ ] Check `QUICK_REFERENCE.md` for solutions
- [ ] Google the error message
- [ ] Ask a teammate
- [ ] Reset everything: 
  ```bash
  git status
  git stash  # Save your changes temporarily
  npm install
  npm run dev
  ```

---

## Final Verification

Before considering onboarding complete:

- [ ] Can start dev server without errors
- [ ] Can navigate all pages without errors
- [ ] Understand theme system (dark/light)
- [ ] Understand responsive design
- [ ] Made and pushed a test commit
- [ ] Can read and understand `generateSmartPlan.js`
- [ ] Know where to find documentation
- [ ] Know how to debug and troubleshoot
- [ ] Have asked any clarifying questions
- [ ] Ready to pick your first real task

---

## Success Criteria ✅

You're ready to start development when:

✅ Dev server runs without errors
✅ All pages load and work
✅ You've made and pushed a commit
✅ You understand the codebase structure
✅ You know the next task to work on
✅ You can debug basic issues
✅ You've read all documentation

---

**Estimated Time:** 2-3 hours for complete onboarding

**Questions?** Check `PROJECT_SUMMARY.md` or contact the team.

**Good luck! 🚀**

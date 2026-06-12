import { describe, it, expect } from 'vitest';
import { generateSmartPlan } from '../utils/generateSmartPlan.js';
import { getPlanStrings } from '../utils/planStrings.js';

const baseProfile = {
  age: 30,
  gender: 'male',
  height: 180,
  weight: 80,
  fitnessGoal: 'general-fitness',
  experience: 'beginner',
  frequency: 3,
  dietaryPreference: 'omnivore',
  allergies: '',
  lang: 'en',
};

const makePlan = (overrides = {}) => generateSmartPlan({ ...baseProfile, ...overrides });

describe('BMR calculation (Mifflin-St Jeor)', () => {
  it('computes male BMR: 10w + 6.25h - 5a + 5', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(makePlan()._metadata.bmr).toBe(1780);
  });

  it('computes female BMR: 10w + 6.25h - 5a - 161', () => {
    // 10*60 + 6.25*165 - 5*30 - 161 = 1320.25 -> rounded
    const plan = makePlan({ gender: 'female', height: 165, weight: 60 });
    expect(plan._metadata.bmr).toBe(1320);
  });
});

describe('TDEE and goal-adjusted calories', () => {
  it('applies the 1.55 activity factor for 4 days/week', () => {
    const plan = makePlan({ frequency: 4 });
    expect(plan._metadata.tdee).toBe(Math.round(1780 * 1.55));
  });

  it('adds a 400 kcal surplus for muscle building', () => {
    const plan = makePlan({ frequency: 4, fitnessGoal: 'build-muscle' });
    expect(plan.dailyCalories).toBe(plan._metadata.tdee + 400);
  });

  it('subtracts a 400 kcal deficit for weight loss', () => {
    const plan = makePlan({ frequency: 4, fitnessGoal: 'lose-weight' });
    expect(plan.dailyCalories).toBe(plan._metadata.tdee - 400);
  });

  it('uses maintenance calories for general fitness', () => {
    const plan = makePlan();
    expect(plan.dailyCalories).toBe(plan._metadata.tdee);
  });
});

describe('Macro split', () => {
  it.each(['build-muscle', 'lose-weight', 'endurance', 'general-fitness'])(
    'macro calories sum to ~daily calories for %s',
    (goal) => {
      const plan = makePlan({ fitnessGoal: goal });
      const macroCalories =
        plan.macros.protein.grams * 4 + plan.macros.carbs.grams * 4 + plan.macros.fat.grams * 9;
      const drift = Math.abs(macroCalories - plan.dailyCalories) / plan.dailyCalories;
      expect(drift).toBeLessThan(0.03);
    }
  );

  it('macro percentages sum to ~100', () => {
    const { macros } = makePlan({ fitnessGoal: 'build-muscle' });
    const total = macros.protein.percentage + macros.carbs.percentage + macros.fat.percentage;
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it('uses a high-protein split for weight loss', () => {
    const { macros } = makePlan({ fitnessGoal: 'lose-weight' });
    expect(macros.protein.percentage).toBeGreaterThanOrEqual(35);
  });
});

describe('Workout plan frequency honesty', () => {
  it('3 days/week: 3 training days + active recovery', () => {
    const { workoutPlan } = makePlan({ frequency: 3 });
    expect(workoutPlan).toHaveLength(4);
    expect(workoutPlan.map((d) => d.day)).toEqual(['Monday', 'Wednesday', 'Friday', 'Sunday']);
  });

  it('4 days/week: includes the Shoulders & Arms day (regression: day 4 was missing)', () => {
    const { workoutPlan } = makePlan({ frequency: 4 });
    const trainingDays = workoutPlan.filter((d) => d.exercises.length > 0);
    expect(trainingDays).toHaveLength(4);
    expect(workoutPlan.find((d) => d.day === 'Friday')?.focus).toBe('Shoulders & Arms');
  });

  it('6 days/week: Saturday is a real conditioning session (regression: fell back to 3-day plan)', () => {
    const { workoutPlan } = makePlan({ frequency: 6 });
    const saturday = workoutPlan.find((d) => d.day === 'Saturday');
    expect(saturday.focus).toBe('Steady-State Cardio');
    expect(saturday.exercises.length).toBeGreaterThan(0);
    expect(workoutPlan.find((d) => d.day === 'Sunday').exercises).toHaveLength(0);
  });

  it('7 days/week: Sunday becomes active recovery with a session', () => {
    const { workoutPlan } = makePlan({ frequency: 7 });
    const sunday = workoutPlan.find((d) => d.day === 'Sunday');
    expect(sunday.focus).toBe('Active Recovery');
    expect(sunday.exercises).toHaveLength(1);
  });

  it.each(['beginner', 'intermediate', 'advanced', 'elite'])(
    'every experience level gets the full schedule at 6 days/week (%s)',
    (experience) => {
      const { workoutPlan } = makePlan({ frequency: 6, experience });
      expect(workoutPlan).toHaveLength(7);
    }
  );

  it('endurance and flexibility goals produce plans without crashing', () => {
    expect(makePlan({ fitnessGoal: 'endurance', frequency: 5 }).workoutPlan.length).toBeGreaterThan(0);
    // Flexibility currently caps at 4 sessions regardless of frequency (documented behavior)
    expect(makePlan({ fitnessGoal: 'flexibility', frequency: 7 }).workoutPlan).toHaveLength(4);
  });
});

describe('Risk flags', () => {
  it('flags sustainable plans positively', () => {
    const { riskFlags } = makePlan();
    expect(riskFlags).toEqual(['✅ Plan looks sustainable!']);
  });

  it('warns young lifters training at high frequency', () => {
    const { riskFlags } = makePlan({ age: 16, frequency: 5 });
    expect(riskFlags.some((f) => f.includes('Young age'))).toBe(true);
  });

  it('warns about burnout when high frequency meets aggressive calories', () => {
    const { riskFlags } = makePlan({ fitnessGoal: 'lose-weight', frequency: 6 });
    expect(riskFlags.some((f) => f.includes('burnout'))).toBe(true);
  });
});

describe('Recovery score', () => {
  it('stays within the 20-100 range across extreme profiles', () => {
    for (const overrides of [
      {},
      { age: 17, frequency: 7, fitnessGoal: 'lose-weight' },
      { age: 65, frequency: 7, fitnessGoal: 'lose-weight' },
      { age: 18, frequency: 3, fitnessGoal: 'general-fitness' },
    ]) {
      const { recoveryScore } = makePlan(overrides);
      expect(recoveryScore).toBeGreaterThanOrEqual(20);
      expect(recoveryScore).toBeLessThanOrEqual(100);
    }
  });
});

describe('Allergy filtering', () => {
  it('excludes meals containing the allergen in name or description', () => {
    const { mealPlan } = makePlan({ allergies: 'chicken' });
    for (const day of mealPlan) {
      for (const meal of Object.values(day.meals)) {
        expect(meal.name.toLowerCase()).not.toContain('chicken');
        expect((meal.description || '').toLowerCase()).not.toContain('chicken');
      }
    }
  });

  it('falls back to an honest placeholder when every option is filtered out', () => {
    // Vowels match every meal name/description, so all options are excluded
    const { mealPlan } = makePlan({ allergies: 'a, e, i, o, u' });
    const breakfast = mealPlan[0].meals.breakfast;
    expect(breakfast.name).toBe(getPlanStrings('en').fallbackMeal.name);
    expect(breakfast.macros.protein).toBeGreaterThan(0);
  });
});

describe('Localization', () => {
  it('serves Turkish meals and advice when lang=tr', () => {
    const plan = makePlan({ lang: 'tr', dietaryPreference: 'vegan' });
    const trStrings = getPlanStrings('tr');
    const trBreakfastNames = trStrings.meals.vegan.breakfast.map((m) => m.name);
    expect(trBreakfastNames).toContain(plan.mealPlan[0].meals.breakfast.name);

    const allTrAdvice = Object.values(trStrings.advice).flat();
    expect(allTrAdvice).toContain(plan.advice);
  });

  it('falls back to English for unknown languages', () => {
    const plan = makePlan({ lang: 'de' });
    const allEnAdvice = Object.values(getPlanStrings('en').advice).flat();
    expect(allEnAdvice).toContain(plan.advice);
  });
});

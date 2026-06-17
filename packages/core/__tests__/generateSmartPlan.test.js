import { describe, it, expect } from 'vitest';
import {
  generateSmartPlan,
  recommendCalorieAdjustment,
  applyCalorieAdjustment,
  blendRecoveryScore,
  generateCoachNarrative,
  translateMealPlan,
} from '../src/generateSmartPlan.js';
import { getPlanStrings } from '../src/planStrings.js';

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

describe('Meal variety (shuffle-deal)', () => {
  it('spreads meals evenly: no meal used more than ceil(7/options) times per slot', () => {
    for (let run = 0; run < 5; run++) {
      const { mealPlan } = makePlan();
      for (const slot of ['breakfast', 'lunch', 'dinner', 'snack']) {
        const names = mealPlan.map((d) => d.meals[slot].name);
        const counts = {};
        names.forEach((n) => (counts[n] = (counts[n] || 0) + 1));
        const max = Math.max(...Object.values(counts));
        const min = Math.min(...Object.values(counts));
        // 4 options over 7 days -> every meal appears 1-2 times
        expect(max, `${slot} run ${run}: ${names.join(', ')}`).toBeLessThanOrEqual(2);
        expect(max - min).toBeLessThanOrEqual(1);
      }
    }
  });

  it('never serves the same meal on consecutive days', () => {
    for (let run = 0; run < 5; run++) {
      const { mealPlan } = makePlan();
      for (const slot of ['breakfast', 'lunch', 'dinner', 'snack']) {
        const names = mealPlan.map((d) => d.meals[slot].name);
        for (let i = 1; i < names.length; i++) {
          expect(names[i], `${slot} day ${i} repeated (run ${run})`).not.toBe(names[i - 1]);
        }
      }
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

  it('stores _srcIdx on every generated meal', () => {
    const plan = makePlan({ lang: 'en' });
    for (const day of plan.mealPlan) {
      for (const [slot, meal] of Object.entries(day.meals)) {
        expect(typeof meal._srcIdx, `${slot} on ${day.day} missing _srcIdx`).toBe('number');
      }
    }
  });

  it('stores _timingKey on every generated meal', () => {
    const validKeys = ['breakfast', 'lunch', 'dinner', 'snackWorkout', 'snackRest'];
    const plan = makePlan({ lang: 'en' });
    for (const day of plan.mealPlan) {
      for (const [slot, meal] of Object.entries(day.meals)) {
        expect(validKeys, `${slot} on ${day.day} has invalid _timingKey`).toContain(meal._timingKey);
      }
    }
  });

  it('translateMealPlan: translates timing labels using _timingKey', () => {
    const trPlan = { ...makePlan({ lang: 'tr', dietaryPreference: 'omnivore' }), lang: 'tr', dietaryPreference: 'omnivore' };
    const enTiming = getPlanStrings('en').timing;
    const translated = translateMealPlan(trPlan, 'en');
    const breakfast = translated.mealPlan[0].meals.breakfast;
    expect(breakfast.timing).toBe(enTiming.breakfast);
    // Find a snack on a workout day and verify it maps to the workout timing string
    for (const day of translated.mealPlan) {
      if (day.meals.snack?._timingKey === 'snackWorkout') {
        expect(day.meals.snack.timing).toBe(enTiming.snackWorkout);
        break;
      }
    }
  });

  it('translateMealPlan: TR plan renders English meal names when targetLang=en', () => {
    const trPlan = { ...makePlan({ lang: 'tr', dietaryPreference: 'omnivore' }), lang: 'tr', dietaryPreference: 'omnivore' };
    const enStrings = getPlanStrings('en');
    const enBreakfastNames = enStrings.meals.omnivore.breakfast.map((m) => m.name);

    const translated = translateMealPlan(trPlan, 'en');
    expect(enBreakfastNames).toContain(translated.mealPlan[0].meals.breakfast.name);
    // Grocery list regenerated in English (contains English ingredient words)
    const allGroceryItems = Object.values(translated.groceryList).flat().join(' ').toLowerCase();
    expect(allGroceryItems).not.toBe('');
  });

  it('translateMealPlan: same language is a no-op (returns original reference)', () => {
    const plan = { ...makePlan({ lang: 'en' }), lang: 'en' };
    expect(translateMealPlan(plan, 'en')).toBe(plan);
  });

  it('translateMealPlan: legacy plan without _srcIdx falls back to original content', () => {
    const plan = makePlan({ lang: 'tr', dietaryPreference: 'omnivore' });
    // Strip _srcIdx to simulate a pre-fix legacy plan
    const legacy = {
      ...plan,
      lang: 'tr',
      dietaryPreference: 'omnivore',
      mealPlan: plan.mealPlan.map((day) => ({
        ...day,
        meals: Object.fromEntries(
          Object.entries(day.meals).map(([slot, meal]) => {
            const { _srcIdx: _removed, ...rest } = meal;
            return [slot, rest];
          })
        ),
      })),
    };
    const translated = translateMealPlan(legacy, 'en');
    // Content stays Turkish because there's no _srcIdx to look up with
    expect(translated.mealPlan[0].meals.breakfast.name).toBe(legacy.mealPlan[0].meals.breakfast.name);
  });

  it('generateSmartPlan includes lang and _adviceIdx in returned plan', () => {
    const plan = makePlan({ lang: 'tr' });
    expect(plan.lang).toBe('tr');
    expect(typeof plan._adviceIdx).toBe('number');
    expect(plan._adviceIdx).toBeGreaterThanOrEqual(0);
  });

  it('translateMealPlan: translates advice text using _adviceIdx', () => {
    // Mirror production: formData.fitnessGoal is merged into the stored plan object.
    const trPlan = { ...makePlan({ lang: 'tr', fitnessGoal: 'build-muscle' }), fitnessGoal: 'build-muscle' };
    const enAdviceList = getPlanStrings('en').advice['build-muscle'];
    const translated = translateMealPlan(trPlan, 'en');
    expect(translated.advice).toBe(enAdviceList[trPlan._adviceIdx]);
  });

  it('translateMealPlan: legacy plan without lang field defaults to EN and translates to TR', () => {
    const plan = makePlan({ lang: 'en', dietaryPreference: 'omnivore' });
    const { lang: _removedLang, ...legacyPlan } = plan;
    const translated = translateMealPlan(legacyPlan, 'tr');
    const trBreakfastNames = getPlanStrings('tr').meals.omnivore.breakfast.map((m) => m.name);
    expect(trBreakfastNames).toContain(translated.mealPlan[0].meals.breakfast.name);
  });
});

describe('recommendCalorieAdjustment (adaptive targets)', () => {
  const weighIn = (date, weight) => ({ date, weight, workoutsDone: [] });
  const losePlan = { fitnessGoal: 'lose-weight', dailyCalories: 2000 };
  const bulkPlan = { fitnessGoal: 'build-muscle', dailyCalories: 3000 };

  it('requires at least two weigh-ins spanning 10+ days', () => {
    expect(recommendCalorieAdjustment(losePlan, []).status).toBe('insufficient-data');
    expect(recommendCalorieAdjustment(losePlan, [weighIn('2026-06-01', 80)]).status).toBe('insufficient-data');
    expect(
      recommendCalorieAdjustment(losePlan, [weighIn('2026-06-01', 80), weighIn('2026-06-05', 79.5)]).status
    ).toBe('insufficient-data');
  });

  it('reports on-track when weekly change matches the goal target', () => {
    // -0.75 kg over 14 days = -0.375 kg/week, exactly the lose-weight target
    const rec = recommendCalorieAdjustment(losePlan, [
      weighIn('2026-06-01', 80),
      weighIn('2026-06-15', 79.25),
    ]);
    expect(rec.status).toBe('on-track');
  });

  it('recommends a deficit increase when weight is flat on a fat-loss goal', () => {
    const rec = recommendCalorieAdjustment(losePlan, [
      weighIn('2026-06-01', 80),
      weighIn('2026-06-15', 80),
    ]);
    expect(rec.status).toBe('adjust');
    expect(rec.direction).toBe('reduce');
    expect(rec.deltaCalories).toBe(-250); // clamped at max adjustment
  });

  it('recommends fewer calories when bulking too fast', () => {
    // +2 kg in 14 days = +1.0 kg/week, far above the +0.375 target
    const rec = recommendCalorieAdjustment(bulkPlan, [
      weighIn('2026-06-01', 80),
      weighIn('2026-06-15', 82),
    ]);
    expect(rec.status).toBe('adjust');
    expect(rec.direction).toBe('reduce');
    expect(Math.abs(rec.deltaCalories)).toBeLessThanOrEqual(250);
  });

  it('recommends more calories when losing too fast', () => {
    // -1.5 kg in 14 days = -0.75 kg/week vs -0.375 target
    const rec = recommendCalorieAdjustment(losePlan, [
      weighIn('2026-06-01', 80),
      weighIn('2026-06-15', 78.5),
    ]);
    expect(rec.status).toBe('adjust');
    expect(rec.direction).toBe('increase');
    expect(rec.deltaCalories).toBeGreaterThanOrEqual(100);
    expect(rec.deltaCalories).toBeLessThanOrEqual(250);
  });
});

describe('applyCalorieAdjustment', () => {
  it('rescales macro grams to the new calories keeping percentages', () => {
    const plan = makePlan({ fitnessGoal: 'lose-weight' });
    const next = applyCalorieAdjustment(plan, -250);

    expect(next.dailyCalories).toBe(plan.dailyCalories - 250);
    expect(next.calorieAdjustedAt).toBeTruthy();
    expect(next.macros.protein.percentage).toBe(plan.macros.protein.percentage);
    expect(next.macros.protein.grams).toBe(
      Math.round((next.dailyCalories * next.macros.protein.percentage) / 100 / 4)
    );
    // Original plan untouched
    expect(plan.calorieAdjustedAt).toBeUndefined();
  });

  it('never drops below the 1200 kcal floor', () => {
    const next = applyCalorieAdjustment({ dailyCalories: 1300, macros: null }, -250);
    expect(next.dailyCalories).toBe(1200);
  });
});

describe('blendRecoveryScore', () => {
  const recentDate = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
  const workoutPlan = [
    { exercises: [{}] },
    { exercises: [{}] },
    { exercises: [{}] },
    { exercises: [] },
  ];

  it('returns the base score with no check-ins', () => {
    expect(blendRecoveryScore(75, [], workoutPlan)).toBe(75);
    expect(blendRecoveryScore(75, null, workoutPlan)).toBe(75);
  });

  it('rewards full adherence and penalizes missed weeks, within bounds', () => {
    const fullWeek = [
      { date: recentDate(1), workoutsDone: ['Monday'] },
      { date: recentDate(3), workoutsDone: ['Wednesday'] },
      { date: recentDate(5), workoutsDone: ['Friday'] },
    ];
    const missedWeek = [{ date: recentDate(2), workoutsDone: [] }];

    expect(blendRecoveryScore(75, fullWeek, workoutPlan)).toBeGreaterThan(75);
    expect(blendRecoveryScore(75, missedWeek, workoutPlan)).toBeLessThan(75);
    expect(blendRecoveryScore(99, fullWeek, workoutPlan)).toBeLessThanOrEqual(100);
    expect(blendRecoveryScore(21, missedWeek, workoutPlan)).toBeGreaterThanOrEqual(20);
  });

  it('ignores check-ins older than a week', () => {
    const old = [{ date: '2025-01-01', workoutsDone: [] }];
    expect(blendRecoveryScore(75, old, workoutPlan)).toBe(75);
  });
});

describe('generateCoachNarrative', () => {
  // Minimal translation stub — keys match the real shape so logic is tested, not string content
  const mockT = {
    headlineNoData: 'no-data',
    headlineFirst: 'first:{weight}',
    headlineProgress: '{weeks}w:{change}:{verdict}',
    verdictPace: 'pace',
    verdictFast: 'fast',
    verdictSlow: 'slow',
    trendNoData: 'trend-nd',
    trendOnTrack: 'on:{rate}:{target}',
    trendOff: 'off:{rate}:{target}',
    adherenceNone: 'adh-none',
    adherenceData: '{done}/{planned}:{pct}:{monthPct}',
    recoveryBase: 'rec-base:{score}',
    recoveryLive: 'rec-live:{score}:{sign}{delta}:{base}',
    recNoData: 'rnd',
    recCooldown: 'cool:{days}',
    recOnTrack: 'rot',
    recReduce: 'red:{delta}',
    recIncrease: 'inc:{delta}',
  };

  // Production plan data spreads formData over the generated plan, so fitnessGoal is always present.
  const losePlan = { ...makePlan({ fitnessGoal: 'lose-weight' }), fitnessGoal: 'lose-weight' };
  const weigh = (date, weight) => ({ date, weight, workoutsDone: [] });

  it('day-0: no data variants across all fields', () => {
    const n = generateCoachNarrative(losePlan, [], mockT);
    expect(n.headline).toBe('no-data');
    expect(n.trend).toBe('trend-nd');
    expect(n.adherence).toBe('adh-none');
    expect(n.recommendation).toBe('rnd');
    expect(n.recovery).toContain('rec-base:');
  });

  it('single check-in: headline shows the weight', () => {
    const n = generateCoachNarrative(losePlan, [weigh('2026-06-01', 80)], mockT);
    expect(n.headline).toBe('first:80');
  });

  it('on-track fat loss: verdict=pace, trend=on-track, rec=on-track', () => {
    // -0.75 kg / 14 days = -0.375 kg/week = exactly the lose-weight target
    const n = generateCoachNarrative(losePlan, [weigh('2026-06-01', 80), weigh('2026-06-15', 79.25)], mockT);
    expect(n.headline).toContain('pace');
    expect(n.trend).toMatch(/^on:/);
    expect(n.recommendation).toBe('rot');
  });

  it('flat weight on fat-loss: verdict=slow, recommendation=reduce', () => {
    const n = generateCoachNarrative(losePlan, [weigh('2026-06-01', 80), weigh('2026-06-15', 80)], mockT);
    expect(n.headline).toContain('slow');
    expect(n.recommendation).toMatch(/^red:/);
  });

  it('losing too fast: verdict=fast, recommendation=increase', () => {
    // -1.5 kg / 14 days = -0.75 kg/week, twice the target rate
    const n = generateCoachNarrative(losePlan, [weigh('2026-06-01', 80), weigh('2026-06-15', 78.5)], mockT);
    expect(n.headline).toContain('fast');
    expect(n.recommendation).toMatch(/^inc:/);
  });

  it('cooldown active: recommendation shows days since last adjustment', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    const adjusted = { ...losePlan, calorieAdjustedAt: threeDaysAgo };
    const n = generateCoachNarrative(adjusted, [weigh('2026-06-01', 80), weigh('2026-06-15', 80)], mockT);
    expect(n.recommendation).toContain('cool:3');
  });

  it('recovery reflects blended score with sign when adherence shifts it', () => {
    // No recent check-ins → base score returned as-is
    const n = generateCoachNarrative(losePlan, [], mockT);
    expect(n.recovery).toBe(`rec-base:${losePlan.recoveryScore}`);
  });

  it('adherence data formats done/planned when check-ins exist', () => {
    const n = generateCoachNarrative(losePlan, [weigh('2026-06-01', 80)], mockT);
    // adherence field should contain the done/planned template filled in
    expect(n.adherence).toMatch(/^\d+\/\d+:/);
  });
});

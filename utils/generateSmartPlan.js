/**
 * Rule-based fitness plan generator.
 * Builds complete 7-day personalized plans from sports-science formulas
 * (Mifflin-St Jeor BMR, TDEE activity factors, goal-based macro splits).
 * Supports all fitness goals, experience levels, and dietary preferences.
 */

import { getPlanStrings } from './planStrings.js';

export function generateSmartPlan(userProfile) {
  const {
    age,
    gender,
    height,
    weight,
    fitnessGoal,
    experience,
    frequency,
    dietaryPreference,
    allergies = '',
    lang = 'en',
  } = userProfile;

  const bmr = calculateBMR(age, gender, height, weight);
  const activityFactor = getActivityFactor(frequency);
  const tdee = Math.round(bmr * activityFactor);
  const { dailyCalories, goal } = adjustForGoal(tdee, fitnessGoal);
  const macros = calculateMacros(dailyCalories, fitnessGoal, weight);

  const workoutPlan = generateWorkoutPlan(experience, frequency, fitnessGoal);
  const mealPlan = generateMealPlan(dailyCalories, macros, dietaryPreference, allergies, frequency, lang);
  const hydration = generateHydrationRecommendation(weight, age, frequency);

  const recoveryScore = generateRecoveryScore(frequency, age, fitnessGoal, dailyCalories, tdee);
  const dailyHabitTips = generateDailyHabitTips(fitnessGoal, experience, frequency);
  const riskFlags = generateRiskFlags(frequency, dailyCalories, tdee, age, fitnessGoal);
  const groceryList = generateGroceryList(mealPlan);

  const advice = generatePersonalizedAdvice(fitnessGoal, experience, age, gender, lang);

  return {
    dailyCalories,
    macros,
    hydration,
    workoutPlan,
    mealPlan,
    advice,
    recoveryScore,
    dailyHabitTips,
    riskFlags,
    groceryList,
    _metadata: {
      bmr: Math.round(bmr),
      tdee,
      activityFactor: activityFactor.toFixed(2),
      goal,
      calculatedAt: new Date().toISOString(),
      disclaimer: '⚠️ This plan is educational and not medical advice. Consult a healthcare provider before starting.',
    },
  };
}

// ============================================
// CORE CALCULATIONS
// ============================================

function calculateBMR(age, gender, height, weight) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function getActivityFactor(frequency) {
  if (frequency <= 2) return 1.2;
  if (frequency <= 3) return 1.375;
  if (frequency <= 5) return 1.55;
  if (frequency <= 6) return 1.725;
  return 1.9;
}

function adjustForGoal(tdee, goal) {
  if (goal === 'build-muscle') {
    return { dailyCalories: Math.round(tdee + 400), goal: 'Muscle Building (+400 cal/day)' };
  } else if (goal === 'lose-weight') {
    return { dailyCalories: Math.round(tdee - 400), goal: 'Fat Loss (-400 cal/day)' };
  } else if (goal === 'endurance') {
    return { dailyCalories: Math.round(tdee), goal: 'Endurance (Maintenance)' };
  } else if (goal === 'flexibility') {
    return { dailyCalories: Math.round(tdee - 100), goal: 'Flexibility (Slight Deficit)' };
  } else if (goal === 'performance') {
    return { dailyCalories: Math.round(tdee + 200), goal: 'Performance (Slight Surplus)' };
  } else {
    return { dailyCalories: Math.round(tdee), goal: 'General Fitness (Maintenance)' };
  }
}

function calculateMacros(calories, goal, weight) {
  let proteinPercentage, carbPercentage, fatPercentage;

  if (goal === 'build-muscle') {
    proteinPercentage = 0.32;
    carbPercentage = 0.48;
    fatPercentage = 0.2;
  } else if (goal === 'lose-weight') {
    proteinPercentage = 0.38;
    carbPercentage = 0.4;
    fatPercentage = 0.22;
  } else if (goal === 'endurance') {
    proteinPercentage = 0.25;
    carbPercentage = 0.55;
    fatPercentage = 0.2;
  } else if (goal === 'flexibility') {
    proteinPercentage = 0.25;
    carbPercentage = 0.5;
    fatPercentage = 0.25;
  } else if (goal === 'performance') {
    proteinPercentage = 0.3;
    carbPercentage = 0.5;
    fatPercentage = 0.2;
  } else {
    proteinPercentage = 0.28;
    carbPercentage = 0.5;
    fatPercentage = 0.22;
  }

  const proteinCalories = Math.round(calories * proteinPercentage);
  const carbCalories = Math.round(calories * carbPercentage);
  const fatCalories = calories - proteinCalories - carbCalories;

  return {
    protein: {
      grams: Math.round(proteinCalories / 4),
      percentage: Math.round(proteinPercentage * 100),
      recommendedPerKg: `${(1.6).toFixed(1)}-${(2.2).toFixed(1)}g/kg`,
    },
    carbs: {
      grams: Math.round(carbCalories / 4),
      percentage: Math.round(carbPercentage * 100),
    },
    fat: {
      grams: Math.round(fatCalories / 9),
      percentage: Math.round((fatCalories / calories) * 100),
    },
  };
}

// ============================================
// WORKOUT GENERATION
// ============================================

function generateWorkoutPlan(experience, frequency, goal) {
  if (goal === 'endurance') {
    return generateEndurancePlan(experience, frequency);
  } else if (goal === 'flexibility') {
    return generateFlexibilityPlan(experience, frequency);
  } else if (goal === 'performance') {
    return generatePerformancePlan(experience, frequency);
  }

  const basePlans = {
    beginner: generateBeginnerPlan(frequency, goal),
    intermediate: generateIntermediatePlan(frequency, goal),
    advanced: generateAdvancedPlan(frequency, goal),
    elite: generateElitePlan(frequency, goal),
  };

  return basePlans[experience] || basePlans.beginner;
}

function generateBeginnerPlan(frequency, goal) {
  const plans = {
    3: [
      {
        day: 'Monday',
        focus: 'Full Body Strength',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio (walking, easy bike)',
          'Arm circles 10x each direction',
          'Bodyweight squats 10x',
          'Push-ups 5x (or wall push-ups)',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Back Squat',
            sets: 3,
            reps: 8,
            restTime: 120,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bodyweight' },
              { reps: 3, weight: '50%' },
            ],
            estimatedDuration: 12,
            alternatives: ['Leg Press', 'Goblet Squats', 'Smith Machine Squat'],
          },
          {
            name: 'Barbell Bench Press',
            sets: 3,
            reps: 8,
            restTime: 120,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Chest', 'Triceps', 'Front Delts'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
            ],
            estimatedDuration: 12,
            alternatives: ['Dumbbell Bench Press', 'Machine Press', 'Push-ups'],
          },
          {
            name: 'Barbell Bent-Over Row',
            sets: 3,
            reps: 8,
            restTime: 120,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
            ],
            estimatedDuration: 12,
            alternatives: ['Dumbbell Rows', 'Machine Row', 'Lat Pulldown'],
          },
          {
            name: 'Dumbbell Curls',
            sets: 2,
            reps: 10,
            restTime: 60,
            intensity: 'Light',
            rpe: 'RPE 5-6',
            muscleGroups: ['Biceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Barbell Curls', 'Cable Curls'],
          },
        ],
        cooldownExercises: [
          { name: 'Chest & Front Shoulder Stretch', duration: 2 },
          { name: 'Back Stretch', duration: 2 },
          { name: 'Quadriceps Stretch', duration: 2 },
        ],
        recoveryTips: 'Focus on form over weight. Rest 48 hours before next full-body session.',
        progressionGuidance: 'Week 1-2: Master form and movement. Week 3-4: Add 1-2 reps per set. Week 5: Increase weight 5-10lbs.',
      },
      {
        day: 'Wednesday',
        focus: 'Full Body Power & Cardio',
        warmupMinutes: 5,
        warmupExercises: [
          '2 mins light jogging or rowing',
          'Arm swings 10x each direction',
          'Leg swings 10x each leg',
          'Cat-cow stretches 8x',
        ],
        totalEstimatedTime: 55,
        exercises: [
          {
            name: 'Barbell Deadlift',
            sets: 3,
            reps: 5,
            restTime: 180,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Back', 'Glutes', 'Hamstrings', 'Core'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 3, weight: 'bar' },
              { reps: 2, weight: '50%' },
              { reps: 1, weight: '75%' },
            ],
            estimatedDuration: 15,
            alternatives: ['Romanian Deadlift', 'Trap Bar Deadlift'],
          },
          {
            name: 'Incline Dumbbell Bench',
            sets: 3,
            reps: 10,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Upper Chest', 'Front Delts', 'Triceps'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Incline Barbell Press', 'Machine Incline Press'],
          },
          {
            name: 'Pull-ups or Lat Pulldown',
            sets: 3,
            reps: 8,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Back', 'Biceps'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Assisted Pull-ups', 'Resistance Band Pull-ups'],
          },
          {
            name: 'Light Cardio',
            sets: 1,
            reps: 15,
            restTime: 0,
            intensity: 'Light',
            rpe: 'RPE 4-5',
            muscleGroups: ['Full Body'],
            exerciseType: 'Cardio',
            estimatedDuration: 15,
            alternatives: ['Treadmill', 'Bike', 'Elliptical', 'Jump rope'],
          },
        ],
        cooldownExercises: [
          { name: 'Full Body Stretch', duration: 3 },
          { name: 'Child\'s Pose', duration: 2 },
        ],
        recoveryTips: 'Power day - prioritize quality reps. Light cardio to promote recovery.',
        progressionGuidance: 'Focus on explosive movement. Add 1 rep to cardio each week.',
      },
      {
        day: 'Friday',
        focus: 'Full Body Hypertrophy',
        warmupMinutes: 5,
        warmupExercises: [
          '2 mins light cardio',
          'Band pull-aparts 15x',
          'Bodyweight squats 10x',
        ],
        totalEstimatedTime: 45,
        exercises: [
          {
            name: 'Goblet Squats',
            sets: 3,
            reps: 12,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Quadriceps', 'Glutes'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Leg Press', 'Smith Machine Squat'],
          },
          {
            name: 'Dumbbell Bench Press',
            sets: 3,
            reps: 12,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Chest', 'Triceps', 'Front Delts'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Machine Press', 'Barbell Bench Press'],
          },
          {
            name: 'Dumbbell Rows',
            sets: 3,
            reps: 12,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Back', 'Biceps'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Barbell Rows', 'Machine Row', 'Cable Rows'],
          },
          {
            name: 'Tricep Rope Pushdown',
            sets: 2,
            reps: 12,
            restTime: 60,
            intensity: 'Light',
            rpe: 'RPE 5-6',
            muscleGroups: ['Triceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 6,
            alternatives: ['Dips', 'Tricep Machine'],
          },
        ],
        cooldownExercises: [
          { name: 'Chest Stretch', duration: 2 },
          { name: 'Shoulder Stretch', duration: 2 },
          { name: 'Tricep Stretch', duration: 2 },
        ],
        recoveryTips: 'Higher reps focus on muscle pump. Stay hydrated.',
        progressionGuidance: 'Week 1-2: Get a good pump. Week 3-4: Add 2-3 reps. Week 5: Increase weight.',
      },
      {
        day: 'Sunday',
        focus: 'Active Recovery',
        warmupMinutes: 0,
        warmupExercises: [],
        totalEstimatedTime: 30,
        exercises: [
          {
            name: 'Light Walk or Stretch Session',
            sets: 1,
            reps: 30,
            restTime: 0,
            intensity: 'Very Light',
            rpe: 'RPE 2-3',
            muscleGroups: ['Full Body'],
            exerciseType: 'Recovery',
            estimatedDuration: 30,
            alternatives: ['Yoga', 'Swimming', 'Light cycling'],
          },
        ],
        cooldownExercises: [],
        recoveryTips: 'Prioritize sleep tonight. Hydrate well.',
        progressionGuidance: 'Rest day - focus on recovery and preparing for the week ahead.',
      },
    ],
    4: [
      {
        day: 'Monday',
        focus: 'Chest & Triceps',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Arm circles 10x each direction',
          'Band pull-aparts 15x',
          'Light push-ups 5x',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Bench Press',
            sets: 4,
            reps: 6,
            restTime: 120,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Chest', 'Triceps', 'Front Delts'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
              { reps: 1, weight: '75%' },
            ],
            estimatedDuration: 14,
            alternatives: ['Dumbbell Bench Press', 'Machine Press'],
          },
          {
            name: 'Incline Dumbbell Press',
            sets: 3,
            reps: 10,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Upper Chest', 'Front Delts'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Incline Barbell Press', 'Machine Incline Press'],
          },
          {
            name: 'Cable Flyes',
            sets: 3,
            reps: 12,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Chest'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Dumbbell Flyes', 'Machine Flyes'],
          },
          {
            name: 'Tricep Rope Pushdown',
            sets: 3,
            reps: 12,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Triceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Dips', 'Overhead Extension'],
          },
        ],
        cooldownExercises: [
          { name: 'Chest Stretch', duration: 2 },
          { name: 'Tricep Stretch', duration: 2 },
          { name: 'Shoulder Stretch', duration: 2 },
        ],
        recoveryTips: 'Push day. Adequate protein intake crucial for recovery.',
        progressionGuidance: 'Week 1-2: Dial in form. Week 3-4: Add 1-2 reps or 5lbs. Week 5: Deload.',
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Scapular pull-ups 8x',
          'Band pull-aparts 15x',
          'Arm swings 10x each direction',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Bent-Over Row',
            sets: 4,
            reps: 6,
            restTime: 120,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Back', 'Biceps'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
              { reps: 1, weight: '75%' },
            ],
            estimatedDuration: 14,
            alternatives: ['Dumbbell Rows', 'Machine Row'],
          },
          {
            name: 'Pull-ups or Lat Pulldown',
            sets: 3,
            reps: 8,
            restTime: 120,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Back', 'Biceps'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Assisted Pull-ups', 'Resistance Band Pull-ups'],
          },
          {
            name: 'Dumbbell Curls',
            sets: 3,
            reps: 10,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Biceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Barbell Curls', 'Cable Curls'],
          },
          {
            name: 'Face Pulls',
            sets: 3,
            reps: 15,
            restTime: 60,
            intensity: 'Light',
            rpe: 'RPE 5-6',
            muscleGroups: ['Rear Delts', 'Back'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Reverse Pec Deck', 'Band Pull-aparts'],
          },
        ],
        cooldownExercises: [
          { name: 'Back Stretch', duration: 2 },
          { name: 'Shoulder Stretch', duration: 2 },
          { name: 'Bicep Stretch', duration: 2 },
        ],
        recoveryTips: 'Pull day. Avoid deadlifts today to manage fatigue.',
        progressionGuidance: 'Week 1-2: Focus on mind-muscle connection. Week 3-4: Add 1-2 reps. Week 5: Deload.',
      },
      {
        day: 'Thursday',
        focus: 'Legs & Core',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Bodyweight squats 10x',
          'Leg swings 10x each leg',
          'Cat-cow stretches 8x',
        ],
        totalEstimatedTime: 55,
        exercises: [
          {
            name: 'Barbell Back Squat',
            sets: 4,
            reps: 6,
            restTime: 150,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bodyweight' },
              { reps: 3, weight: '50%' },
              { reps: 1, weight: '75%' },
            ],
            estimatedDuration: 14,
            alternatives: ['Leg Press', 'Smith Machine Squat'],
          },
          {
            name: 'Romanian Deadlift',
            sets: 3,
            reps: 8,
            restTime: 120,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Hamstrings', 'Glutes', 'Back'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Leg Curls', 'Good Mornings'],
          },
          {
            name: 'Leg Extension',
            sets: 3,
            reps: 12,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Quadriceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Leg Press (high reps)', 'Smith Machine Squat (high reps)'],
          },
          {
            name: 'Ab Wheel Rollout or Hanging Leg Raises',
            sets: 3,
            reps: 10,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Core', 'Abs'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Cable Crunches', 'Decline Sit-ups'],
          },
        ],
        cooldownExercises: [
          { name: 'Quadriceps Stretch', duration: 2 },
          { name: 'Hamstring Stretch', duration: 2 },
          { name: 'Hip Flexor Stretch', duration: 2 },
        ],
        recoveryTips: 'Leg day is demanding. Ensure adequate carbs and protein post-workout.',
        progressionGuidance: 'Week 1-2: Form focus. Week 3-4: Add 1-2 reps or 5-10lbs to squats. Week 5: Deload.',
      },
      {
        day: 'Friday',
        focus: 'Shoulders & Arms',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Arm circles 10x each direction',
          'Band pull-aparts 15x',
          'Light lateral raises 12x',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Overhead Press',
            sets: 4,
            reps: 8,
            restTime: 120,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Shoulders', 'Triceps'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
            ],
            estimatedDuration: 12,
            alternatives: ['Dumbbell Shoulder Press', 'Machine Shoulder Press'],
          },
          {
            name: 'Lateral Raises',
            sets: 3,
            reps: 12,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Shoulders'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Cable Lateral Raises', 'Machine Lateral Raises'],
          },
          {
            name: 'Barbell Curls',
            sets: 3,
            reps: 10,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Biceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Dumbbell Curls', 'Cable Curls'],
          },
          {
            name: 'Tricep Rope Pushdown',
            sets: 3,
            reps: 12,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Triceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Dips', 'Overhead Tricep Extension'],
          },
        ],
        cooldownExercises: [
          { name: 'Shoulder Stretch', duration: 2 },
          { name: 'Tricep Stretch', duration: 2 },
          { name: 'Bicep Stretch', duration: 2 },
        ],
        recoveryTips: 'Lighter session to close the week. Strict form on isolation work — no swinging.',
        progressionGuidance: 'Week 1-2: Master form. Week 3-4: Add 1-2 reps per set. Week 5: Increase weight slightly.',
      },
    ],
    5: [
      {
        day: 'Monday',
        focus: 'Upper Body - Push Focus',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Arm circles 10x each direction',
          'Band pull-aparts 15x',
          'Light push-ups 8x',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Bench Press',
            sets: 5,
            reps: 5,
            restTime: 120,
            intensity: 'Very High',
            rpe: 'RPE 8-9',
            muscleGroups: ['Chest', 'Triceps', 'Front Delts'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
              { reps: 2, weight: '75%' },
              { reps: 1, weight: '90%' },
            ],
            estimatedDuration: 15,
            alternatives: ['Dumbbell Bench Press', 'Machine Press'],
          },
          {
            name: 'Dumbbell Shoulder Press',
            sets: 3,
            reps: 8,
            restTime: 100,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Shoulders', 'Triceps', 'Chest'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Barbell Overhead Press', 'Machine Shoulder Press'],
          },
          {
            name: 'Incline Dumbbell Flyes',
            sets: 3,
            reps: 12,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Upper Chest', 'Front Delts'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Cable Flyes', 'Machine Flyes'],
          },
          {
            name: 'Tricep Rope Pushdown',
            sets: 3,
            reps: 12,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Triceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Dips', 'Overhead Extension'],
          },
        ],
        cooldownExercises: [
          { name: 'Chest Stretch', duration: 2 },
          { name: 'Shoulder Stretch', duration: 2 },
          { name: 'Tricep Stretch', duration: 2 },
        ],
        recoveryTips: 'Intense push session. Prioritize sleep and protein.',
        progressionGuidance: 'Week 1-3: Build strength. Week 4: Add 2-3 reps. Week 5: Deload week.',
      },
      {
        day: 'Tuesday',
        focus: 'Lower Body - Quads Focus',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Bodyweight squats 10x',
          'Leg swings 10x each leg',
          'Glute bridges 10x',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Back Squat',
            sets: 5,
            reps: 5,
            restTime: 150,
            intensity: 'Very High',
            rpe: 'RPE 8-9',
            muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bodyweight' },
              { reps: 3, weight: '50%' },
              { reps: 2, weight: '75%' },
              { reps: 1, weight: '90%' },
            ],
            estimatedDuration: 15,
            alternatives: ['Leg Press', 'Smith Machine Squat'],
          },
          {
            name: 'Leg Press',
            sets: 3,
            reps: 8,
            restTime: 100,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Quadriceps', 'Glutes'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Smith Machine Squat', 'Hack Squat'],
          },
          {
            name: 'Leg Extension',
            sets: 3,
            reps: 12,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Quadriceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Sissy Squats', 'Front Squats (light)'],
          },
          {
            name: 'Calf Raises',
            sets: 3,
            reps: 15,
            restTime: 60,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Calves'],
            exerciseType: 'Isolation',
            estimatedDuration: 7,
            alternatives: ['Leg Press Calf Raises', 'Smith Machine Calf Raises'],
          },
        ],
        cooldownExercises: [
          { name: 'Quadriceps Stretch', duration: 2 },
          { name: 'Hip Flexor Stretch', duration: 2 },
          { name: 'Calf Stretch', duration: 2 },
        ],
        recoveryTips: 'High volume leg day. Hydrate well.',
        progressionGuidance: 'Week 1-3: Build strength on main lifts. Week 4-5: Add reps.',
      },
      {
        day: 'Wednesday',
        focus: 'Rest or Active Recovery',
        warmupMinutes: 0,
        warmupExercises: [],
        totalEstimatedTime: 30,
        exercises: [
          {
            name: 'Light Walk, Yoga, or Stretching',
            sets: 1,
            reps: 30,
            restTime: 0,
            intensity: 'Very Light',
            rpe: 'RPE 2-3',
            muscleGroups: ['Full Body'],
            exerciseType: 'Recovery',
            estimatedDuration: 30,
            alternatives: ['Swimming', 'Light cycling', 'Mobility work'],
          },
        ],
        cooldownExercises: [],
        recoveryTips: 'Complete rest day. Focus on sleep and hydration.',
        progressionGuidance: 'Recovery is crucial for progress.',
      },
      {
        day: 'Thursday',
        focus: 'Upper Body - Pull Focus',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Band pull-aparts 15x',
          'Scapular pull-ups 8x',
          'Arm swings 10x each direction',
        ],
        totalEstimatedTime: 50,
        exercises: [
          {
            name: 'Barbell Bent-Over Row',
            sets: 5,
            reps: 5,
            restTime: 120,
            intensity: 'Very High',
            rpe: 'RPE 8-9',
            muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 5, weight: 'bar' },
              { reps: 3, weight: '50%' },
              { reps: 2, weight: '75%' },
              { reps: 1, weight: '90%' },
            ],
            estimatedDuration: 15,
            alternatives: ['Dumbbell Rows', 'Machine Row', 'Seal Row'],
          },
          {
            name: 'Pull-ups',
            sets: 3,
            reps: 6,
            restTime: 100,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Back', 'Biceps'],
            exerciseType: 'Compound',
            estimatedDuration: 10,
            alternatives: ['Assisted Pull-ups', 'Lat Pulldown', 'Resistance Band Pull-ups'],
          },
          {
            name: 'Dumbbell Curls',
            sets: 3,
            reps: 10,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Biceps'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Barbell Curls', 'Cable Curls', 'Machine Curls'],
          },
          {
            name: 'Face Pulls',
            sets: 3,
            reps: 15,
            restTime: 60,
            intensity: 'Light',
            rpe: 'RPE 5-6',
            muscleGroups: ['Rear Delts', 'Back'],
            exerciseType: 'Isolation',
            estimatedDuration: 8,
            alternatives: ['Reverse Pec Deck', 'Band Pull-aparts'],
          },
        ],
        cooldownExercises: [
          { name: 'Back Stretch', duration: 2 },
          { name: 'Shoulder Stretch', duration: 2 },
          { name: 'Bicep Stretch', duration: 2 },
        ],
        recoveryTips: 'Pull day. Back-dominant session.',
        progressionGuidance: 'Week 1-3: Build strength. Week 4: Add reps. Week 5: Deload.',
      },
      {
        day: 'Friday',
        focus: 'Lower Body - Hams & Glutes Focus',
        warmupMinutes: 5,
        warmupExercises: [
          '3 mins light cardio',
          'Bodyweight squats 10x',
          'Leg swings 10x each leg',
          'Glute bridges 12x',
        ],
        totalEstimatedTime: 45,
        exercises: [
          {
            name: 'Barbell Deadlift',
            sets: 4,
            reps: 5,
            restTime: 150,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Hamstrings', 'Glutes', 'Back', 'Core'],
            exerciseType: 'Compound',
            warmupSets: [
              { reps: 3, weight: 'bar' },
              { reps: 2, weight: '50%' },
              { reps: 1, weight: '75%' },
            ],
            estimatedDuration: 14,
            alternatives: ['Romanian Deadlift', 'Trap Bar Deadlift'],
          },
          {
            name: 'Leg Curl',
            sets: 3,
            reps: 10,
            restTime: 90,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Hamstrings'],
            exerciseType: 'Isolation',
            estimatedDuration: 9,
            alternatives: ['Romanian Deadlift (light)', 'Good Mornings'],
          },
          {
            name: 'Hip Thrusts or Glute Bridges',
            sets: 3,
            reps: 12,
            restTime: 75,
            intensity: 'Moderate',
            rpe: 'RPE 6-7',
            muscleGroups: ['Glutes'],
            exerciseType: 'Compound',
            estimatedDuration: 9,
            alternatives: ['Bulgarian Split Squats', 'Smith Machine Hip Thrusts'],
          },
          {
            name: 'Ab Wheel Rollout',
            sets: 2,
            reps: 8,
            restTime: 60,
            intensity: 'Light',
            rpe: 'RPE 5-6',
            muscleGroups: ['Core', 'Abs'],
            exerciseType: 'Isolation',
            estimatedDuration: 6,
            alternatives: ['Hanging Leg Raises', 'Cable Crunches'],
          },
        ],
        cooldownExercises: [
          { name: 'Hamstring Stretch', duration: 2 },
          { name: 'Glute Stretch', duration: 2 },
          { name: 'Hip Flexor Stretch', duration: 2 },
        ],
        recoveryTips: 'Posterior chain focus. Good day to emphasize stretching.',
        progressionGuidance: 'Week 1-3: Strength phase. Week 4-5: Hypertrophy phase.',
      },
      {
        day: 'Saturday',
        focus: 'Active Recovery & Mobility',
        warmupMinutes: 0,
        warmupExercises: [],
        totalEstimatedTime: 40,
        exercises: [
          {
            name: 'Yoga Flow or Stretching Session',
            sets: 1,
            reps: 40,
            restTime: 0,
            intensity: 'Very Light',
            rpe: 'RPE 2-3',
            muscleGroups: ['Full Body'],
            exerciseType: 'Recovery',
            estimatedDuration: 40,
            alternatives: ['Swimming', 'Light cycling', 'Foam rolling'],
          },
        ],
        cooldownExercises: [],
        recoveryTips: 'Focus on mobility and flexibility work.',
        progressionGuidance: 'Support your training with adequate recovery.',
      },
      {
        day: 'Sunday',
        focus: 'Complete Rest',
        warmupMinutes: 0,
        warmupExercises: [],
        totalEstimatedTime: 0,
        exercises: [],
        cooldownExercises: [],
        recoveryTips: 'Full rest day. Prepare mentally and physically for the upcoming week.',
        progressionGuidance: 'Sleep, hydrate, and eat well.',
      },
    ],
  };

  if (frequency >= 6) {
    return extendFiveDayPlan(plans[5], frequency);
  }

  return plans[frequency] || plans[3];
}

// Builds 6- and 7-day schedules from the 5-day split: Saturday becomes a real
// conditioning session, and for 7 days Sunday becomes active recovery instead of full rest.
function extendFiveDayPlan(fiveDayPlan, frequency) {
  const conditioningDay = {
    day: 'Saturday',
    focus: 'Steady-State Cardio',
    warmupMinutes: 5,
    warmupExercises: [
      '3 mins easy pace cardio',
      'Leg swings 10x each leg',
      'Arm circles 10x each direction',
    ],
    totalEstimatedTime: 45,
    exercises: [
      {
        name: 'Steady-State Cardio',
        sets: 1,
        reps: 30,
        restTime: 0,
        intensity: 'Moderate',
        rpe: 'RPE 5-6',
        muscleGroups: ['Full Body'],
        exerciseType: 'Cardio',
        estimatedDuration: 30,
        alternatives: ['Running', 'Cycling', 'Rowing', 'Incline treadmill walk'],
      },
      {
        name: 'Hanging Leg Raises',
        sets: 3,
        reps: 10,
        restTime: 60,
        intensity: 'Moderate',
        rpe: 'RPE 6-7',
        muscleGroups: ['Core', 'Abs'],
        exerciseType: 'Isolation',
        estimatedDuration: 8,
        alternatives: ['Cable Crunches', 'Plank', 'Dead Bug'],
      },
    ],
    cooldownExercises: [{ name: 'Full Body Stretch', duration: 5 }],
    recoveryTips: 'Keep the pace conversational — this session supports recovery, not fatigue.',
    progressionGuidance: 'Add 2-3 minutes of cardio each week, up to 45 minutes.',
  };

  return fiveDayPlan.map((day) => {
    if (day.day === 'Saturday') return conditioningDay;
    if (day.day === 'Sunday' && frequency >= 7) {
      return {
        ...day,
        focus: 'Active Recovery',
        totalEstimatedTime: 30,
        exercises: [
          {
            name: 'Light Walk or Stretch Session',
            sets: 1,
            reps: 30,
            restTime: 0,
            intensity: 'Very Light',
            rpe: 'RPE 2-3',
            muscleGroups: ['Full Body'],
            exerciseType: 'Recovery',
            estimatedDuration: 30,
            alternatives: ['Yoga', 'Swimming', 'Light cycling'],
          },
        ],
        recoveryTips: 'Seven sessions a week only works if this one stays genuinely easy.',
        progressionGuidance: 'Keep intensity very low — this day protects the rest of your week.',
      };
    }
    return day;
  });
}

function generateIntermediatePlan(frequency, goal) {
  const beginnerPlan = generateBeginnerPlan(frequency, goal);
  return beginnerPlan.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => ({
      ...ex,
      sets: Math.min(ex.sets + 1, 5),
      reps: Math.max(ex.reps - 2, 3),
      intensity: ex.intensity === 'Light' ? 'Moderate' : 'High',
      rpe: ex.rpe === 'RPE 5-6' ? 'RPE 6-7' : 'RPE 7-8',
    })),
  }));
}

function generateAdvancedPlan(frequency, goal) {
  const intermediatePlan = generateIntermediatePlan(frequency, goal);
  return intermediatePlan.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => ({
      ...ex,
      sets: Math.min(ex.sets + 1, 6),
      intensity: 'Very High',
      rpe: 'RPE 8-9',
    })),
  }));
}

function generateElitePlan(frequency, goal) {
  const advancedPlan = generateAdvancedPlan(frequency, goal);
  return advancedPlan.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => ({
      ...ex,
      sets: Math.min(ex.sets + 1, 7),
      notes: (ex.notes || '') + ' [Elite: Consider drop sets or supersets]',
    })),
  }));
}

function generateEndurancePlan(experience, frequency) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutDays = frequency === 3 ? 3 : frequency === 4 ? 4 : frequency === 5 ? 5 : 6;

  const cardioFocusedDays = days.slice(0, Math.min(workoutDays, 7)).map((day, idx) => ({
    day,
    focus: idx % 2 === 0 ? 'Steady-State Cardio' : 'Interval Training',
    warmupMinutes: 5,
    warmupExercises: [
      '2 mins dynamic stretching',
      'Arm swings 10x each direction',
      ' gradual pace increase over 3 mins',
    ],
    totalEstimatedTime: 50,
    exercises: [
      idx % 2 === 0
        ? {
            name: 'Steady-State Cardio',
            sets: 1,
            reps: 35,
            restTime: 0,
            intensity: 'Moderate',
            rpe: 'RPE 5-6',
            muscleGroups: ['Full Body'],
            exerciseType: 'Cardio',
            estimatedDuration: 35,
            alternatives: ['Running', 'Cycling', 'Rowing', 'Elliptical', 'Swimming'],
          }
        : {
            name: 'HIIT - Intervals',
            sets: 10,
            reps: 1,
            restTime: 60,
            intensity: 'High',
            rpe: 'RPE 7-8',
            muscleGroups: ['Full Body'],
            exerciseType: 'Cardio',
            estimatedDuration: 30,
            alternatives: ['Sprint intervals on bike', 'Rowing intervals', 'Jump rope intervals'],
          },
    ],
    cooldownExercises: [
      { name: 'Full Body Stretch', duration: 5 },
      { name: 'Deep breathing', duration: 2 },
    ],
    recoveryTips: 'Endurance training. Stay hydrated.',
    progressionGuidance: 'Week 1-2: Build base fitness. Week 3-4: Increase intensity. Week 5: Focus on recovery.',
  }));

  return cardioFocusedDays;
}

function generateFlexibilityPlan(experience, frequency) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutDays = Math.min(frequency, 4);

  return days.slice(0, workoutDays).map((day, idx) => ({
    day,
    focus: ['Full Body Yoga', 'Hips & Hamstrings Focus', 'Shoulders & Spine', 'Restorative'][idx % 4],
    warmupMinutes: 2,
    warmupExercises: ['Cat-cow stretches 10x', 'Child\'s pose', 'Gentle neck rolls'],
    totalEstimatedTime: 45,
    exercises: [
      {
        name: 'Yoga/Flexibility Flow',
        sets: 1,
        reps: 45,
        restTime: 0,
        intensity: 'Very Light',
        rpe: 'RPE 3-4',
        muscleGroups: ['Full Body'],
        exerciseType: 'Flexibility',
        estimatedDuration: 45,
        alternatives: ['Pilates', 'Tai Chi', 'Dynamic stretching'],
      },
    ],
    cooldownExercises: [],
    recoveryTips: 'Focus on breathing and body awareness.',
    progressionGuidance: 'Week 1-2: Learn proper form. Week 3+: Deepen stretches gradually.',
  }));
}

function generatePerformancePlan(experience, frequency) {
  const beginnerPlan = generateBeginnerPlan(frequency, 'build-muscle');
  return beginnerPlan.map((day, idx) => ({
    ...day,
    focus: ['Explosive Power', 'Strength & Speed', 'Endurance', 'Recovery'][idx % 4],
    exercises: day.exercises.map((ex) => ({
      ...ex,
      rpe: 'RPE 8-9',
      notes: (ex.notes || '') + ' [Performance: Focus on explosive movement]',
    })),
  }));
}

// ============================================
// MEAL GENERATION
// ============================================

function generateMealPlan(dailyCalories, macros, dietaryPreference, allergies, frequency, lang = 'en') {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const isHighProtein = macros.protein.percentage >= 35;

  return days.map((day, idx) => {
    const isWorkoutDay = frequency >= 6 || (frequency === 5 && idx !== 2 && idx !== 6) || (frequency === 4 && idx !== 2 && idx !== 5) || (frequency === 3 && idx !== 2 && idx !== 5);

    const meals = {
      breakfast: generateMealForTimeOfDay(
        'breakfast',
        dailyCalories,
        macros,
        dietaryPreference,
        allergies,
        isWorkoutDay,
        0.25,
        lang
      ),
      lunch: generateMealForTimeOfDay('lunch', dailyCalories, macros, dietaryPreference, allergies, isWorkoutDay, 0.35, lang),
      dinner: generateMealForTimeOfDay(
        'dinner',
        dailyCalories,
        macros,
        dietaryPreference,
        allergies,
        isWorkoutDay,
        0.3,
        lang
      ),
      snack: generateMealForTimeOfDay('snack', dailyCalories, macros, dietaryPreference, allergies, isWorkoutDay, 0.1, lang),
    };

    return {
      day,
      meals,
      hydrationReminders: isWorkoutDay
        ? [
            'Upon waking: 500ml water',
            '1 hour before workout: 300-500ml water',
            'During workout: 250ml every 15 mins',
            'Post-workout: 500ml within 30 mins',
            'Throughout day: 2-3L additional water',
          ]
        : ['Upon waking: 500ml water', 'Mid-morning: 300ml', 'Lunch: 300ml', 'Mid-afternoon: 300ml', 'Evening: 200ml'],
    };
  });
}

function generateMealForTimeOfDay(timeOfDay, dailyCalories, macros, preference, allergies, isWorkoutDay, caloriePercent, lang = 'en') {
  const mealCalories = Math.round(dailyCalories * caloriePercent);
  const meals = getMealOptions(preference, allergies, lang);
  const mealList = meals[timeOfDay] || [];

  if (mealList.length === 0) {
    return {
      name: 'Meal',
      description: 'Unable to generate meal',
      calories: mealCalories,
      macros: { protein: 0, carbs: 0, fat: 0 },
      timing: getTiming(timeOfDay, false, lang),
      prepTime: '15 minutes',
      difficulty: 'Easy',
      alternatives: [],
    };
  }

  const selectedMeal = mealList[Math.floor(Math.random() * mealList.length)];
  const macroSplit = getMacroSplitForMeal(timeOfDay, isWorkoutDay);

  return {
    name: selectedMeal.name,
    description: selectedMeal.description,
    calories: mealCalories,
    macros: {
      protein: Math.round((mealCalories * macroSplit.protein) / 4),
      carbs: Math.round((mealCalories * macroSplit.carbs) / 4),
      fat: Math.round((mealCalories * macroSplit.fat) / 9),
    },
    timing: getTiming(timeOfDay, isWorkoutDay, lang),
    prepTime: selectedMeal.prepTime || '15 minutes',
    difficulty: selectedMeal.difficulty || 'Easy',
    alternatives: selectedMeal.alternatives || [],
  };
}

function getMacroSplitForMeal(timeOfDay, isWorkoutDay) {
  if (timeOfDay === 'breakfast') return { protein: 0.3, carbs: 0.5, fat: 0.2 };
  if (timeOfDay === 'lunch') return { protein: 0.35, carbs: 0.45, fat: 0.2 };
  if (timeOfDay === 'dinner') return { protein: 0.4, carbs: 0.35, fat: 0.25 };
  return { protein: 0.4, carbs: 0.4, fat: 0.2 };
}

function getTiming(timeOfDay, isWorkoutDay, lang = 'en') {
  const t = getPlanStrings(lang).timing;
  const timings = {
    breakfast: t.breakfast,
    lunch: t.lunch,
    dinner: t.dinner,
    snack: isWorkoutDay ? t.snackWorkout : t.snackRest,
  };
  return timings[timeOfDay] || t.asNeeded;
}

function getMealOptions(preference, allergies, lang = 'en') {
  const strings = getPlanStrings(lang);
  const allMeals = strings.meals;
  const mealBase = allMeals[preference] || allMeals['omnivore'];

  const filterAllergies = (meals) => {
    return meals.filter((meal) => {
      const allergenList = allergies.toLowerCase().split(',').map((a) => a.trim());
      return !allergenList.some(
        (allergen) =>
          allergen && (meal.name.toLowerCase().includes(allergen) || meal.description.toLowerCase().includes(allergen))
      );
    });
  };

  return {
    breakfast: filterAllergies(mealBase.breakfast),
    lunch: filterAllergies(mealBase.lunch),
    dinner: filterAllergies(mealBase.dinner),
    snack: filterAllergies(mealBase.snack),
  };
}

// ============================================
// COACH INSIGHTS (recovery score, habit tips, risk flags)
// ============================================

function generateRecoveryScore(frequency, age, fitnessGoal, dailyCalories, tdee) {
  let score = 80;

  if (frequency >= 6) score -= 15;
  if (frequency >= 5) score -= 10;
  if (age < 20) score += 10;
  if (age > 40) score -= 10;

  const deficit = tdee - dailyCalories;
  if (deficit > 300) score -= 15;

  if (fitnessGoal === 'lose-weight') score -= 10;
  if (fitnessGoal === 'build-muscle') score -= 5;

  return Math.max(20, Math.min(100, score));
}

function generateDailyHabitTips(fitnessGoal, experience, frequency) {
  const tips = [];

  if (fitnessGoal === 'build-muscle') {
    tips.push('💪 Eat protein with every meal (aim for 1.6-2.2g per kg bodyweight)');
    tips.push('😴 Get 7-9 hours sleep — muscle growth happens while sleeping');
    tips.push('💧 Drink 3-4L water daily to support muscle protein synthesis');
    tips.push('📊 Track workouts to ensure progressive overload');
  } else if (fitnessGoal === 'lose-weight') {
    tips.push('🥗 Eat protein-rich foods to preserve muscle during fat loss');
    tips.push('🚶 Take a 20-minute walk after meals to improve digestion');
    tips.push('💧 Drink water before meals to feel fuller');
    tips.push('📊 Focus on consistency over perfection');
  } else if (fitnessGoal === 'endurance') {
    tips.push('🏃 Include both steady-state and interval training');
    tips.push('💧 Hydration is critical — don\'t wait until thirsty');
    tips.push('⏰ Fuel properly before long cardio sessions');
    tips.push('😴 Recovery is essential for endurance gains');
  } else {
    tips.push('🎯 Move your body daily — even light activity counts');
    tips.push('💧 Drink enough water throughout the day');
    tips.push('😴 Prioritize 7-8 hours quality sleep');
    tips.push('🧘 Take time for stress management and mobility work');
  }

  return tips.slice(0, 4);
}

function generateRiskFlags(frequency, dailyCalories, tdee, age, fitnessGoal) {
  const flags = [];

  const deficit = tdee - dailyCalories;
  if (deficit > 500) {
    flags.push('⚠️ High calorie deficit + frequent training = increased muscle loss risk');
  }

  if (frequency >= 6 && Math.abs(deficit) > 300) {
    flags.push('⚠️ High frequency + aggressive calorie adjustment = burnout risk');
  }

  if (age < 18 && frequency >= 5) {
    flags.push('⚠️ Young age + high frequency = ensure adequate recovery');
  }

  if (age > 50 && frequency >= 5) {
    flags.push('⚠️ Advanced age + high frequency = prioritize form and recovery');
  }

  if (fitnessGoal === 'lose-weight' && frequency >= 6) {
    flags.push('⚠️ High volume + fat loss = monitor energy levels carefully');
  }

  return flags.length > 0 ? flags : ['✅ Plan looks sustainable!'];
}

function generateGroceryList(mealPlan) {
  const ingredients = {};

  mealPlan.forEach((day) => {
    Object.values(day.meals).forEach((meal) => {
      const description = meal.description || '';
      const words = description.split(',').map((w) => w.trim());

      words.forEach((item) => {
        const i = item.toLowerCase();
        let category = 'Other';
        if (
          i.includes('chicken') || i.includes('beef') || i.includes('turkey') ||
          i.includes('pork') || i.includes('fish') || i.includes('salmon') || i.includes('egg') ||
          i.includes('tavuk') || i.includes('dana') || i.includes('hindi') ||
          i.includes('domuz') || i.includes('balık') || i.includes('somon') ||
          i.includes('yumurta') || i.includes('tofu') || i.includes('tempeh') ||
          i.includes('nohut') || i.includes('mercimek') || i.includes('karides') || i.includes('kuzu')
        ) {
          category = 'Proteins';
        } else if (
          i.includes('rice') || i.includes('pasta') || i.includes('bread') || i.includes('oat') ||
          i.includes('pirinç') || i.includes('makarna') || i.includes('ekmek') ||
          i.includes('yulaf') || i.includes('kinoa') || i.includes('tortilla') || i.includes('granola')
        ) {
          category = 'Grains & Carbs';
        } else if (
          i.includes('broccoli') || i.includes('spinach') || i.includes('vegetable') ||
          i.includes('carrot') || i.includes('lettuce') ||
          i.includes('brokoli') || i.includes('ıspanak') || i.includes('sebze') ||
          i.includes('havuç') || i.includes('marul') || i.includes('karnabahar') ||
          i.includes('kabak') || i.includes('mantar') || i.includes('domates')
        ) {
          category = 'Vegetables';
        } else if (
          i.includes('berry') || i.includes('apple') || i.includes('banana') ||
          i.includes('meyve') || i.includes('elma') || i.includes('muz') ||
          i.includes('mersini') || i.includes('incir') || i.includes('hurma') ||
          i.includes('mango') || i.includes('portakal')
        ) {
          category = 'Fruits';
        } else if (
          i.includes('oil') || i.includes('butter') || i.includes('cheese') ||
          i.includes('yağ') || i.includes('tereyağ') || i.includes('peynir') ||
          i.includes('yoğurt') || i.includes('krem')
        ) {
          category = 'Oils & Dairy';
        } else if (
          i.includes('nut') || i.includes('seed') || i.includes('almond') ||
          i.includes('fıstık') || i.includes('badem') || i.includes('tohum') ||
          i.includes('ceviz') || i.includes('kaju')
        ) {
          category = 'Nuts & Seeds';
        }

        if (!ingredients[category]) ingredients[category] = [];
        if (!ingredients[category].includes(item) && item.length > 2) {
          ingredients[category].push(item);
        }
      });
    });
  });

  return ingredients;
}

// ============================================
// HYDRATION & ADVICE
// ============================================

function generateHydrationRecommendation(weight, age, frequency) {
  const baseline = weight * 0.035;
  const ageAdjustment = age > 50 ? -0.1 : age < 20 ? 0.1 : 0;
  const frequencyAdjustment = frequency >= 5 ? 0.5 : frequency >= 3 ? 0.2 : 0;

  const total = baseline + ageAdjustment + frequencyAdjustment;
  const rounded = Math.round(total * 2) / 2;

  return `${rounded.toFixed(1)}-${(rounded + 0.5).toFixed(1)} liters per day (more on workout days)`;
}

function generatePersonalizedAdvice(goal, experience, age, gender, lang = 'en') {
  const advicesByGoal = getPlanStrings(lang).advice;
  const adviceList = advicesByGoal[goal] || advicesByGoal['general-fitness'];
  return adviceList[Math.floor(Math.random() * adviceList.length)];
}

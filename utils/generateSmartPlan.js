/**
 * Advanced AI Fitness Plan Generator
 * Generates complete 7-day personalized plans with smart periodization
 * Supports all fitness goals, experience levels, and dietary preferences
 */

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
  } = userProfile;

  const bmr = calculateBMR(age, gender, height, weight);
  const activityFactor = getActivityFactor(frequency);
  const tdee = Math.round(bmr * activityFactor);
  const { dailyCalories, goal } = adjustForGoal(tdee, fitnessGoal);
  const macros = calculateMacros(dailyCalories, fitnessGoal, weight);

  const workoutPlan = generateWorkoutPlan(experience, frequency, fitnessGoal);
  const mealPlan = generateMealPlan(dailyCalories, macros, dietaryPreference, allergies, frequency);
  const hydration = generateHydrationRecommendation(weight, age, frequency);

  const recoveryScore = generateRecoveryScore(frequency, age, fitnessGoal, dailyCalories, tdee);
  const dailyHabitTips = generateDailyHabitTips(fitnessGoal, experience, frequency);
  const riskFlags = generateRiskFlags(frequency, dailyCalories, tdee, age, fitnessGoal);
  const groceryList = generateGroceryList(mealPlan);

  const advice = generatePersonalizedAdvice(fitnessGoal, experience, age, gender);

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

  return plans[frequency] || plans[3];
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

function generateMealPlan(dailyCalories, macros, dietaryPreference, allergies, frequency) {
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
        0.25
      ),
      lunch: generateMealForTimeOfDay('lunch', dailyCalories, macros, dietaryPreference, allergies, isWorkoutDay, 0.35),
      dinner: generateMealForTimeOfDay(
        'dinner',
        dailyCalories,
        macros,
        dietaryPreference,
        allergies,
        isWorkoutDay,
        0.3
      ),
      snack: generateMealForTimeOfDay('snack', dailyCalories, macros, dietaryPreference, allergies, isWorkoutDay, 0.1),
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

function generateMealForTimeOfDay(timeOfDay, dailyCalories, macros, preference, allergies, isWorkoutDay, caloriePercent) {
  const mealCalories = Math.round(dailyCalories * caloriePercent);
  const meals = getMealOptions(preference, allergies);
  const mealList = meals[timeOfDay] || [];

  if (mealList.length === 0) {
    return {
      name: 'Meal',
      description: 'Unable to generate meal',
      calories: mealCalories,
      macros: { protein: 0, carbs: 0, fat: 0 },
      timing: getTiming(timeOfDay),
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
    timing: getTiming(timeOfDay, isWorkoutDay),
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

function getTiming(timeOfDay, isWorkoutDay) {
  const timings = {
    breakfast: 'Within 1 hour of waking',
    lunch: 'Around midday (12-1pm)',
    dinner: 'Evening (6-8pm)',
    snack: isWorkoutDay ? 'Pre or post-workout' : 'Mid-afternoon or evening',
  };
  return timings[timeOfDay] || 'As needed';
}

function getMealOptions(preference, allergies) {
  const omnivoreMeals = {
    breakfast: [
      {
        name: 'Scrambled Eggs with Avocado Toast',
        description: '3 large eggs, 2 slices whole wheat toast, 1/2 avocado, 1 orange',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Oatmeal with berries and nuts', 'Greek yogurt with granola'],
      },
      {
        name: 'Oatmeal with Berries & Almonds',
        description: '1 cup oats, 1 banana, 1/2 cup blueberries, 1/4 cup almonds, honey',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Pancakes with lean bacon', 'Smoothie with protein powder'],
      },
      {
        name: 'Greek Yogurt Parfait',
        description: '1.5 cups Greek yogurt, 1/2 cup granola, 1/2 cup mixed berries, honey drizzle',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese with fruit', 'Protein smoothie'],
      },
      {
        name: 'Chicken Sausage Breakfast',
        description: '2 chicken sausages, 2 slices whole wheat toast, 1 tbsp almond butter, berries',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Bacon and eggs', 'Turkey sausage'],
      },
    ],
    lunch: [
      {
        name: 'Grilled Chicken Breast with Rice & Broccoli',
        description: '150g grilled chicken breast, 150g brown rice, 150g steamed broccoli, olive oil',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Turkey with sweet potato', 'Salmon with rice'],
      },
      {
        name: 'Turkey & Veggie Wrap',
        description: 'Whole wheat wrap, 100g sliced turkey, lettuce, tomato, hummus, avocado',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Chicken wrap', 'Tuna wrap'],
      },
      {
        name: 'Salmon with Sweet Potato & Asparagus',
        description: '150g baked salmon, 150g sweet potato, 150g steamed asparagus, lemon',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Cod with potatoes', 'Halibut with vegetables'],
      },
      {
        name: 'Lean Beef with Pasta & Tomato Sauce',
        description: '120g lean ground beef, 1.5 cups whole wheat pasta, tomato sauce, vegetables',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Turkey meatballs', 'Chicken pasta'],
      },
    ],
    dinner: [
      {
        name: 'Grilled Steak with Roasted Vegetables',
        description: '150g grilled steak (lean cut), roasted broccoli and carrots, sweet potato',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Grilled chicken', 'Baked fish'],
      },
      {
        name: 'Baked Chicken with Quinoa & Green Beans',
        description: '150g baked chicken breast, 150g quinoa, 150g steamed green beans, olive oil',
        prepTime: '30 minutes',
        difficulty: 'Easy',
        alternatives: ['Turkey breast', 'Baked fish'],
      },
      {
        name: 'Fish Tacos with Cabbage Slaw',
        description: '150g baked white fish, 2 whole grain tortillas, cabbage slaw, lime, cilantro',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Chicken tacos', 'Shrimp tacos'],
      },
      {
        name: 'Pork Tenderloin with Roasted Root Vegetables',
        description: '150g baked pork tenderloin, roasted sweet potato and brussels sprouts',
        prepTime: '35 minutes',
        difficulty: 'Medium',
        alternatives: ['Beef tenderloin', 'Chicken breast'],
      },
    ],
    snack: [
      {
        name: 'Protein Shake',
        description: 'Protein powder, banana, 1 tbsp peanut butter, almond milk, ice',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Greek yogurt', 'Protein bar'],
      },
      {
        name: 'Almonds & Dried Fruit Mix',
        description: '1/4 cup almonds, 2 tbsp dried cranberries, 2 tbsp raisins',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Mixed nuts', 'Trail mix'],
      },
      {
        name: 'Cottage Cheese with Berries',
        description: '150g low-fat cottage cheese, 1/2 cup mixed berries, 1 tbsp honey',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Greek yogurt', 'Protein pudding'],
      },
      {
        name: 'Apple with Almond Butter',
        description: '1 medium apple, 2 tbsp almond butter',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Banana with peanut butter', 'Rice cakes with butter'],
      },
    ],
  };

  const vegetarianMeals = {
    breakfast: [
      {
        name: 'Scrambled Eggs with Avocado Toast',
        description: '3 large eggs, 2 slices whole wheat toast, 1/2 avocado, 1 orange',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Oatmeal with protein powder', 'Greek yogurt with granola'],
      },
      {
        name: 'Tofu Scramble with Mushrooms',
        description: '150g firm tofu, mushrooms, spinach, onions, 2 slices toast, olive oil',
        prepTime: '15 minutes',
        difficulty: 'Medium',
        alternatives: ['Vegetable frittata', 'Chickpea scramble'],
      },
      {
        name: 'Greek Yogurt Parfait',
        description: '1.5 cups Greek yogurt, 1/2 cup granola, 1/2 cup berries, honey',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese parfait', 'Plant-based yogurt'],
      },
      {
        name: 'Cottage Cheese Pancakes',
        description: '1 cup cottage cheese blended with eggs, whole grain flour, berries on top',
        prepTime: '15 minutes',
        difficulty: 'Medium',
        alternatives: ['Oatmeal pancakes', 'Protein pancakes'],
      },
    ],
    lunch: [
      {
        name: 'Chickpea & Quinoa Salad',
        description: '1 cup cooked chickpeas, 1 cup quinoa, vegetables, tahini dressing, lemon',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Lentil salad', 'Bean & grain bowl'],
      },
      {
        name: 'Vegetable Burger with Sweet Potato Fries',
        description: 'Veggie burger (store-bought), whole grain bun, sweet potato fries, veggies',
        prepTime: '20 minutes',
        difficulty: 'Easy',
        alternatives: ['Black bean burger', 'Falafel wrap'],
      },
      {
        name: 'Lentil Soup with Whole Grain Bread',
        description: '1 serving lentil soup, 1 slice whole grain bread with hummus, side salad',
        prepTime: '10 minutes (if prepared)',
        difficulty: 'Easy',
        alternatives: ['Bean soup', 'Vegetable soup'],
      },
      {
        name: 'Greek Salad with Chickpeas & Feta',
        description: 'Mixed greens, chickpeas, feta cheese, olives, cucumber, tomato, olive oil',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Caprese salad', 'Mediterranean salad'],
      },
    ],
    dinner: [
      {
        name: 'Baked Tofu with Roasted Vegetables & Rice',
        description: '200g marinated baked tofu, roasted broccoli and carrots, 1 cup brown rice',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Tempeh stir-fry', 'Seitan with vegetables'],
      },
      {
        name: 'Lentil & Vegetable Curry with Rice',
        description: '1.5 cups cooked lentils, curry sauce, vegetables, 1 cup brown rice',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Chickpea curry', 'Bean curry'],
      },
      {
        name: 'Vegetable Stir-Fry with Cashews & Quinoa',
        description: 'Mixed vegetables, 1/4 cup cashews, 1 cup quinoa, soy-ginger sauce',
        prepTime: '20 minutes',
        difficulty: 'Easy',
        alternatives: ['Tofu stir-fry', 'Tempeh stir-fry'],
      },
      {
        name: 'Chickpea Pasta with Marinara & Greens',
        description: '1.5 cups whole wheat pasta, chickpea-based pasta, marinara, spinach',
        prepTime: '20 minutes',
        difficulty: 'Easy',
        alternatives: ['Lentil pasta', 'Bean pasta'],
      },
    ],
    snack: [
      {
        name: 'Protein Shake',
        description: 'Plant-based protein powder, banana, almond butter, almond milk',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Plant-based yogurt', 'Protein bar'],
      },
      {
        name: 'Mixed Nuts & Seeds',
        description: '1/4 cup almonds, cashews, pumpkin seeds, sunflower seeds',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Trail mix', 'Nut butter on crackers'],
      },
      {
        name: 'Hummus with Vegetable Sticks',
        description: '1/4 cup hummus, carrots, celery, bell peppers',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Guacamole with veggies', 'Tahini dip'],
      },
      {
        name: 'Greek Yogurt with Granola',
        description: '150g Greek yogurt, 1/4 cup granola, berries',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese', 'Plant-based yogurt'],
      },
    ],
  };

  const veganMeals = {
    breakfast: [
      {
        name: 'Oatmeal with Plant Protein & Berries',
        description: '1 cup oats, plant-based protein powder, mixed berries, almond milk, honey',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Smoothie bowl', 'Tofu scramble'],
      },
      {
        name: 'Tofu Scramble with Mushrooms & Toast',
        description: '150g firm tofu, mushrooms, spinach, 2 slices whole grain toast, olive oil',
        prepTime: '15 minutes',
        difficulty: 'Medium',
        alternatives: ['Chickpea scramble', 'Tempeh scramble'],
      },
      {
        name: 'Smoothie Bowl',
        description: 'Blended banana, berries, plant milk, topped with granola, coconut, seeds',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Acai bowl', 'Green smoothie bowl'],
      },
      {
        name: 'Chia Seed Pudding with Fruit',
        description: 'Chia seeds, almond milk, maple syrup, fresh fruit, granola topping',
        prepTime: '5 minutes (+ overnight)',
        difficulty: 'Very Easy',
        alternatives: ['Hemp seed pudding', 'Flax seed pudding'],
      },
    ],
    lunch: [
      {
        name: 'Chickpea & Vegetable Curry with Rice',
        description: '1 cup cooked chickpeas, curry sauce, vegetables, 1 cup brown rice',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Lentil curry', 'Tofu curry'],
      },
      {
        name: 'Lentil & Walnut Tacos',
        description: 'Seasoned cooked lentils, walnuts, whole grain tortillas, salsa, lettuce',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Black bean tacos', 'Tofu tacos'],
      },
      {
        name: 'Tempeh & Vegetable Stir-Fry with Quinoa',
        description: '150g marinated tempeh, mixed vegetables, quinoa, soy-ginger sauce',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Tofu stir-fry', 'Seitan stir-fry'],
      },
      {
        name: 'Hummus Wrap with Roasted Vegetables',
        description: 'Whole grain wrap, hummus, roasted vegetables, tahini sauce',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Falafel wrap', 'Tofu wrap'],
      },
    ],
    dinner: [
      {
        name: 'Baked Tofu with Roasted Vegetables & Farro',
        description: '200g marinated baked tofu, roasted broccoli, farro, lemon-herb dressing',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Tempeh', 'Seitan'],
      },
      {
        name: 'Lentil Bolognese with Whole Wheat Pasta',
        description: '1.5 cups cooked lentils, marinara, 1.5 cups pasta, steamed spinach',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Mushroom bolognese', 'Chickpea bolognese'],
      },
      {
        name: 'Vegetable & Black Bean Enchiladas',
        description: 'Whole grain tortillas, black beans, vegetables, salsa, cashew cream sauce',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Chickpea enchiladas', 'Bean enchiladas'],
      },
      {
        name: 'Chickpea & Spinach Curry with Coconut Rice',
        description: '1 cup chickpeas, spinach, coconut curry, coconut rice',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Tofu curry', 'Lentil curry'],
      },
    ],
    snack: [
      {
        name: 'Vegan Protein Shake',
        description: 'Plant-based protein powder, banana, almond butter, almond milk, ice',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Smoothie with nuts', 'Plant yogurt'],
      },
      {
        name: 'Mixed Nuts & Seeds',
        description: '1/4 cup almonds, cashews, pumpkin seeds, sunflower seeds',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Trail mix', 'Nut butter with fruit'],
      },
      {
        name: 'Coconut Yogurt with Berries',
        description: '150g coconut yogurt, 1/2 cup mixed berries, 1 tbsp honey/maple syrup',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Almond yogurt', 'Oat yogurt'],
      },
      {
        name: 'Fruit with Almond Butter',
        description: 'Apple or banana with 2 tbsp almond butter',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Tahini on fruit', 'Cashew butter on fruit'],
      },
    ],
  };

  const ketoMeals = {
    breakfast: [
      {
        name: 'Scrambled Eggs with Bacon & Avocado',
        description: '4 large eggs, 3 slices bacon, 1/2 avocado, butter',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Egg muffins', 'Omelet with cheese'],
      },
      {
        name: 'Greek Yogurt with Nuts & Seeds',
        description: '150g full-fat Greek yogurt, 1/4 cup nuts, 2 tbsp seeds, MCT oil',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese', 'Heavy cream with berries'],
      },
      {
        name: 'Smoked Salmon with Cream Cheese',
        description: '100g smoked salmon, 50g cream cheese, cucumber slices, capers',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Mackerel with avocado', 'Sardines with cream cheese'],
      },
      {
        name: 'Butter Coffee with MCT Oil',
        description: 'Black coffee, 1 tbsp butter, 1 tbsp MCT oil, pinch of salt',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Bulletproof coffee', 'Heavy cream coffee'],
      },
    ],
    lunch: [
      {
        name: 'Grilled Ribeye with Butter & Vegetables',
        description: '150g grilled ribeye, garlic butter, steamed broccoli and zucchini',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Salmon', 'Lamb chops'],
      },
      {
        name: 'Tuna Salad Lettuce Wraps',
        description: '150g canned tuna (in oil), mayo, celery, butter lettuce wraps',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Chicken salad', 'Egg salad'],
      },
      {
        name: 'Bacon & Cheese Burger (no bun)',
        description: '150g ground beef burger, 2 slices cheese, bacon, mayo, pickles',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Turkey burger', 'Lamb burger'],
      },
      {
        name: 'Caprese Salad with Olive Oil',
        description: 'Fresh mozzarella, tomato, basil, olive oil, balsamic (minimal)',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Spinach salad with bacon', 'Kale salad with olive oil'],
      },
    ],
    dinner: [
      {
        name: 'Grilled Salmon with Hollandaise',
        description: '150g grilled salmon, hollandaise sauce, roasted asparagus',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Halibut with butter', 'Cod with hollandaise'],
      },
      {
        name: 'Ribeye Steak with Compound Butter',
        description: '200g grilled ribeye, herb compound butter, roasted Brussels sprouts',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['NY Strip', 'Filet mignon'],
      },
      {
        name: 'Shrimp Scampi with Zucchini Noodles',
        description: '200g shrimp, garlic butter, zucchini noodles, lemon, parsley',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Scallops', 'Lobster'],
      },
      {
        name: 'Pork Chops with Creamy Mushroom Sauce',
        description: '2 pork chops, heavy cream mushroom sauce, roasted cauliflower',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Lamb chops', 'Chicken thighs'],
      },
    ],
    snack: [
      {
        name: 'Macadamia Nuts & Cheese',
        description: '1/4 cup macadamia nuts, 50g cheddar cheese, olives',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Pecans with cheese', 'Brazil nuts with cheese'],
      },
      {
        name: 'Beef Jerky & Avocado',
        description: '60g grass-fed beef jerky, 1/2 avocado, sea salt',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Biltong', 'Pepperoni slices'],
      },
      {
        name: 'Full-Fat Greek Yogurt',
        description: '150g full-fat Greek yogurt, walnuts, MCT oil',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese', 'Heavy cream'],
      },
      {
        name: 'Pork Rinds & Guacamole',
        description: '30g pork rinds, 1/2 avocado guacamole, lime juice',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cheese crisps', 'Celery with almond butter'],
      },
    ],
  };

  const paleoMeals = {
    breakfast: [
      {
        name: 'Scrambled Eggs with Bacon & Berries',
        description: '3 large eggs, 3 slices bacon, 1/2 cup blueberries, ghee',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Frittata', 'Egg scramble'],
      },
      {
        name: 'Sweet Potato Hash with Sausage',
        description: '150g sweet potato hash, 2 paleo sausages, spinach, ghee',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Root vegetable hash', 'Cauliflower hash'],
      },
      {
        name: 'Coconut Milk Smoothie',
        description: 'Full-fat coconut milk, banana, berries, almond butter, honey',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Avocado smoothie', 'Bone broth smoothie'],
      },
      {
        name: 'Grilled Fish with Fruit',
        description: '100g grilled white fish, sliced mango, raspberries, olive oil',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Salmon with fruit', 'Mackerel with berries'],
      },
    ],
    lunch: [
      {
        name: 'Grilled Chicken with Roasted Root Vegetables',
        description: '150g grilled chicken breast, roasted sweet potato and carrots, olive oil',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Beef with vegetables', 'Turkey with vegetables'],
      },
      {
        name: 'Salad with Grilled Steak & Olives',
        description: 'Mixed greens, 100g grilled steak, olives, avocado, olive oil dressing',
        prepTime: '20 minutes',
        difficulty: 'Easy',
        alternatives: ['Salmon salad', 'Turkey salad'],
      },
      {
        name: 'Paleo Lettuce Wrap',
        description: 'Butter lettuce wraps, 120g ground turkey, vegetables, coconut aminos',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Beef lettuce wraps', 'Lamb lettuce wraps'],
      },
      {
        name: 'Baked Sweet Potato with Ground Beef',
        description: 'Large baked sweet potato, 120g lean ground beef, broccoli, ghee',
        prepTime: '30 minutes',
        difficulty: 'Easy',
        alternatives: ['Yam with beef', 'Root vegetables with beef'],
      },
    ],
    dinner: [
      {
        name: 'Grilled Salmon with Asparagus & Almonds',
        description: '150g grilled salmon, roasted asparagus, sliced almonds, olive oil',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Halibut', 'Sea bass'],
      },
      {
        name: 'Slow-Cooked Beef Stew',
        description: 'Beef chuck, root vegetables, bone broth, herbs, coconut oil',
        prepTime: '120 minutes',
        difficulty: 'Medium',
        alternatives: ['Lamb stew', 'Venison stew'],
      },
      {
        name: 'Grilled Lamb Chops with Mushrooms',
        description: '2 lamb chops, sautéed mushrooms, roasted zucchini, ghee',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Beef chops', 'Bison chops'],
      },
      {
        name: 'Turkey Meatballs with Vegetables',
        description: '150g turkey meatballs (coconut flour binder), roasted vegetables',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Beef meatballs', 'Lamb meatballs'],
      },
    ],
    snack: [
      {
        name: 'Apple with Almond Butter',
        description: '1 medium apple, 2 tbsp almond butter, honey drizzle',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Banana with nut butter', 'Berries with nut butter'],
      },
      {
        name: 'Coconut & Macadamia Nuts',
        description: '1/4 cup unsweetened coconut flakes, 1/4 cup macadamia nuts',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Almonds with berries', 'Pecans with dates'],
      },
      {
        name: 'Homemade Paleo Bars',
        description: 'Dates, almonds, coconut oil, dark chocolate (optional)',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Larabars', 'Fruit and nuts'],
      },
      {
        name: 'Beef Jerky & Berries',
        description: '60g grass-fed beef jerky, 1/2 cup mixed berries',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Turkey jerky', 'Biltong'],
      },
    ],
  };

  const mediterraneanMeals = {
    breakfast: [
      {
        name: 'Greek Yogurt with Honey & Walnuts',
        description: '1 cup Greek yogurt, 1 tbsp honey, 1/4 cup walnuts, berries',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Ricotta with honey', 'Feta cheese'],
      },
      {
        name: 'Whole Grain Toast with Olive Oil & Tomatoes',
        description: '2 slices whole grain bread, olive oil, fresh tomatoes, feta, oregano',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Whole grain toast with avocado', 'Toast with cheese'],
      },
      {
        name: 'Mediterranean Omelet',
        description: '3 eggs, spinach, feta cheese, tomatoes, olives, olive oil',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Vegetable frittata', 'Egg scramble'],
      },
      {
        name: 'Whole Grain Oatmeal with Figs & Nuts',
        description: '1 cup oatmeal, 2 dried figs, 1/4 cup almonds, honey, olive oil',
        prepTime: '15 minutes',
        difficulty: 'Easy',
        alternatives: ['Barley', 'Spelt'],
      },
    ],
    lunch: [
      {
        name: 'Grilled Fish with Olive Oil & Lemon',
        description: '150g grilled sea bass or mackerel, whole grain, roasted vegetables',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Salmon', 'Halibut'],
      },
      {
        name: 'Mediterranean Chickpea Salad',
        description: '1 cup chickpeas, tomatoes, cucumber, red onion, feta, olive oil dressing',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Lentil salad', 'White bean salad'],
      },
      {
        name: 'Whole Wheat Pasta with Vegetable Sauce',
        description: '1.5 cups whole wheat pasta, tomato sauce, zucchini, spinach, herbs',
        prepTime: '20 minutes',
        difficulty: 'Easy',
        alternatives: ['Farro pasta', 'Barley'],
      },
      {
        name: 'Mediterranean Wrap',
        description: 'Whole grain wrap, hummus, feta, tomatoes, cucumber, olive oil',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Falafel wrap', 'Vegetable wrap'],
      },
    ],
    dinner: [
      {
        name: 'Baked Salmon with Herbs & Lemon',
        description: '150g baked salmon, herbs, lemon, olive oil, roasted vegetables',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Baked sea bass', 'Baked halibut'],
      },
      {
        name: 'Whole Grain Risotto with Vegetables',
        description: 'Whole grain rice, vegetable broth, spinach, tomatoes, herbs, parmesan',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Farro risotto', 'Barley risotto'],
      },
      {
        name: 'Grilled Lamb with Mediterranean Salad',
        description: '120g grilled lamb, Mediterranean salad, whole grain bread, olive oil',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Chicken', 'Beef'],
      },
      {
        name: 'Minestrone Soup with Whole Grain Bread',
        description: 'Vegetable soup with beans, whole grain pasta, herbs, olive oil',
        prepTime: '30 minutes',
        difficulty: 'Medium',
        alternatives: ['Lentil soup', 'White bean soup'],
      },
    ],
    snack: [
      {
        name: 'Mixed Olives & Almonds',
        description: '1/4 cup olives, 1/4 cup almonds, feta cheese',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Mixed nuts', 'Hummus with veggies'],
      },
      {
        name: 'Whole Grain Crackers with Hummus',
        description: '6-8 whole grain crackers, 1/4 cup hummus, lemon',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Whole wheat bread', 'Vegetable chips'],
      },
      {
        name: 'Greek Yogurt with Honey & Walnuts',
        description: '100g Greek yogurt, 1 tsp honey, 2 tbsp walnuts',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Feta cheese', 'Ricotta'],
      },
      {
        name: 'Fig & Almond Energy Balls',
        description: 'Figs, almonds, dates, olive oil, honey',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Date and walnut balls', 'Apricot and nut balls'],
      },
    ],
  };

  const lowCarbMeals = {
    breakfast: [
      {
        name: 'Scrambled Eggs with Vegetables',
        description: '3 large eggs, spinach, mushrooms, tomatoes, butter, cheese',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Omelet with vegetables', 'Egg muffins'],
      },
      {
        name: 'Full-Fat Greek Yogurt with Berries',
        description: '150g full-fat Greek yogurt, 1/2 cup berries, walnuts, stevia',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cottage cheese', 'Cream cheese'],
      },
      {
        name: 'Smoked Salmon with Cream Cheese & Veggies',
        description: '100g smoked salmon, 50g cream cheese, cucumber, avocado',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Mackerel', 'Sardines'],
      },
      {
        name: 'Low-Carb Breakfast Sausage & Vegetables',
        description: '2-3 low-carb sausages, sautéed spinach and mushrooms, butter',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Bacon with vegetables', 'Turkey sausage'],
      },
    ],
    lunch: [
      {
        name: 'Grilled Chicken with Roasted Vegetables',
        description: '150g grilled chicken, roasted broccoli, cauliflower, zucchini, olive oil',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Beef', 'Turkey'],
      },
      {
        name: 'Cobb Salad',
        description: 'Mixed greens, bacon, hard-boiled eggs, avocado, cheese, ranch dressing',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Chef salad', 'Spinach salad'],
      },
      {
        name: 'Low-Carb Lettuce Wrap Sandwich',
        description: 'Butter lettuce wraps, turkey, cheese, mayo, lettuce, tomato',
        prepTime: '5 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Beef lettuce wrap', 'Chicken lettuce wrap'],
      },
      {
        name: 'Grilled Fish with Roasted Asparagus',
        description: '150g grilled fish, roasted asparagus, lemon butter, olive oil',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Salmon', 'Halibut'],
      },
    ],
    dinner: [
      {
        name: 'Ribeye Steak with Creamed Spinach',
        description: '150g grilled ribeye, creamed spinach, cauliflower mash',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['NY Strip', 'Filet mignon'],
      },
      {
        name: 'Baked Salmon with Hollandaise & Broccoli',
        description: '150g baked salmon, hollandaise, steamed broccoli, lemon',
        prepTime: '25 minutes',
        difficulty: 'Medium',
        alternatives: ['Halibut', 'Sea bass'],
      },
      {
        name: 'Ground Turkey Taco Bowl (No Rice)',
        description: '150g ground turkey, salsa, cheese, avocado, lettuce, sour cream',
        prepTime: '10 minutes',
        difficulty: 'Easy',
        alternatives: ['Beef taco bowl', 'Chicken taco bowl'],
      },
      {
        name: 'Pork Chops with Garlic Butter & Vegetables',
        description: '2 pork chops, garlic butter, roasted zucchini and mushrooms',
        prepTime: '20 minutes',
        difficulty: 'Medium',
        alternatives: ['Lamb chops', 'Chicken thighs'],
      },
    ],
    snack: [
      {
        name: 'Cheese & Nuts',
        description: '50g cheddar or your favorite cheese, 1/4 cup almonds or pecans',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cheese and olives', 'Cheese and salami'],
      },
      {
        name: 'Celery with Almond Butter',
        description: 'Celery stalks, 2 tbsp almond butter, optional bacon bits',
        prepTime: '2 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Cucumber with dip', 'Bell pepper with guacamole'],
      },
      {
        name: 'Hard-Boiled Eggs',
        description: '2-3 hard-boiled eggs, salt, pepper, optional mayo',
        prepTime: '10 minutes (if prepared)',
        difficulty: 'Very Easy',
        alternatives: ['Deviled eggs', 'Egg salad'],
      },
      {
        name: 'Pepperoni & Cheese Slices',
        description: '1 oz pepperoni, 1 oz cheese (mozzarella or cheddar)',
        prepTime: '0 minutes',
        difficulty: 'Very Easy',
        alternatives: ['Salami and cheese', 'Prosciutto and cheese'],
      },
    ],
  };

  const mealBase =
    preference === 'vegetarian'
      ? vegetarianMeals
      : preference === 'vegan'
        ? veganMeals
        : preference === 'keto'
          ? ketoMeals
          : preference === 'paleo'
            ? paleoMeals
            : preference === 'mediterranean'
              ? mediterraneanMeals
              : preference === 'low-carb'
                ? lowCarbMeals
                : omnivoreMeals;

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
// AI COACH INTELLIGENCE
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
        let category = 'Other';
        if (
          item.includes('chicken') ||
          item.includes('beef') ||
          item.includes('turkey') ||
          item.includes('pork') ||
          item.includes('fish') ||
          item.includes('salmon') ||
          item.includes('egg')
        ) {
          category = 'Proteins';
        } else if (
          item.includes('rice') ||
          item.includes('pasta') ||
          item.includes('bread') ||
          item.includes('oat')
        ) {
          category = 'Grains & Carbs';
        } else if (
          item.includes('broccoli') ||
          item.includes('spinach') ||
          item.includes('vegetable') ||
          item.includes('carrot') ||
          item.includes('lettuce')
        ) {
          category = 'Vegetables';
        } else if (item.includes('berry') || item.includes('apple') || item.includes('banana')) {
          category = 'Fruits';
        } else if (item.includes('oil') || item.includes('butter') || item.includes('cheese')) {
          category = 'Oils & Dairy';
        } else if (item.includes('nut') || item.includes('seed') || item.includes('almond')) {
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

function generatePersonalizedAdvice(goal, experience, age, gender) {
  const advicesByGoal = {
    'build-muscle': [
      `Focus on progressive overload — add 1-2 reps or 5-10 lbs weekly. Sleep 7-9 hours daily. Consistency beats intensity. Track your lifts.`,
      `Prioritize compound movements. Don't chase the pump; focus on strength and volume. Quality form prevents injury and maximizes gains.`,
      `Eat protein with every meal (1.6-2.2g per kg). A surplus is essential, but don't overeat — aim for 0.5-1 lb/week weight gain.`,
    ],
    'lose-weight': [
      `Maintain a moderate deficit (-300-500 cal). Too aggressive causes muscle loss and metabolic adaptation. Target 0.5-1 lb/week loss.`,
      `Prioritize protein to preserve muscle during fat loss. Hitting macros matters more than food quality. Stay consistent.`,
      `Maintain or increase strength in the gym. Don't do excessive cardio — 150-200 min/week is sufficient. Adherence > Perfection.`,
    ],
    endurance: [
      `Build aerobic base with steady-state cardio first. Add interval training gradually. Recovery is crucial for endurance adaptations.`,
      `Fuel adequately before and after training. Hydration strategy is critical for performance. Listen to your body.`,
      `Combine different intensities: easy days, tempo work, and hard intervals. Periodize training to avoid overtraining.`,
    ],
    flexibility: [
      `Consistency matters more than intensity. Stretch all major muscle groups daily. Improve mobility gradually over weeks/months.`,
      `Focus on breathing and body awareness. Don't push into pain. Breathe deeply during stretches for maximum benefit.`,
      `Combine flexibility work with light strength training to prevent injury. A flexible body is resilient.`,
    ],
    'general-fitness': [
      `Aim for consistency and sustainability. Exercise 3-5 days per week. Find movements that feel good and match your lifestyle.`,
      `Balance training, nutrition, sleep, and stress management. These pillars matter equally. Listen to your body.`,
      `If something hurts, rest. If a program feels unsustainable, modify it. Long-term consistency beats short-term perfection.`,
    ],
    performance: [
      `Periodize your training: build base strength, then add power and speed work. Deload every 4-6 weeks for recovery.`,
      `Sport-specific movements should match your goals. Work on weak links first. Video your lifts to check form.`,
      `Combine training with adequate sleep and nutrition. Performance athletes recover hard. Rest days are training days.`,
    ],
  };

  const adviceList = advicesByGoal[goal] || advicesByGoal['general-fitness'];
  return adviceList[Math.floor(Math.random() * adviceList.length)];
}

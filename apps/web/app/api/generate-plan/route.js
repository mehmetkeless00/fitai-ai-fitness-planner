import { generateSmartPlan, translations } from '@fitflow/core';

export async function POST(request) {
  let lang = 'en';
  try {
    const userProfile = await request.json();
    lang = userProfile.lang === 'tr' ? 'tr' : 'en';
    const errs = (translations[lang] || translations.en).createPlan;

    // Validate and parse numeric fields
    const age = parseInt(userProfile.age);
    const height = parseInt(userProfile.height);
    const weight = parseInt(userProfile.weight);
    const frequency = parseInt(userProfile.frequency);

    const validationErrors = [];

    if (!userProfile.age || isNaN(age) || age < 13 || age > 100) {
      validationErrors.push(errs.personalInfo.errors.age);
    }
    if (!userProfile.gender) {
      validationErrors.push(errs.personalInfo.errors.gender);
    }
    if (!userProfile.height || isNaN(height) || height < 100 || height > 250) {
      validationErrors.push(errs.personalInfo.errors.height);
    }
    if (!userProfile.weight || isNaN(weight) || weight < 30 || weight > 300) {
      validationErrors.push(errs.personalInfo.errors.weight);
    }
    if (!userProfile.fitnessGoal) {
      validationErrors.push(errs.goals.errors.fitnessGoal);
    }
    if (!userProfile.experience) {
      validationErrors.push(errs.goals.errors.experience);
    }
    if (!userProfile.frequency || isNaN(frequency) || frequency < 3 || frequency > 7) {
      validationErrors.push(errs.goals.errors.frequency);
    }
    if (!userProfile.dietaryPreference) {
      validationErrors.push(errs.preferences.errors.dietaryPreference);
    }

    if (validationErrors.length > 0) {
      return Response.json(
        {
          success: false,
          error: validationErrors[0],
        },
        { status: 400 }
      );
    }

    const plan = generateSmartPlan({
      age,
      gender: userProfile.gender,
      height,
      weight,
      fitnessGoal: userProfile.fitnessGoal,
      experience: userProfile.experience,
      frequency,
      dietaryPreference: userProfile.dietaryPreference,
      allergies: userProfile.allergies || '',
      lang,
    });

    // Simulate API delay for better UX (feels like real generation)
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    return Response.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error('Error generating plan:', error);

    return Response.json(
      {
        success: false,
        error: (translations[lang] || translations.en).createPlan.genericError,
      },
      { status: 500 }
    );
  }
}

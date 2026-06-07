import { generateSmartPlan } from '@/utils/generateSmartPlan';

export async function POST(request) {
  try {
    const userProfile = await request.json();

    // Validate and parse numeric fields
    const age = parseInt(userProfile.age);
    const height = parseInt(userProfile.height);
    const weight = parseInt(userProfile.weight);
    const frequency = parseInt(userProfile.frequency);

    const validationErrors = [];

    if (!userProfile.age || isNaN(age) || age < 13 || age > 100) {
      validationErrors.push('Age must be between 13 and 100');
    }
    if (!userProfile.gender) {
      validationErrors.push('Gender is required');
    }
    if (!userProfile.height || isNaN(height) || height < 100 || height > 250) {
      validationErrors.push('Height must be between 100 and 250 cm');
    }
    if (!userProfile.weight || isNaN(weight) || weight < 30 || weight > 300) {
      validationErrors.push('Weight must be between 30 and 300 kg');
    }
    if (!userProfile.fitnessGoal) {
      validationErrors.push('Fitness goal is required');
    }
    if (!userProfile.experience) {
      validationErrors.push('Experience level is required');
    }
    if (!userProfile.frequency || isNaN(frequency) || frequency < 3 || frequency > 7) {
      validationErrors.push('Workout frequency must be between 3 and 7 days per week');
    }
    if (!userProfile.dietaryPreference) {
      validationErrors.push('Dietary preference is required');
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
        error: 'Failed to generate personalized plan. Please check your inputs and try again.',
      },
      { status: 500 }
    );
  }
}

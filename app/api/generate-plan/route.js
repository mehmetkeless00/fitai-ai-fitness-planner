import { generateSmartPlan } from '@/utils/generateSmartPlan';

export async function POST(request) {
  try {
    const userProfile = await request.json();

    // Validate required fields
    if (
      !userProfile.age ||
      !userProfile.gender ||
      !userProfile.height ||
      !userProfile.weight ||
      !userProfile.fitnessGoal ||
      !userProfile.experience ||
      !userProfile.frequency ||
      !userProfile.dietaryPreference
    ) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Convert frequency string to number
    const frequency = parseInt(userProfile.frequency);

    // Generate plan using rule-based algorithm
    const plan = generateSmartPlan({
      age: parseInt(userProfile.age),
      gender: userProfile.gender,
      height: parseInt(userProfile.height),
      weight: parseInt(userProfile.weight),
      fitnessGoal: userProfile.fitnessGoal,
      experience: userProfile.experience,
      frequency: frequency,
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

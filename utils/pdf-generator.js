import { jsPDF } from 'jspdf';

export function generatePlanPDF(planData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  const colors = {
    primary: [14, 165, 233],
    dark: [15, 23, 42],
    text: [255, 255, 255],
    lightText: [148, 163, 184],
  };

  const addText = (text, fontSize = 12, isBold = false, color = colors.text) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    if (isBold) doc.setFont(undefined, 'bold');
    else doc.setFont(undefined, 'normal');
    doc.text(text, 20, yPosition);
    yPosition += fontSize / 2 + 2;
  };

  const addSection = (title) => {
    yPosition += 5;
    doc.setFillColor(...colors.primary);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    doc.setFontSize(14);
    doc.setTextColor(...colors.text);
    doc.setFont(undefined, 'bold');
    doc.text(title, 25, yPosition + 1);
    yPosition += 12;
  };

  const checkPageBreak = (minSpace = 30) => {
    if (yPosition + minSpace > pageHeight - 10) {
      doc.addPage();
      yPosition = 20;
    }
  };

  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFontSize(24);
  doc.setTextColor(...colors.primary);
  doc.setFont(undefined, 'bold');
  doc.text('FitFlow - Your Personal Fitness Plan', 20, 18);
  yPosition = 40;

  addSection('📋 Your Profile');
  checkPageBreak(40);

  const profileData = [
    ['Age', planData.age],
    ['Gender', planData.gender?.charAt(0).toUpperCase() + planData.gender?.slice(1)],
    ['Height', `${planData.height} cm`],
    ['Weight', `${planData.weight} kg`],
    ['Fitness Goal', planData.fitnessGoal?.replace(/-/g, ' ')],
    ['Experience', planData.experience?.charAt(0).toUpperCase() + planData.experience?.slice(1)],
    ['Workout Frequency', `${planData.frequency} days/week`],
    ['Dietary Preference', planData.dietaryPreference?.replace(/-/g, ' ')],
  ];

  profileData.forEach(([label, value]) => {
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, 25, yPosition);

    doc.setTextColor(...colors.lightText);
    doc.setFont(undefined, 'normal');
    doc.text(String(value), 80, yPosition);
    yPosition += 7;
  });

  if (planData.allergies) {
    yPosition += 3;
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('Allergies & Restrictions:', 25, yPosition);
    doc.setTextColor(...colors.lightText);
    doc.setFont(undefined, 'normal');
    doc.text(planData.allergies, 80, yPosition);
    yPosition += 7;
  }

  checkPageBreak(50);
  addSection('📊 Daily Nutrition Summary');

  const nutritionStats = [
    {
      label: 'Calories',
      value: `${planData.dailyCalories ? planData.dailyCalories.toLocaleString() : '2,500'} kcal`,
    },
    {
      label: 'Protein',
      value: `${planData.macros?.protein?.grams || 180}g (${planData.macros?.protein?.percentage || 28}%)`,
    },
    {
      label: 'Carbs',
      value: `${planData.macros?.carbs?.grams || 300}g (${planData.macros?.carbs?.percentage || 48}%)`,
    },
    {
      label: 'Fat',
      value: `${planData.macros?.fat?.grams || 85}g (${planData.macros?.fat?.percentage || 24}%)`,
    },
  ];

  doc.setFontSize(11);
  nutritionStats.forEach(({ label, value }, idx) => {
    const xPos = idx % 2 === 0 ? 25 : pageWidth / 2 + 10;
    const yPos = idx < 2 ? yPosition : yPosition + 15;

    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, xPos, yPos);

    doc.setTextColor(...colors.lightText);
    doc.setFont(undefined, 'normal');
    doc.text(value, xPos + 40, yPos);
  });

  yPosition += 35;

  checkPageBreak(80);
  addSection('💪 Weekly Workout Plan');

  const workoutPlan = planData.workoutPlan || [];

  workoutPlan.forEach((dayPlan) => {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(`${dayPlan.day}${dayPlan.focus ? ' - ' + dayPlan.focus : ''}`, 25, yPosition);
    yPosition += 7;

    if (dayPlan.exercises && dayPlan.exercises.length > 0) {
      dayPlan.exercises.forEach((exercise) => {
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        doc.setFont(undefined, 'normal');
        const exerciseText = `${exercise.name} - ${exercise.sets}x${exercise.reps}`;
        doc.text(`• ${exerciseText}`, 30, yPosition);
        yPosition += 5;
      });
    }

    yPosition += 3;
  });

  checkPageBreak(80);
  addSection('🥗 Weekly Meal Plan');

  const mealPlan = planData.mealPlan || [];

  mealPlan.forEach((dayPlan) => {
    checkPageBreak(35);
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(dayPlan.day, 25, yPosition);
    yPosition += 7;

    if (dayPlan.meals) {
      Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
        doc.setFontSize(10);
        doc.setTextColor(...colors.primary);
        doc.setFont(undefined, 'bold');
        doc.text(`${mealType}:`, 30, yPosition);

        doc.setTextColor(...colors.lightText);
        doc.setFont(undefined, 'normal');

        let mealText = '';

        if (typeof meal === 'string') {
          mealText = meal;
        } else if (typeof meal === 'object' && meal !== null) {
          const p = meal.macros?.protein || meal.protein || 0;
          const c = meal.macros?.carbs || meal.carbs || 0;
          const f = meal.macros?.fat || meal.fat || 0;
          mealText = `${meal.name || 'Meal'} (${meal.calories || 0} kcal, P:${p}g C:${c}g F:${f}g)`;
        } else {
          mealText = 'Not available';
        }

        doc.text(mealText, 60, yPosition);
        yPosition += 8;
      });
    }

    yPosition += 3;
  });

  checkPageBreak(15);
  yPosition += 5;
  doc.setFontSize(9);
  doc.setTextColor(...colors.lightText);
  doc.text('Generated by FitFlow - Your Personal Fitness Coach', 20, yPosition);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 5);

  const filename = `FitFlow-Plan-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

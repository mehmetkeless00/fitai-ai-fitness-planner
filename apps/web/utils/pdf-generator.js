import { jsPDF } from 'jspdf';
import { translations } from '@fitflow/core';

// Looks up the display label for an enum value (e.g. 'lose-weight' -> 'Kilo Ver')
// from the translated option lists. Falls back to the raw value.
function optionLabel(options, value) {
  return options?.find((o) => o.value === value)?.label || value || '-';
}

export async function generatePlanPDF(planData, lang = 'en') {
  const t = translations[lang] || translations.en;
  const L = t.pdf;
  const maps = t.maps;

  const doc = new jsPDF();

  // jsPDF's built-in fonts cannot render Turkish glyphs (ğ, ş, ı, İ),
  // so we embed Open Sans. Dynamically imported to keep it out of the page bundle.
  const { openSansRegular, openSansBold } = await import('./pdfFonts');
  doc.addFileToVFS('OpenSans-Regular.ttf', openSansRegular);
  doc.addFont('OpenSans-Regular.ttf', 'OpenSans', 'normal');
  doc.addFileToVFS('OpenSans-Bold.ttf', openSansBold);
  doc.addFont('OpenSans-Bold.ttf', 'OpenSans', 'bold');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  const colors = {
    primary: [14, 165, 233],
    dark: [15, 23, 42],
    white: [255, 255, 255],
    text: [51, 65, 85],
    mutedText: [100, 116, 139],
  };

  const setFont = (style = 'normal') => doc.setFont('OpenSans', style);

  const checkPageBreak = (minSpace = 30) => {
    if (yPosition + minSpace > pageHeight - 12) {
      doc.addPage();
      yPosition = 20;
    }
  };

  const addSection = (title) => {
    checkPageBreak(25);
    yPosition += 5;
    doc.setFillColor(...colors.primary);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    doc.setFontSize(13);
    doc.setTextColor(...colors.white);
    setFont('bold');
    doc.text(title, 25, yPosition + 1);
    yPosition += 12;
  };

  // Writes wrapped body text, breaking pages as needed.
  const addWrappedText = (text, x, maxWidth, fontSize = 10, color = colors.text) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    setFont('normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      checkPageBreak(10);
      doc.text(line, x, yPosition);
      yPosition += fontSize / 2 + 1.5;
    });
  };

  // ---- Header banner ----
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFontSize(20);
  doc.setTextColor(...colors.primary);
  setFont('bold');
  doc.text(L.title, 20, 18);
  yPosition = 40;

  // ---- Profile ----
  addSection(L.profile);

  const profileData = [
    [L.age, planData.age],
    [L.gender, optionLabel(t.createPlan.personalInfo.genderOptions, planData.gender)],
    [L.height, `${planData.height} cm`],
    [L.weight, `${planData.weight} kg`],
    [L.fitnessGoal, optionLabel(t.createPlan.goals.goalOptions, planData.fitnessGoal)],
    [L.experience, optionLabel(t.createPlan.goals.expOptions, planData.experience)],
    [L.frequency, `${planData.frequency} ${L.daysPerWeek}`],
    [L.diet, optionLabel(t.createPlan.preferences.dietOptions, planData.dietaryPreference)],
  ];

  if (planData.allergies) {
    profileData.push([L.allergies, planData.allergies]);
  }

  profileData.forEach(([label, value]) => {
    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    setFont('bold');
    doc.text(`${label}:`, 25, yPosition);

    doc.setTextColor(...colors.text);
    setFont('normal');
    doc.text(String(value ?? '-'), 85, yPosition);
    yPosition += 7;
  });

  // ---- Nutrition summary ----
  checkPageBreak(50);
  addSection(L.nutrition);

  const nutritionStats = [
    {
      label: L.calories,
      value: `${planData.dailyCalories ? planData.dailyCalories.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') : '-'} kcal`,
    },
    {
      label: L.protein,
      value: `${planData.macros?.protein?.grams ?? '-'}g (${planData.macros?.protein?.percentage ?? '-'}%)`,
    },
    {
      label: L.carbs,
      value: `${planData.macros?.carbs?.grams ?? '-'}g (${planData.macros?.carbs?.percentage ?? '-'}%)`,
    },
    {
      label: L.fat,
      value: `${planData.macros?.fat?.grams ?? '-'}g (${planData.macros?.fat?.percentage ?? '-'}%)`,
    },
  ];

  doc.setFontSize(11);
  nutritionStats.forEach(({ label, value }, idx) => {
    const xPos = idx % 2 === 0 ? 25 : pageWidth / 2 + 10;
    const yPos = idx < 2 ? yPosition : yPosition + 10;

    doc.setTextColor(...colors.primary);
    setFont('bold');
    doc.text(`${label}:`, xPos, yPos);

    doc.setTextColor(...colors.text);
    setFont('normal');
    doc.text(value, xPos + 38, yPos);
  });

  yPosition += 25;

  // ---- Weekly workout plan ----
  checkPageBreak(60);
  addSection(L.workoutPlan);

  (planData.workoutPlan || []).forEach((dayPlan) => {
    checkPageBreak(28);
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    setFont('bold');
    const dayName = maps.days[dayPlan.day] || dayPlan.day;
    const focus = dayPlan.focus ? ` — ${maps.workoutFocus[dayPlan.focus] || dayPlan.focus}` : '';
    doc.text(`${dayName}${focus}`, 25, yPosition);
    yPosition += 7;

    if (dayPlan.exercises && dayPlan.exercises.length > 0) {
      dayPlan.exercises.forEach((exercise) => {
        checkPageBreak(8);
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        setFont('normal');
        doc.text(`• ${exercise.name} — ${exercise.sets}x${exercise.reps}`, 30, yPosition);
        yPosition += 5;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(...colors.mutedText);
      setFont('normal');
      doc.text(`• ${L.restDay}`, 30, yPosition);
      yPosition += 5;
    }

    yPosition += 3;
  });

  // ---- Weekly meal plan ----
  checkPageBreak(60);
  addSection(L.mealPlan);

  (planData.mealPlan || []).forEach((dayPlan) => {
    checkPageBreak(32);
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    setFont('bold');
    doc.text(maps.days[dayPlan.day] || dayPlan.day, 25, yPosition);
    yPosition += 7;

    if (dayPlan.meals) {
      Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
        checkPageBreak(14);
        doc.setFontSize(10);
        doc.setTextColor(...colors.primary);
        setFont('bold');
        doc.text(`${maps.mealTypes[mealType] || mealType}:`, 30, yPosition);

        let mealText = '';
        if (typeof meal === 'string') {
          mealText = meal;
        } else if (typeof meal === 'object' && meal !== null) {
          const p = meal.macros?.protein ?? meal.protein ?? 0;
          const c = meal.macros?.carbs ?? meal.carbs ?? 0;
          const f = meal.macros?.fat ?? meal.fat ?? 0;
          mealText = `${meal.name || '-'} (${meal.calories || 0} kcal, P:${p}g C:${c}g F:${f}g)`;
        } else {
          mealText = '-';
        }

        const textX = 62;
        doc.setTextColor(...colors.text);
        setFont('normal');
        const lines = doc.splitTextToSize(mealText, pageWidth - textX - 15);
        doc.text(lines, textX, yPosition);
        yPosition += lines.length * 5 + 2;
      });
    }

    yPosition += 3;
  });

  // ---- Coach advice ----
  if (planData.advice) {
    checkPageBreak(35);
    addSection(L.coachAdvice);
    addWrappedText(planData.advice, 25, pageWidth - 50, 11);
    yPosition += 3;
  }

  // ---- Grocery list ----
  if (planData.groceryList && Object.keys(planData.groceryList).length > 0) {
    checkPageBreak(40);
    addSection(L.groceryList);

    Object.entries(planData.groceryList).forEach(([category, items]) => {
      if (!items || items.length === 0) return;
      checkPageBreak(16);
      doc.setFontSize(11);
      doc.setTextColor(...colors.primary);
      setFont('bold');
      doc.text(maps.groceryCategories[category] || category, 25, yPosition);
      yPosition += 6;
      addWrappedText(items.join(', '), 30, pageWidth - 55, 10);
      yPosition += 3;
    });
  }

  // ---- Footer ----
  checkPageBreak(18);
  yPosition += 5;
  doc.setFontSize(9);
  doc.setTextColor(...colors.mutedText);
  setFont('normal');
  doc.text(L.generatedBy, 20, yPosition);
  const dateStr = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US');
  doc.text(`${L.generatedOn}: ${dateStr}`, 20, yPosition + 5);

  const filename = `FitFlow-Plan-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

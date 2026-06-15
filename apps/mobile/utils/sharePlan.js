import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { translations } from '@fitflow/core';
import { formatDate } from './formatDate';

const GOAL_LABELS = {
  en: {
    'lose-weight': 'Lose Weight', 'build-muscle': 'Build Muscle',
    maintenance: 'Maintain', endurance: 'Endurance',
    flexibility: 'Flexibility', performance: 'Performance', 'general-fitness': 'General Fitness',
  },
  tr: {
    'lose-weight': 'Kilo Ver', 'build-muscle': 'Kas Yap',
    maintenance: 'Korumak', endurance: 'Dayanıklılık',
    flexibility: 'Esneklik', performance: 'Performans', 'general-fitness': 'Genel Fitness',
  },
};

function buildHTML(plan, lang) {
  const data = plan.data || {};
  const coreTr = translations[lang] || translations.en;
  const pdf = coreTr.pdf;
  const maps = coreTr.maps;
  const macros = data.macros || {};
  const workoutPlan = data.workoutPlan || [];
  const mealPlan = data.mealPlan || [];
  const disclaimer = coreTr.result.disclaimer;
  const dateStr = formatDate(plan.createdAt || new Date().toISOString(), lang);
  const goalStr = (GOAL_LABELS[lang] || GOAL_LABELS.en)[data.fitnessGoal] || '';

  const workoutRows = workoutPlan.map((day) => {
    const dayLabel = maps.days[day.day] || day.day;
    const focusLabel = maps.workoutFocus[day.focus] || day.focus || pdf.restDay;
    const isRest = !day.exercises || day.exercises.length === 0;
    const exerciseList = isRest
      ? `<em>${pdf.restDay}</em>`
      : day.exercises.map((ex) => `${ex.name} — ${ex.sets}×${ex.reps}`).join('<br>');
    return `<tr>
      <td style="min-width:90px"><b>${dayLabel}</b><br><small style="color:#64748b">${focusLabel}</small></td>
      <td>${exerciseList}</td>
    </tr>`;
  }).join('');

  const mealSection = mealPlan.map((day) => {
    const dayLabel = maps.days[day.day] || day.day;
    const meals = day.meals || {};
    const rows = Object.entries(meals).map(([slot, meal]) => {
      if (!meal) return '';
      const slotLabel = maps.mealTypes[slot] || slot;
      return `<tr><td>${slotLabel}</td><td>${meal.name || ''}</td><td style="text-align:right">${meal.calories || ''}kcal</td></tr>`;
    }).join('');
    return `<h3 style="margin:16px 0 6px;color:#475569">${dayLabel}</h3>
      <table><thead><tr><th>Type</th><th>Meal</th><th>Kcal</th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body{font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#1e293b;font-size:13px}
  h1{color:#0ea5e9;font-size:22px;margin-bottom:2px}
  h2{font-size:16px;margin-top:28px;margin-bottom:8px;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:4px}
  h3{font-size:13px;margin:16px 0 4px;color:#475569}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  th{background:#f1f5f9;text-align:left;padding:7px 10px;font-size:11px;color:#475569}
  td{padding:7px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top}
  .stats{display:flex;gap:24px;flex-wrap:wrap;margin:12px 0}
  .stat b{display:block;font-size:22px;color:#0ea5e9}
  .stat span{font-size:11px;color:#64748b}
  footer{margin-top:40px;font-size:10px;color:#94a3b8;text-align:center;border-top:1px solid #f1f5f9;padding-top:12px}
  .disclaimer{font-size:11px;color:#94a3b8;margin-top:24px;font-style:italic}
</style>
</head>
<body>
  <h1>${pdf.title}</h1>
  <p style="color:#64748b;font-size:12px">${pdf.generatedOn} ${dateStr}${goalStr ? ` · ${goalStr}` : ''}</p>

  <h2>${pdf.nutrition}</h2>
  <div class="stats">
    <div class="stat"><b>${data.dailyCalories ?? '—'}</b><span>${pdf.calories}</span></div>
    <div class="stat"><b>${macros.protein?.grams ?? '—'}g</b><span>${pdf.protein}</span></div>
    <div class="stat"><b>${macros.carbs?.grams ?? '—'}g</b><span>${pdf.carbs}</span></div>
    <div class="stat"><b>${macros.fat?.grams ?? '—'}g</b><span>${pdf.fat}</span></div>
  </div>

  <h2>${pdf.workoutPlan}</h2>
  <table>
    <thead><tr><th style="width:30%">Day</th><th>Exercises</th></tr></thead>
    <tbody>${workoutRows}</tbody>
  </table>

  <h2>${pdf.mealPlan}</h2>
  ${mealSection}

  <p class="disclaimer">${disclaimer}</p>
  <footer>${pdf.generatedBy}</footer>
</body>
</html>`;
}

export async function sharePlan(plan, lang) {
  const html = buildHTML(plan, lang);
  const { uri } = await Print.printToFileAsync({ html });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
  }
}

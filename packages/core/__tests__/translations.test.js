import { describe, it, expect } from 'vitest';
import translations from '../src/translations.js';

// Recursively collect "key paths" so a missing nested key reports its exact location.
function keyPaths(obj, prefix = '') {
  if (Array.isArray(obj)) {
    // Arrays must match in length; their items are checked structurally below
    return [`${prefix}[len:${obj.length}]`];
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).flatMap((k) => keyPaths(obj[k], prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('translations dictionary parity', () => {
  it('exposes en and tr', () => {
    expect(Object.keys(translations).sort()).toEqual(['en', 'tr']);
  });

  it('tr covers every en key (and vice versa)', () => {
    const en = keyPaths(translations.en).sort();
    const tr = keyPaths(translations.tr).sort();

    const missingInTr = en.filter((k) => !tr.includes(k));
    const missingInEn = tr.filter((k) => !en.includes(k));

    expect(missingInTr, `keys missing in tr: ${missingInTr.join(', ')}`).toEqual([]);
    expect(missingInEn, `keys missing in en: ${missingInEn.join(', ')}`).toEqual([]);
  });

  it('option lists keep identical values across languages (labels translate, values must not)', () => {
    const pairs = [
      [translations.en.createPlan.goals.goalOptions, translations.tr.createPlan.goals.goalOptions],
      [translations.en.createPlan.goals.expOptions, translations.tr.createPlan.goals.expOptions],
      [
        translations.en.createPlan.preferences.dietOptions,
        translations.tr.createPlan.preferences.dietOptions,
      ],
      [
        translations.en.createPlan.personalInfo.genderOptions,
        translations.tr.createPlan.personalInfo.genderOptions,
      ],
    ];
    for (const [en, tr] of pairs) {
      expect(en.map((o) => o.value)).toEqual(tr.map((o) => o.value));
    }
  });

  it('enum maps translate the same set of keys', () => {
    for (const map of ['days', 'mealTypes', 'intensity', 'exerciseType', 'difficulty', 'workoutFocus', 'groceryCategories', 'habitTips', 'riskFlags', 'hydrationReminders']) {
      expect(Object.keys(translations.tr.maps[map]).sort(), `maps.${map}`).toEqual(
        Object.keys(translations.en.maps[map]).sort()
      );
    }
  });
});

'use client';

import { useState } from 'react';
import { getExerciseDemo, getCategoryEmoji } from '@fitflow/core';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function ExerciseDemo({ exerciseName, muscleGroups = [], exerciseType = '' }) {
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLanguage();
  const s = t.exerciseDemo;
  const demo = getExerciseDemo(exerciseName);

  let displayDemo = demo;

  if (!displayDemo) {
    displayDemo = inferCategoryDemo(exerciseName, muscleGroups, exerciseType);
  }

  if (!displayDemo) {
    return null;
  }

  const categoryEmoji = getCategoryEmoji(displayDemo.category);
  const categoryLabel = s.categories[displayDemo.category] || s.categories.exercise;

  return (
    <div className="space-y-3">
      <div
        className="relative h-32 rounded-xl border flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${displayDemo.color}0a 0%, ${displayDemo.color}1a 100%)`,
          borderColor: displayDemo.color + '35',
        }}
      >
        <span
          className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ backgroundColor: displayDemo.color + '20', color: displayDemo.color }}
        >
          {categoryLabel}
        </span>
        <div className="text-center">
          <div className="text-5xl drop-shadow-sm">{categoryEmoji}</div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={showInstructions}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowInstructions((prev) => !prev);
        }}
        className="w-full text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-2 px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg border border-transparent hover:border-sky-200 dark:hover:border-sky-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span
          className={`inline-block transition-transform duration-200 ${showInstructions ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          ▶
        </span>
        <span>{s.howToPerform}</span>
      </button>

      {showInstructions && displayDemo.instructions && (
        <div className="bg-sky-50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 rounded-lg p-3 space-y-2">
          <div className="space-y-2">
            <div>
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">{s.setup}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">{displayDemo.instructions.setup}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">{s.movement}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">{displayDemo.instructions.movement}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">{s.breathing}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">{displayDemo.instructions.breathing}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">{s.commonMistake}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">{displayDemo.instructions.commonMistake}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">{s.safetyTip}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">{displayDemo.instructions.safety}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function inferCategoryDemo(exerciseName, muscleGroups, exerciseType) {
  const name = (exerciseName || '').toLowerCase();

  const categoryMap = {
    chest: {
      category: 'chest',
      color: '#3b82f6',
      instructions: {
        setup: 'Position yourself at the equipment with proper posture and grip',
        movement: 'Press or move weight away from body in a controlled manner',
        breathing: 'Exhale during the pushing phase, inhale during the return',
        commonMistake: 'Not using full range of motion or letting elbows flare out excessively',
        safety: 'Control the weight throughout, keep shoulders stable'
      }
    },
    back: {
      category: 'back',
      color: '#8b5cf6',
      instructions: {
        setup: 'Maintain neutral spine and engage your core',
        movement: 'Pull or row the weight while retracting shoulder blades',
        breathing: 'Exhale while pulling, inhale while extending',
        commonMistake: 'Rounding your lower back or using momentum instead of strength',
        safety: 'Keep your spine neutral, do not hyperextend lower back'
      }
    },
    legs: {
      category: 'legs',
      color: '#ef4444',
      instructions: {
        setup: 'Position feet shoulder-width apart with proper alignment',
        movement: 'Lower and raise your body through hip and knee extension',
        breathing: 'Inhale during descent, exhale during ascent',
        commonMistake: 'Knees caving inward or not achieving proper depth',
        safety: 'Keep knees tracking over toes, maintain upright torso'
      }
    },
    shoulders: {
      category: 'shoulders',
      color: '#06b6d4',
      instructions: {
        setup: 'Stand upright with core engaged and shoulders relaxed',
        movement: 'Raise weight overhead or to sides in a controlled arc',
        breathing: 'Exhale while raising, inhale while lowering',
        commonMistake: 'Arching lower back excessively or using too much weight',
        safety: 'Brace your core, avoid hyperextending lower back'
      }
    },
    arms: {
      category: 'arms',
      color: '#f59e0b',
      instructions: {
        setup: 'Keep elbows pinned to your sides or in fixed position',
        movement: 'Flex or extend at the elbow joint through controlled motion',
        breathing: 'Exhale during the effort phase, inhale during the return',
        commonMistake: 'Swinging the weight or moving elbows away from body',
        safety: 'Control the eccentric (lowering) phase, use manageable weight'
      }
    },
    cardio: {
      category: 'cardio',
      color: '#10b981',
      instructions: {
        setup: 'Ensure proper footwear and maintain upright posture',
        movement: 'Maintain steady rhythm and controlled pace throughout',
        breathing: 'Match breathing to your stride or pace naturally',
        commonMistake: 'Starting too fast or poor posture causing fatigue',
        safety: 'Warm up properly and stay hydrated'
      }
    },
    fullbody: {
      category: 'fullbody',
      color: '#ec4899',
      instructions: {
        setup: 'Engage your core and maintain neutral spine alignment',
        movement: 'Move through multiple joints using coordinated effort',
        breathing: 'Breathe steadily throughout, avoid holding breath',
        commonMistake: 'Rounding lower back or losing tension in core',
        safety: 'Use proper form over heavy weight, engage entire body'
      }
    },
    flexibility: {
      category: 'flexibility',
      color: '#6366f1',
      instructions: {
        setup: 'Move slowly into position with mindful body awareness',
        movement: 'Hold position at mild tension, relax into the stretch',
        breathing: 'Breathe deeply and slowly throughout the hold',
        commonMistake: 'Bouncing or forcing yourself into painful range',
        safety: 'Stretch only to mild discomfort, never into sharp pain'
      }
    }
  };

  let category = null;

  if (muscleGroups && muscleGroups.length > 0) {
    const muscleGroup = muscleGroups[0]?.toLowerCase();
    if (muscleGroup?.includes('chest') || muscleGroup?.includes('pec')) category = 'chest';
    else if (muscleGroup?.includes('back') || muscleGroup?.includes('lats')) category = 'back';
    else if (muscleGroup?.includes('leg') || muscleGroup?.includes('quad') || muscleGroup?.includes('glute')) category = 'legs';
    else if (muscleGroup?.includes('shoulder') || muscleGroup?.includes('delt')) category = 'shoulders';
    else if (muscleGroup?.includes('bicep') || muscleGroup?.includes('tricep') || muscleGroup?.includes('arm')) category = 'arms';
  }

  if (!category) {
    if (name.includes('squat') || name.includes('leg') || name.includes('lunge') || name.includes('press') && name.includes('leg')) category = 'legs';
    else if (name.includes('bench') || name.includes('fly') || name.includes('push')) category = 'chest';
    else if (name.includes('row') || name.includes('pull') || name.includes('lat')) category = 'back';
    else if (name.includes('press') || name.includes('raise')) category = 'shoulders';
    else if (name.includes('curl') || name.includes('dip') || name.includes('tricep') || name.includes('bicep')) category = 'arms';
    else if (name.includes('deadlift') || name.includes('farmer')) category = 'fullbody';
    else if (name.includes('run') || name.includes('walk') || name.includes('cardio') || name.includes('cycle')) category = 'cardio';
    else if (name.includes('stretch') || name.includes('yoga') || name.includes('mobility')) category = 'flexibility';
  }

  if (!category && exerciseType?.toLowerCase() === 'compound') category = 'fullbody';

  return category ? categoryMap[category] : categoryMap['fullbody'];
}

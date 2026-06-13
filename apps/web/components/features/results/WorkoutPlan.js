'use client';

import { useState } from 'react';
import Card from '../../ui/Card';
import ExerciseDemo from './ExerciseDemo';
import { getExerciseDemo } from '@fitflow/core';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function WorkoutPlan({ plan, onPlanChange }) {
  const [expandedDay, setExpandedDay] = useState(0);
  const [expandedAlternatives, setExpandedAlternatives] = useState({});
  const { t } = useLanguage();
  const s = t.workoutPlan;
  const m = t.maps;

  // Promotes a random alternative to the main exercise and demotes the
  // current one into the alternatives list, so swapping is always reversible.
  const swapExercise = (dayIdx, exIdx) => {
    if (!onPlanChange) return;
    const current = plan.workoutPlan[dayIdx].exercises[exIdx];
    if (!current.alternatives || current.alternatives.length === 0) return;

    const next = JSON.parse(JSON.stringify(plan));
    const target = next.workoutPlan[dayIdx].exercises[exIdx];
    const i = Math.floor(Math.random() * target.alternatives.length);
    const [newName] = target.alternatives.splice(i, 1);
    target.alternatives.push(target.name);
    target.name = newName;
    onPlanChange(next);
  };

  if (!plan || !plan.workoutPlan) {
    return <div className="text-center text-slate-500 dark:text-slate-400 py-8">{s.loading}</div>;
  }

  const toggleAlternatives = (dayIdx, exIdx) => {
    const key = `${dayIdx}-${exIdx}`;
    setExpandedAlternatives((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {plan.workoutPlan.map((dayPlan, dayIdx) => (
        <Card
          key={dayIdx}
          className="hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all"
        >
          <button
            type="button"
            aria-expanded={expandedDay === dayIdx}
            aria-controls={`workout-day-${dayIdx}`}
            onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
            className="w-full flex justify-between items-start text-left bg-transparent rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <div className="flex-1">
              <span className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">💪</span>
                {m.days[dayPlan.day] || dayPlan.day}
                {dayPlan.focus && (
                  <span className="text-sm bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2 py-1 rounded">
                    {m.workoutFocus[dayPlan.focus] || dayPlan.focus}
                  </span>
                )}
              </span>
              {dayPlan.totalEstimatedTime && (
                <span className="block text-sm text-slate-600 dark:text-slate-400">
                  ⏱ {s.estMins} {dayPlan.totalEstimatedTime} {s.mins} | {dayPlan.exercises?.length || 0} {s.exercises}
                </span>
              )}
            </div>
            <span
              className={`text-lg transition-transform duration-300 ${
                expandedDay === dayIdx ? 'rotate-180 text-sky-500' : 'text-slate-400 dark:text-slate-500'
              }`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {expandedDay === dayIdx && (
            <div id={`workout-day-${dayIdx}`} className="space-y-4 mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
              {dayPlan.warmupExercises && dayPlan.warmupExercises.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    {s.warmup} ({dayPlan.warmupMinutes || 5} {s.mins})
                  </h4>
                  <ul className="space-y-1">
                    {dayPlan.warmupExercises.map((ex, idx) => (
                      <li key={idx} className="text-sm text-slate-700 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                {dayPlan.exercises && dayPlan.exercises.length > 0 ? (
                  dayPlan.exercises.map((exercise, exIdx) => (
                    <div
                      key={exIdx}
                      className="bg-slate-50 dark:bg-dark-surface/50 border border-slate-200 dark:border-dark-border rounded-lg p-3"
                    >
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm">{exercise.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                  <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                    {exercise.muscleGroups.join(', ')}
                                  </span>
                                )}
                                {exercise.exerciseType && (
                                  <span className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                                    {m.exerciseType[exercise.exerciseType] || exercise.exerciseType}
                                  </span>
                                )}
                                {exercise.intensity && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      exercise.intensity === 'Very High'
                                        ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                                        : exercise.intensity === 'High'
                                          ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                                          : exercise.intensity === 'Moderate'
                                            ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                                            : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                                    }`}
                                  >
                                    {m.intensity[exercise.intensity] || exercise.intensity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm space-y-1">
                            <p className="text-slate-700 dark:text-slate-400">
                              <span className="font-medium text-slate-900 dark:text-white">{exercise.sets}x{exercise.reps}</span>
                              {exercise.restTime && (
                                <> {' | '}{s.rest} <span className="font-medium text-slate-600 dark:text-slate-300">{exercise.restTime}s</span></>
                              )}
                              {exercise.rpe && (
                                <> {' | '}<span className="font-medium text-slate-600 dark:text-slate-300">{exercise.rpe}</span></>
                              )}
                            </p>

                            {exercise.estimatedDuration && (
                              <p className="text-slate-700 dark:text-slate-400">⏱ {exercise.estimatedDuration} {s.mins}</p>
                            )}

                            {exercise.warmupSets && exercise.warmupSets.length > 0 && (
                              <p className="text-slate-700 dark:text-slate-400 text-xs">
                                {s.warmupLabel} {exercise.warmupSets.map((w) => `${w.reps}x${w.weight}`).join(', ')}
                              </p>
                            )}

                            {exercise.alternatives && exercise.alternatives.length > 0 && (
                              <div className="flex items-center gap-3 flex-wrap">
                                {onPlanChange && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      swapExercise(dayIdx, exIdx);
                                    }}
                                    className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                                  >
                                    🔄 {s.swap}
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAlternatives(dayIdx, exIdx);
                                  }}
                                  className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                                >
                                  {expandedAlternatives[`${dayIdx}-${exIdx}`] ? s.hideAlternatives : s.showAlternatives}
                                </button>
                                {expandedAlternatives[`${dayIdx}-${exIdx}`] && (
                                  <ul className="w-full mt-1 space-y-1 ml-2">
                                    {exercise.alternatives.map((alt, altIdx) => (
                                      <li key={altIdx} className="text-xs text-slate-700 dark:text-slate-400 flex items-start gap-2">
                                        <span className="text-sky-600 dark:text-sky-400">•</span>
                                        <span>{alt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-full lg:w-48 flex-shrink-0">
                          <ExerciseDemo
                            exerciseName={exercise.name}
                            muscleGroups={exercise.muscleGroups}
                            exerciseType={exercise.exerciseType}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-700 dark:text-slate-400 text-sm">{s.restDay}</p>
                )}
              </div>

              {dayPlan.cooldownExercises && dayPlan.cooldownExercises.length > 0 && (
                <div className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">{s.cooldown}</h4>
                  <ul className="space-y-1">
                    {dayPlan.cooldownExercises.map((ex, idx) => (
                      <li key={idx} className="text-sm text-slate-700 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                        <span>{ex.name} ({ex.duration} {s.mins})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dayPlan.recoveryTips && (
                <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">{s.recoveryTipsLabel}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-400">{dayPlan.recoveryTips}</p>
                </div>
              )}

              {dayPlan.progressionGuidance && (
                <div className="bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-400 mb-1">{s.progressionLabel}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-400">{dayPlan.progressionGuidance}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

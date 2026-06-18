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
    return <div className="text-center text-ink-500 py-8">{s.loading}</div>;
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
          className="hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all"
        >
          <button
            type="button"
            aria-expanded={expandedDay === dayIdx}
            aria-controls={`workout-day-${dayIdx}`}
            onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
            className="w-full flex justify-between items-start text-left bg-transparent rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <div className="flex-1">
              <span className="text-base font-bold text-ink-900 mb-2 flex items-center gap-2 flex-wrap">
                {m.days[dayPlan.day] || dayPlan.day}
                {dayPlan.focus && (
                  <span className="text-xs bg-accent-wash text-accent-600 border border-accent/20 px-2 py-0.5 rounded-full font-semibold">
                    {m.workoutFocus[dayPlan.focus] || dayPlan.focus}
                  </span>
                )}
              </span>
              {dayPlan.totalEstimatedTime && (
                <span className="block text-xs text-ink-500">
                  {s.estMins} {dayPlan.totalEstimatedTime} {s.mins} · {dayPlan.exercises?.length || 0} {s.exercises}
                </span>
              )}
            </div>
            <span
              className={`text-sm transition-transform duration-300 ml-3 flex-shrink-0 ${
                expandedDay === dayIdx ? 'rotate-180 text-accent' : 'text-ink-300'
              }`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {expandedDay === dayIdx && (
            <div id={`workout-day-${dayIdx}`} className="space-y-4 mt-4 pt-4 border-t border-line">
              {dayPlan.warmupExercises && dayPlan.warmupExercises.length > 0 && (
                <div className="bg-canvas border border-line rounded-[12px] p-3">
                  <h4 className="text-sm font-semibold text-ink-700 mb-2">
                    {s.warmup} ({dayPlan.warmupMinutes || 5} {s.mins})
                  </h4>
                  <ul className="space-y-1">
                    {dayPlan.warmupExercises.map((ex, idx) => (
                      <li key={idx} className="text-sm text-ink-700 flex items-start gap-2">
                        <span className="text-accent mt-0.5 flex-shrink-0">•</span>
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
                      className="bg-canvas border border-line rounded-[12px] p-3"
                    >
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-ink-900 text-sm">{exercise.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                  <span className="text-xs bg-accent-wash text-accent-600 border border-accent/20 px-2 py-0.5 rounded-full">
                                    {exercise.muscleGroups.join(', ')}
                                  </span>
                                )}
                                {exercise.exerciseType && (
                                  <span className="text-xs bg-[#FEF3E2] text-[#9A6000] border border-[#F5A524]/20 px-2 py-0.5 rounded-full">
                                    {m.exerciseType[exercise.exerciseType] || exercise.exerciseType}
                                  </span>
                                )}
                                {exercise.intensity && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full border ${
                                      exercise.intensity === 'Very High'
                                        ? 'bg-[#FDECEA] text-semantic-danger border-semantic-danger/20'
                                        : exercise.intensity === 'High'
                                          ? 'bg-[#FEF3E2] text-[#9A6000] border-[#F5A524]/20'
                                          : exercise.intensity === 'Moderate'
                                            ? 'bg-[#FEF3E2] text-[#9A6000] border-[#F5A524]/20'
                                            : 'bg-accent-wash text-accent-600 border-accent/20'
                                    }`}
                                  >
                                    {m.intensity[exercise.intensity] || exercise.intensity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm space-y-1">
                            <p className="text-ink-700">
                              <span className="font-semibold text-ink-900">{exercise.sets}×{exercise.reps}</span>
                              {exercise.restTime && (
                                <> · {s.rest} <span className="font-medium text-ink-700">{exercise.restTime}s</span></>
                              )}
                              {exercise.rpe && (
                                <> · <span className="font-medium text-ink-700">{exercise.rpe}</span></>
                              )}
                            </p>

                            {exercise.estimatedDuration && (
                              <p className="text-xs text-ink-500">⏱ {exercise.estimatedDuration} {s.mins}</p>
                            )}

                            {exercise.warmupSets && exercise.warmupSets.length > 0 && (
                              <p className="text-xs text-ink-500">
                                {s.warmupLabel} {exercise.warmupSets.map((w) => `${w.reps}×${w.weight}`).join(', ')}
                              </p>
                            )}

                            {exercise.alternatives && exercise.alternatives.length > 0 && (
                              <div className="flex items-center gap-3 flex-wrap pt-1">
                                {onPlanChange && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      swapExercise(dayIdx, exIdx);
                                    }}
                                    className="text-xs text-accent-600 hover:text-accent transition-colors font-medium"
                                  >
                                    🔄 {s.swap}
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAlternatives(dayIdx, exIdx);
                                  }}
                                  className="text-xs text-accent-600 hover:text-accent transition-colors font-medium"
                                >
                                  {expandedAlternatives[`${dayIdx}-${exIdx}`] ? s.hideAlternatives : s.showAlternatives}
                                </button>
                                {expandedAlternatives[`${dayIdx}-${exIdx}`] && (
                                  <ul className="w-full mt-1 space-y-1 ml-2">
                                    {exercise.alternatives.map((alt, altIdx) => (
                                      <li key={altIdx} className="text-xs text-ink-500 flex items-start gap-2">
                                        <span className="text-accent-600 flex-shrink-0">•</span>
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
                  <p className="text-sm text-ink-500">{s.restDay}</p>
                )}
              </div>

              {dayPlan.cooldownExercises && dayPlan.cooldownExercises.length > 0 && (
                <div className="bg-accent-wash border border-accent/20 rounded-[12px] p-3">
                  <h4 className="text-sm font-semibold text-accent-600 mb-2">{s.cooldown}</h4>
                  <ul className="space-y-1">
                    {dayPlan.cooldownExercises.map((ex, idx) => (
                      <li key={idx} className="text-sm text-ink-700 flex items-start gap-2">
                        <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                        <span>{ex.name} ({ex.duration} {s.mins})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dayPlan.recoveryTips && (
                <div className="bg-canvas border border-line rounded-[12px] p-3">
                  <h4 className="text-sm font-semibold text-ink-700 mb-1">{s.recoveryTipsLabel}</h4>
                  <p className="text-sm text-ink-700">{dayPlan.recoveryTips}</p>
                </div>
              )}

              {dayPlan.progressionGuidance && (
                <div className="bg-canvas border border-line rounded-[12px] p-3">
                  <h4 className="text-sm font-semibold text-ink-700 mb-1">{s.progressionLabel}</h4>
                  <p className="text-sm text-ink-700">{dayPlan.progressionGuidance}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

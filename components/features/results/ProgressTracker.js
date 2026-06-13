'use client';

import { useEffect, useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { listCheckins, getCheckin, saveCheckin } from '@/utils/progressStorage';
import { recommendCalorieAdjustment, applyCalorieAdjustment } from '@/utils/generateSmartPlan';
import SmartCoach from './SmartCoach';

const todayStr = () => new Date().toISOString().slice(0, 10);

const fmt = (template, vars) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), template);

function Sparkline({ weights }) {
  if (weights.length < 2) return null;
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const coords = weights
    .map((w, i) => {
      const x = (i / (weights.length - 1)) * 100;
      const y = 28 - ((w - min) / range) * 24;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const [lastX, lastY] = coords.split(' ').pop().split(',');

  return (
    <svg viewBox="0 0 100 32" className="w-full h-24" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={coords}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="2" fill="#0ea5e9" />
    </svg>
  );
}

export default function ProgressTracker({ plan, onPlanChange }) {
  const { t, lang } = useLanguage();
  const s = t.progress;
  const m = t.maps;

  const [checkins, setCheckins] = useState([]);
  const [weight, setWeight] = useState('');
  const [doneToday, setDoneToday] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCheckins(listCheckins());
    const today = getCheckin(todayStr());
    if (today) {
      setWeight(today.weight ? String(today.weight) : '');
      setDoneToday(today.workoutsDone || []);
    }
  }, []);

  const workoutDays = (plan.workoutPlan || []).filter((d) => d.exercises?.length > 0);

  const toggleDone = (dayName) => {
    setSaved(false);
    setDoneToday((prev) =>
      prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = parseFloat(String(weight).replace(',', '.'));
    saveCheckin({
      date: todayStr(),
      weight: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
      workoutsDone: doneToday,
    });
    setCheckins(listCheckins());
    setSaved(true);
  };

  const weighIns = checkins.filter((c) => typeof c.weight === 'number' && c.weight > 0);
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  const recentWindow = checkins.filter((c) => {
    const age = (Date.now() - new Date(c.date)) / 86400000;
    return age >= 0 && age <= 7;
  });
  const done7 = recentWindow.reduce((sum, c) => sum + (c.workoutsDone?.length || 0), 0);
  const planned = workoutDays.length;
  const adherencePct = planned > 0 ? Math.min(100, Math.round((done7 / planned) * 100)) : 0;

  const adjustedRecently =
    plan.calorieAdjustedAt && (Date.now() - new Date(plan.calorieAdjustedAt)) / 86400000 < 7;
  const rec = recommendCalorieAdjustment(plan, checkins);

  const applyRec = () => {
    if (!onPlanChange || rec.status !== 'adjust') return;
    onPlanChange(applyCalorieAdjustment(plan, rec.deltaCalories));
  };

  return (
    <div className="space-y-4">
      {/* Smart Coach narrative — reads same checkins state, updates on every save */}
      <SmartCoach plan={plan} checkins={checkins} />

      {/* Today's check-in */}
      <Card>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{s.checkInTitle}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="max-w-xs">
            <Input
              label={s.weightLabel}
              type="number"
              step="0.1"
              min="30"
              max="300"
              placeholder={s.weightPlaceholder}
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setSaved(false);
              }}
            />
          </div>

          {workoutDays.length > 0 && (
            <fieldset>
              <legend className="text-xs sm:text-sm font-medium text-slate-700 dark:text-white mb-2">
                {s.workoutsLabel}
              </legend>
              <div className="flex flex-wrap gap-2">
                {workoutDays.map((day) => (
                  <label
                    key={day.day}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all
                      ${
                        doneToday.includes(day.day)
                          ? 'bg-sky-500/10 border-sky-500/50 text-sky-700 dark:text-sky-300'
                          : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-sky-500/40'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-sky-500"
                      checked={doneToday.includes(day.day)}
                      onChange={() => toggleDone(day.day)}
                    />
                    <span>
                      {m.days[day.day] || day.day}
                      {day.focus ? ` · ${m.workoutFocus[day.focus] || day.focus}` : ''}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" size="sm">{s.saveBtn}</Button>
            {saved && (
              <span role="status" className="text-sm text-green-600 dark:text-green-400">
                {s.savedNote}
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Coach recommendation */}
      <Card className="bg-gradient-to-br from-sky-50 via-white dark:via-transparent to-blue-50 dark:from-sky-500/10 dark:to-blue-500/10 border-sky-200 dark:border-sky-500/20">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{s.recTitle}</h3>
        {adjustedRecently ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">{s.recentlyAdjusted}</p>
        ) : rec.status === 'insufficient-data' ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">{s.recInsufficient}</p>
        ) : rec.status === 'on-track' ? (
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {fmt(s.recOnTrack, { rate: rec.weeklyChange.toLocaleString(locale) })}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {fmt(rec.direction === 'reduce' ? s.recReduce : s.recIncrease, {
                rate: rec.weeklyChange.toLocaleString(locale),
                delta: Math.abs(rec.deltaCalories),
              })}
            </p>
            <Button size="sm" onClick={applyRec}>{s.applyBtn}</Button>
          </div>
        )}
      </Card>

      {/* Weight trend */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">{s.trendTitle}</h3>
          {weighIns.length > 0 && (
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
              {weighIns[weighIns.length - 1].weight.toLocaleString(locale)} kg
            </span>
          )}
        </div>
        {weighIns.length >= 2 ? (
          <>
            <Sparkline weights={weighIns.map((c) => c.weight)} />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{new Date(weighIns[0].date).toLocaleDateString(locale)}</span>
              <span>{new Date(weighIns[weighIns.length - 1].date).toLocaleDateString(locale)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{s.noWeighIns}</p>
        )}
      </Card>

      {/* Weekly adherence */}
      <Card>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{s.adherenceTitle}</h3>
        <div className="w-full bg-slate-200 dark:bg-dark-bg rounded-full h-2 overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${adherencePct}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {fmt(s.adherenceNote, { done: Math.min(done7, planned), planned })}
        </p>
      </Card>

      {/* Recent check-ins */}
      {checkins.length > 0 && (
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{s.historyTitle}</h3>
          <ul className="space-y-2">
            {[...checkins].reverse().slice(0, 10).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-dark-border/50 last:border-0 pb-2 last:pb-0"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  {new Date(c.date).toLocaleDateString(locale)}
                </span>
                <span className="flex items-center gap-3">
                  {typeof c.weight === 'number' && (
                    <span className="font-medium text-slate-900 dark:text-white">
                      {c.weight.toLocaleString(locale)} kg
                    </span>
                  )}
                  {c.workoutsDone?.length > 0 && (
                    <span className="text-green-600 dark:text-green-400">
                      ✓ {c.workoutsDone.length}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

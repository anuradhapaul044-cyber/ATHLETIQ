import React, { useEffect, useMemo, useState } from 'react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  addDietEntry,
  calculateBmi,
  getDietEntries,
  getWellnessProfile,
  removeDietEntry,
  saveWellnessProfile,
  type DietEntry,
} from '../../lib/wellness';

const tabs = ['Diet', 'BMI & Health', 'Fitness Plan', 'Challenges'];

const defaultChallenges = [
  { name: '30-Day Push-up Challenge', progress: 18, total: 30, completed: false },
  { name: '10,000 Steps Daily', progress: 7, total: 10, completed: false },
  { name: 'Hydration Goal (2.5L)', progress: 2.1, total: 2.5, completed: false },
];

export default function Wellness() {
  const profile = getWellnessProfile();
  const [activeTab, setActiveTab] = useState('Diet');
  const [heightCm, setHeightCm] = useState<string>(profile?.heightCm ? String(profile.heightCm) : '');
  const [weightKg, setWeightKg] = useState<string>(profile?.weightKg ? String(profile.weightKg) : '');
  const [entries, setEntries] = useState<DietEntry[]>(() => getDietEntries());
  const [mealType, setMealType] = useState('Breakfast');
  const [mealDescription, setMealDescription] = useState('');
  const [mealNotes, setMealNotes] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    setEntries(getDietEntries());
  }, [activeTab]);

  const bmi = useMemo(() => calculateBmi(Number(heightCm) || null, Number(weightKg) || null), [heightCm, weightKg]);
  const bmiStatus = bmi === null ? 'Add height and weight' : bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const todayEntries = entries.filter((entry) => entry.date === new Date().toISOString().slice(0, 10));

  const handleSaveProfile = () => {
    const parsedHeight = Number(heightCm);
    const parsedWeight = Number(weightKg);

    if (!parsedHeight || !parsedWeight) {
      setFormMessage('Add both height and weight to calculate BMI.');
      return;
    }

    saveWellnessProfile({ heightCm: parsedHeight, weightKg: parsedWeight, updatedAt: new Date().toISOString() });
    setFormMessage('Wellness profile saved.');
  };

  const handleAddMeal = () => {
    const description = mealDescription.trim();
    if (!description) {
      setFormMessage('Add a meal description before saving.');
      return;
    }

    addDietEntry({
      date: new Date().toISOString().slice(0, 10),
      mealType,
      description,
      notes: mealNotes.trim(),
    });
    setEntries(getDietEntries());
    setMealDescription('');
    setMealNotes('');
    setMealType('Breakfast');
    setFormMessage('Meal logged successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Wellness</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Diet, health metrics, fitness plan, and challenges</p>
      </div>

      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Diet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Calories" value={todayEntries.length ? 'Logged' : '—'} sub={todayEntries.length ? `${todayEntries.length} meal entries saved` : 'No meals logged today'} />
            <StatCard label="Hydration" value="2.1L" sub="Target: 2.5L" />
            <StatCard label="Protein" value="—" sub="Add meals to track" />
          </div>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Add a meal</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">Meal type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)]">
                  {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">Meal title</label>
                <Input value={mealDescription} onChange={(e) => setMealDescription(e.target.value)} placeholder="Oats with fruit" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">Notes</label>
              <Input value={mealNotes} onChange={(e) => setMealNotes(e.target.value)} placeholder="Extra protein, hydration, etc." />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddMeal}>Save Meal</Button>
            </div>
            {formMessage && <p className="mt-3 text-xs text-[var(--color-text-muted)]">{formMessage}</p>}
          </Card>

          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Today's Meals</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{todayEntries.length} logged</span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {todayEntries.length ? (
                todayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{entry.mealType}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{entry.description}</p>
                      {entry.notes && <p className="text-[10px] text-[var(--color-text-muted)]">{entry.notes}</p>}
                    </div>
                    <button onClick={() => { removeDietEntry(entry.id); setEntries(getDietEntries()); }} className="text-xs text-[var(--color-danger)] hover:underline">Remove</button>
                  </div>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-[var(--color-text-muted)]">No meals logged yet for today.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'BMI & Health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="BMI" value={bmi === null ? '—' : bmi.toFixed(1)} sub={bmi === null ? 'Add height & weight' : bmiStatus} accent />
            <StatCard label="Height" value={profile?.heightCm ? `${profile.heightCm}cm` : '—'} sub={profile?.updatedAt ? 'Last recorded' : 'Not set'} />
            <StatCard label="Weight" value={profile?.weightKg ? `${profile.weightKg}kg` : '—'} sub={profile?.updatedAt ? 'Last recorded' : 'Not set'} />
            <StatCard label="Status" value={bmiStatus} sub={bmi === null ? 'Waiting for data' : 'Current range'} />
          </div>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Update health metrics</h3>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <Input label="Height (cm)" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="175" />
              <Input label="Weight (kg)" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="68.5" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Save Health Profile</Button>
            </div>
            {formMessage && <p className="mt-3 text-xs text-[var(--color-text-muted)]">{formMessage}</p>}
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">BMI Scale</h3>
            <div className="relative h-4 rounded-full overflow-hidden flex mb-2">
              <div className="flex-1 bg-blue-200" />
              <div className="flex-[2] bg-[var(--color-success-light)]" />
              <div className="flex-1 bg-[var(--color-warning-light)]" />
              <div className="flex-1 bg-[var(--color-danger-light)]" />
            </div>
            <div className="flex text-[10px] text-[var(--color-text-muted)] justify-between">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="success" dot>{bmi === null ? 'Awaiting BMI' : bmiStatus}</Badge>
              <span className="text-xs text-[var(--color-text-muted)]">{bmi === null ? 'Enter height and weight to calculate BMI.' : `Your BMI: ${bmi.toFixed(1)}`}</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'Fitness Plan' && (
        <div className="space-y-3">
          {[
            { day: 'Monday', activity: 'Strength Training — Upper Body', duration: '45 min', done: true },
            { day: 'Tuesday', activity: 'Sprint Intervals — Track', duration: '30 min', done: true },
            { day: 'Wednesday', activity: 'Rest / Active Recovery', duration: '20 min', done: false },
            { day: 'Thursday', activity: 'Strength Training — Lower Body', duration: '45 min', done: false },
            { day: 'Friday', activity: '200m Tempo Runs', duration: '35 min', done: false },
            { day: 'Saturday', activity: 'Long Run / Endurance', duration: '50 min', done: false },
            { day: 'Sunday', activity: 'Rest', duration: '—', done: false },
          ].map((dayPlan, index) => (
            <Card key={index} className={dayPlan.done ? 'opacity-70' : ''}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${dayPlan.done ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>
                  {dayPlan.done ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">{dayPlan.activity}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{dayPlan.day} · {dayPlan.duration}</p>
                </div>
                {!dayPlan.done && <Button size="sm" variant="outline">Log</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'Challenges' && (
        <div className="space-y-4">
          {defaultChallenges.map((challenge, index) => (
            <Card key={index}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[var(--color-text)]">{challenge.name}</h3>
                <Badge variant={challenge.completed ? 'success' : 'ai'}>{challenge.completed ? 'Complete!' : 'Active'}</Badge>
              </div>
              <div className="w-full bg-[var(--color-border)] rounded-full h-2 mb-2">
                <div
                  className="bg-[var(--color-brand)] h-2 rounded-full transition-all"
                  style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>{challenge.progress} / {challenge.total}</span>
                <span>{Math.round((challenge.progress / challenge.total) * 100)}% complete</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

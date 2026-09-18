import React, { useState } from 'react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const tabs = ['Diet', 'BMI & Health', 'Fitness Plan', 'Challenges'];

const meals = [
  { meal: 'Breakfast', items: 'Oats, banana, eggs (2)', cals: 420 },
  { meal: 'Lunch', items: 'Rice, dal, chicken, salad', cals: 680 },
  { meal: 'Snack', items: 'Peanut butter toast', cals: 210 },
  { meal: 'Dinner', items: 'Roti, sabzi, curd', cals: 550 },
];

const challenges = [
  { name: '30-Day Push-up Challenge', progress: 18, total: 30, completed: false },
  { name: '10,000 Steps Daily', progress: 7, total: 10, completed: false },
  { name: 'Hydration Goal (2.5L)', progress: 2.1, total: 2.5, completed: false },
];

export default function Wellness() {
  const [activeTab, setActiveTab] = useState('Diet');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Wellness</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Diet, health metrics, fitness plan, and challenges</p>
      </div>

      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Diet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Calories" value="1,860" sub="Target: 2,200 kcal" />
            <StatCard label="Protein" value="82g" sub="Target: 100g" trend={{ value: '-18g', up: false }} />
            <StatCard label="Hydration" value="2.1L" sub="Target: 2.5L" />
          </div>
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Today's Meals</h2>
              <Button size="sm" variant="outline">+ Add Meal</Button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {meals.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{m.meal}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{m.items}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{m.cals} kcal</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'BMI & Health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="BMI" value="22.4" sub="Normal range" accent />
            <StatCard label="Height" value="174cm" sub="Last recorded" />
            <StatCard label="Weight" value="67.8kg" sub="Last recorded" />
            <StatCard label="Body Fat" value="14%" sub="Estimated" />
          </div>
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
              <Badge variant="success" dot>Normal — 18.5 to 24.9</Badge>
              <span className="text-xs text-[var(--color-text-muted)]">Your BMI: 22.4</span>
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
          ].map((d, i) => (
            <Card key={i} className={d.done ? 'opacity-70' : ''}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${d.done ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>
                  {d.done ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">{d.activity}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{d.day} · {d.duration}</p>
                </div>
                {!d.done && <Button size="sm" variant="outline">Log</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'Challenges' && (
        <div className="space-y-4">
          {challenges.map((c, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[var(--color-text)]">{c.name}</h3>
                <Badge variant={c.completed ? 'success' : 'ai'}>{c.completed ? 'Complete!' : 'Active'}</Badge>
              </div>
              <div className="w-full bg-[var(--color-border)] rounded-full h-2 mb-2">
                <div
                  className="bg-[var(--color-brand)] h-2 rounded-full transition-all"
                  style={{ width: `${(c.progress / c.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>{c.progress} / {c.total}</span>
                <span>{Math.round((c.progress / c.total) * 100)}% complete</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

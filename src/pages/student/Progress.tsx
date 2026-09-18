import React from 'react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const assessmentHistory = [
  { date: 'Sep 12', reps: 42, score: 8.4 },
  { date: 'Aug 28', reps: 38, score: 7.9 },
  { date: 'Aug 10', reps: 35, score: 7.2 },
  { date: 'Jul 18', reps: 35, score: 7.0 },
  { date: 'Jun 30', reps: 31, score: 6.8 },
  { date: 'Jun 5', reps: 28, score: 6.3 },
  { date: 'May 12', reps: 22, score: 5.8 },
];

export default function Progress() {
  const maxReps = Math.max(...assessmentHistory.map(a => a.reps));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Performance Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your training trends and milestones</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Best Result" value="42" sub="Push-ups · Sep 12" accent />
        <StatCard label="Assessments" value="7" sub="Total completed" />
        <StatCard label="Improvement" value="+91%" sub="Since first assessment" trend={{ value: 'Mar to Sep', up: true }} />
        <StatCard label="Form Score" value="8.4" sub="Latest assessment" trend={{ value: '+0.5 vs last', up: true }} />
      </div>

      {/* Rep progress chart */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Push-up Progression</h2>
          <Badge variant="ai" dot>AI-Verified data</Badge>
        </div>
        <div className="flex items-end gap-3 h-32 mb-3">
          {assessmentHistory.slice().reverse().map((a, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.reps}</span>
              <div
                className={`w-full rounded-t-sm transition-all ${i === assessmentHistory.length - 1 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-brand)]/30'}`}
                style={{ height: `${(a.reps / (maxReps + 8)) * 112}px` }}
              />
              <span className="text-[9px] text-[var(--color-text-muted)]">{a.date}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">20 reps improvement over 7 assessments · Consistent upward trend</p>
      </Card>

      {/* Form score trend */}
      <Card className="mb-5">
        <h2 className="text-sm font-bold text-[var(--color-text)] mb-4">Form Consistency Score</h2>
        <div className="space-y-2.5">
          {assessmentHistory.slice().reverse().map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-muted)] w-14">{a.date}</span>
              <div className="flex-1 bg-[var(--color-border)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${i === assessmentHistory.length - 1 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-brand)]/50'}`}
                  style={{ width: `${(a.score / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[var(--color-text)] w-10 text-right" style={{ fontFamily: 'var(--font-mono)' }}>{a.score}/10</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Assessment history table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Assessment History</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {assessmentHistory.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)]">
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Push-up Assessment</p>
                <p className="text-xs text-[var(--color-text-muted)]">{a.date}, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.reps} reps</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">Score</p>
                  <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.score}</p>
                </div>
                <Badge variant="ai" className="text-[10px]">AI-Verified</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

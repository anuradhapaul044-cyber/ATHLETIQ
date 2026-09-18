import React from 'react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getPushupAssessmentHistory } from '../../lib/assessments';

export default function Progress() {
  const assessmentHistory = getPushupAssessmentHistory();
  const latestAssessment = assessmentHistory[0];
  const previousAssessment = assessmentHistory[1];
  const maxReps = assessmentHistory.length ? Math.max(...assessmentHistory.map(a => a.completed_reps)) : 0;

  const improvementPercent = latestAssessment && previousAssessment && previousAssessment.completed_reps > 0
    ? ((latestAssessment.completed_reps - previousAssessment.completed_reps) / previousAssessment.completed_reps) * 100
    : null;

  if (!assessmentHistory.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[var(--color-text)]">Performance Progress</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your training trends and milestones</p>
        </div>
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">No saved assessment history yet. Complete a push-up assessment to start tracking your progress.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Performance Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your training trends and milestones</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Best Result"
          value={latestAssessment.completed_reps}
          sub={`Push-ups · ${new Date(latestAssessment.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`}
          accent
        />
        <StatCard label="Assessments" value={assessmentHistory.length} sub="Total saved" />
        <StatCard
          label="Improvement"
          value={improvementPercent !== null ? `${improvementPercent >= 0 ? '+' : ''}${improvementPercent.toFixed(0)}%` : '—'}
          sub={previousAssessment ? 'Vs previous result' : 'Need 2 assessments'}
          trend={improvementPercent !== null ? { value: 'Saved locally', up: improvementPercent >= 0 } : undefined}
        />
        <StatCard
          label="Pose Detection"
          value={`${latestAssessment.pose_detection_percentage.toFixed(1)}%`}
          sub="Latest assessment"
        />
      </div>

      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Push-up Progression</h2>
          <Badge variant="ai" dot>AI-Verified data</Badge>
        </div>
        <div className="flex items-end gap-3 h-32 mb-3">
          {assessmentHistory.slice().reverse().map((a, i) => (
            <div key={a.saved_at} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.completed_reps}</span>
              <div
                className={`w-full rounded-t-sm transition-all ${i === assessmentHistory.length - 1 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-brand)]/30'}`}
                style={{ height: `${(a.completed_reps / (maxReps + 8)) * 112}px` }}
              />
              <span className="text-[9px] text-[var(--color-text-muted)]">{new Date(a.saved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          {assessmentHistory.length > 1
            ? `${latestAssessment.completed_reps - previousAssessment!.completed_reps} reps change since the previous saved assessment.`
            : 'Saved assessment history is available.'}
        </p>
      </Card>

      <Card className="mb-5">
        <h2 className="text-sm font-bold text-[var(--color-text)] mb-4">Form Consistency Score</h2>
        <div className="space-y-2.5">
          {assessmentHistory.slice().reverse().map((a, i) => (
            <div key={`${a.saved_at}-score`} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-muted)] w-14">{new Date(a.saved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <div className="flex-1 bg-[var(--color-border)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${i === assessmentHistory.length - 1 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-brand)]/50'}`}
                  style={{ width: `${Math.min(100, a.pose_detection_percentage)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[var(--color-text)] w-12 text-right" style={{ fontFamily: 'var(--font-mono)' }}>{a.pose_detection_percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Assessment History</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {assessmentHistory.map((a, i) => (
            <div key={`${a.saved_at}-${i}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)]">
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Push-up Assessment</p>
                <p className="text-xs text-[var(--color-text-muted)]">{new Date(a.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.completed_reps} reps</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">Pose</p>
                  <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.pose_detection_percentage.toFixed(1)}%</p>
                </div>
                <Badge variant="ai" className="text-[10px]">AI-Generated</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

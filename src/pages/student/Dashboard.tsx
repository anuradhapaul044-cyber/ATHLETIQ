import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { getAuthenticatedUsername } from '../../lib/auth';
import { getPushupAssessmentHistory } from '../../lib/assessments';

const opportunities = [
  { name: 'SAI National Athletics Trials', deadline: 'Mar 15, 2025', category: 'Government Trial', match: 94 },
  { name: 'Reliance Foundation Scholarship', deadline: 'Apr 30, 2025', category: 'Scholarship', match: 87 },
];

const achievements = [
  { title: 'District Champion', year: '2024', sport: 'Athletics', verified: true },
  { title: 'School Record — 100m', year: '2024', sport: 'Athletics', verified: false },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const username = getAuthenticatedUsername();
  const history = getPushupAssessmentHistory();
  const latestAssessment = history[0];
  const recentAssessments = history.slice(0, 3).map(a => ({
    date: new Date(a.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
    type: 'Push-up Assessment',
    reps: a.completed_reps,
    score: a.pose_detection_percentage,
    status: 'ai',
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Welcome back</p>
          <h1 className="text-2xl font-black text-[var(--color-text)] mt-0.5">Welcome back{username ? `, ${username}` : ''} 👋</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {latestAssessment ? `Latest saved assessment: ${latestAssessment.completed_reps} valid reps.` : 'Complete your first push-up assessment to begin tracking progress.'}
          </p>
        </div>
        <Button
          onClick={() => navigate('/student/assessments')}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>}
        >
          Start Assessment
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Best Push-ups"
          value={latestAssessment ? latestAssessment.completed_reps : '—'}
          sub={latestAssessment ? `AI-verified · ${new Date(latestAssessment.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No saved assessment'}
          accent
        />
        <StatCard
          label="Pose Detection"
          value={latestAssessment ? `${latestAssessment.pose_detection_percentage.toFixed(1)}%` : '—'}
          sub={latestAssessment ? 'Latest assessment' : 'No assessment yet'}
        />
        <StatCard label="Assessments Done" value={history.length} sub={history.length ? 'Saved locally' : 'No saved assessments'} />
        <StatCard label="Profile Status" value={latestAssessment ? 'Live' : '—'} sub={latestAssessment ? 'Latest assessment saved' : 'Add an assessment'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Performance progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Push-up Progress</h2>
              <Badge variant="ai" dot>AI-Verified</Badge>
            </div>
            <div className="flex items-end gap-2 h-24 mb-3">
              {[22, 28, 31, 35, 35, 38, 42].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm transition-all ${i === 6 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'}`}
                    style={{ height: `${(v / 50) * 80}px` }}
                  />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
              <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
            </div>
          </Card>

          {/* Recent assessments */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Assessments</h2>
              <button onClick={() => navigate('/student/assessments')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">View all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentAssessments.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--color-brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)]">{a.type}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{a.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.reps} reps</p>
                    <Badge variant="ai" className="text-[10px]">Score: {a.score}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Opportunities */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Matching Opportunities</h2>
              <button onClick={() => navigate('/student/opportunities')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">View all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {opportunities.map((o, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)]">{o.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{o.category} · Deadline: {o.deadline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-success)]" style={{ fontFamily: 'var(--font-mono)' }}>{o.match}% match</span>
                    <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          {/* Profile card */}
          <Card className="text-center">
            {username && <Avatar name={username} size="xl" className="mx-auto mb-3" />}
            {username && <h3 className="font-bold text-[var(--color-text)]">{username}</h3>}
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Athletics · Location not set</p>
            <Badge variant="ai" dot className="mb-4">Profile Active</Badge>
            <div className="w-full bg-[var(--color-border)] rounded-full h-1.5 mb-1">
              <div className="bg-[var(--color-brand)] h-1.5 rounded-full" style={{ width: latestAssessment ? '100%' : '0%' }} />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">{latestAssessment ? 'Latest assessment saved' : 'No assessment yet'}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => navigate('/student/profile')}>
              View Profile
            </Button>
          </Card>

          {/* Achievements */}
          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Achievements</h2>
              <button onClick={() => navigate('/student/records')} className="text-xs text-[var(--color-brand)] hover:underline">All records</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-500 text-sm">🏆</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text)] truncate">{a.title}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{a.sport} · {a.year}</p>
                  </div>
                  <Badge variant={a.verified ? 'official' : 'self'} className="text-[10px]">
                    {a.verified ? 'Verified' : 'Self'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Wellness snapshot */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Wellness</h2>
              <button onClick={() => navigate('/student/wellness')} className="text-xs text-[var(--color-brand)] hover:underline">Manage</button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'BMI', value: '22.4', status: 'Normal' },
                { label: 'Hydration', value: '2.1L', status: 'Good' },
                { label: 'Sleep', value: '7h 20m', status: 'Good' },
              ].map(w => (
                <div key={w.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{w.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[var(--color-text)]">{w.value}</span>
                    <Badge variant="success" className="text-[10px]">{w.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

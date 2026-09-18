import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { getAuthenticatedUsername } from '../../lib/auth';
import { getLatestPushupAssessment, type SavedPushupAssessment } from '../../lib/assessments';

const tabs = ['Overview', 'Assessments', 'Match Records', 'Achievements', 'Coach Evidence'];

const evidenceData = [
  { metric: 'Push-ups (best)', value: '42 reps', source: 'AI-Verified', date: 'Sep 12, 2025', badge: 'ai' as const },
  { metric: 'Form Score', value: '8.4 / 10', source: 'AI-Verified', date: 'Sep 12, 2025', badge: 'ai' as const },
  { metric: '100m Sprint', value: '10.8s', source: 'Coach-Attested', date: 'Aug 5, 2025', badge: 'coach' as const },
  { metric: 'District Champion', value: '2024', source: 'Officially Verified', date: 'Nov 2024', badge: 'official' as const },
  { metric: '200m Best', value: '22.1s', source: 'Self-Reported', date: 'Jul 2025', badge: 'self' as const },
];

const matchRecords = [
  { event: 'State Athletics Championship', date: 'Aug 2025', result: '3rd Place — 100m', verified: true },
  { event: 'District Sports Meet', date: 'Nov 2024', result: '1st Place — 100m', verified: true },
  { event: 'School Inter-House Meet', date: 'Jan 2025', result: '1st Place — 200m', verified: false },
];

const coachEvidence = [
  {
    coach: 'Priya Mehta',
    role: 'Athletics Coach · Verified',
    date: 'Aug 10, 2025',
    observation: '100m Sprint timing confirmed at 10.8s during supervised training session. Excellent acceleration phase.',
    metrics: ['100m Sprint: 10.8s', 'Start reaction: 0.14s'],
  },
];

const formatAngle = (value: number | null) => value === null ? '—' : `${value.toFixed(1)}°`;
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export default function AthleteProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewMode, setViewMode] = useState<'own' | 'scout'>('own');
  const [latestAssessment, setLatestAssessment] = useState<SavedPushupAssessment | null>(null);
  const username = getAuthenticatedUsername();

  useEffect(() => {
    const syncAssessment = () => setLatestAssessment(getLatestPushupAssessment());
    syncAssessment();
    window.addEventListener('storage', syncAssessment);
    return () => window.removeEventListener('storage', syncAssessment);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* View toggle */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-1">
          <button onClick={() => setViewMode('own')} className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${viewMode === 'own' ? 'bg-white shadow text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>My view</button>
          <button onClick={() => setViewMode('scout')} className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${viewMode === 'scout' ? 'bg-white shadow text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>Coach / Scout view</button>
        </div>
      </div>

      {/* Profile header */}
      <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {username && <Avatar name={username} size="xl" />}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {username && <h1 className="text-2xl font-black text-[var(--color-text)]">{username}</h1>}
              <Badge variant="ai" dot>Profile Active</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)] mb-4">
              <span>Athletics</span>
              <span>·</span>
              <span>17 years</span>
              <span>·</span>
              <span>Location not set</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" dot>AI-Verified Results</Badge>
              <Badge variant="coach">Coach Evidence</Badge>
              <Badge variant="official">District Champion 2024</Badge>
            </div>
          </div>
          {viewMode === 'own' && (
            <Button variant="outline" size="sm" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>}>
              Edit Profile
            </Button>
          )}
          {viewMode === 'scout' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Save Athlete</Button>
              <Button size="sm">Contact</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              {evidenceData.map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{e.metric}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{e.date}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{e.value}</p>
                    <Badge variant={e.badge} className="text-[10px]">{e.source}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Push-up Trend</h3>
              <div className="flex items-end gap-1.5 h-16">
                {[22, 28, 31, 35, 38, 42].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full rounded-t-sm ${i === 5 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'}`}
                      style={{ height: `${(v / 50) * 56}px` }} />
                    <span className="text-[9px] text-[var(--color-text-muted)]">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-bold text-[var(--color-text)] mb-2">Evidence Legend</h3>
              <div className="space-y-2">
                {[
                  { label: 'AI-Verified', variant: 'ai' as const, desc: 'AI video analysis' },
                  { label: 'Coach-Attested', variant: 'coach' as const, desc: 'Verified by a coach' },
                  { label: 'Officially Verified', variant: 'official' as const, desc: 'Institution confirmed' },
                  { label: 'Self-Reported', variant: 'self' as const, desc: 'Entered by athlete' },
                ].map(e => (
                  <div key={e.label} className="flex items-center gap-2">
                    <Badge variant={e.variant} className="text-[10px] min-w-28">{e.label}</Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">{e.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'Assessments' && (
        <div className="space-y-3">
          {!latestAssessment ? (
            <Card>
              <p className="text-sm text-[var(--color-text-secondary)]">No saved push-up assessment yet. Complete an assessment to see your latest AI-generated result here.</p>
            </Card>
          ) : (
            <Card hoverable>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-[var(--color-text)]">Latest Push-up Assessment</p>
                    <Badge variant="ai" className="text-[10px]">AI-Generated</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">Saved {new Date(latestAssessment.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{latestAssessment.completed_reps} reps</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Valid repetitions</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Valid Repetitions</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{latestAssessment.completed_reps}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Incomplete Repetitions</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{latestAssessment.incomplete_reps}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Average Elbow Angle</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{formatAngle(latestAssessment.average_elbow_angle)}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Minimum Elbow Angle</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{formatAngle(latestAssessment.minimum_elbow_angle)}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Maximum Elbow Angle</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{formatAngle(latestAssessment.maximum_elbow_angle)}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Pose Detection</p>
                  <p className="font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{formatPercentage(latestAssessment.pose_detection_percentage)}</p>
                </div>
                <div className="rounded bg-[var(--color-muted)] p-3 md:col-span-2">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Movement Consistency</p>
                  <div className="flex flex-wrap gap-3 text-[var(--color-text)]">
                    <span className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>Mean Range: {formatAngle(latestAssessment.movement_consistency.completed_rep_angle_range_mean_degrees)}</span>
                    <span className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>Variation: {formatAngle(latestAssessment.movement_consistency.completed_rep_angle_range_std_dev_degrees)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-muted)] mt-4">
                <strong>Source notice:</strong> This assessment was generated automatically by AI video analysis and is labelled as <strong>AI-Generated</strong> on your profile until coach-attested.
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'Match Records' && (
        <div className="space-y-3">
          {matchRecords.map((r, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{r.event}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{r.date}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{r.result}</p>
                </div>
                <Badge variant={r.verified ? 'official' : 'self'}>
                  {r.verified ? 'Officially Verified' : 'Self-Reported'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'Coach Evidence' && (
        <div className="space-y-4">
          {coachEvidence.map((e, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <Avatar name={e.coach} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-[var(--color-text)]">{e.coach}</p>
                    <Badge variant="success" dot>Verified Coach</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{e.role} · {e.date}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed">{e.observation}</p>
                  <div className="flex flex-wrap gap-2">
                    {e.metrics.map(m => (
                      <span key={m} className="text-xs font-mono font-medium px-2 py-1 bg-[var(--color-muted)] rounded text-[var(--color-text-secondary)]">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'Achievements' && (
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'District Champion — 100m', event: 'District Sports Meet 2024', sport: 'Athletics', badge: 'official' as const },
            { title: 'School Record — 100m Sprint', event: 'Inter-House Athletics 2025', sport: 'Athletics', badge: 'self' as const },
            { title: '3rd Place — State Championship', event: 'State Athletics Championship 2025', sport: 'Athletics', badge: 'official' as const },
          ].map((a, i) => (
            <Card key={i} hoverable>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center flex-shrink-0 text-xl">🏆</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[var(--color-text)]">{a.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{a.event}</p>
                  <Badge variant={a.badge} className="text-[10px]">{a.badge === 'official' ? 'Officially Verified' : 'Self-Reported'}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

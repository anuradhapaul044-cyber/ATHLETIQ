import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { getAuthenticatedUsername } from '../../lib/auth';
import { getCoachSavedAthletes, getCoachVerificationQueue, getDiscoverableAthletes } from '../../lib/coach';

export default function CoachDashboard() {
  const navigate = useNavigate();
  const username = getAuthenticatedUsername();
  const discoverableAthletes = getDiscoverableAthletes();
  const savedAthletes = getCoachSavedAthletes();
  const verificationQueue = getCoachVerificationQueue();
  const pendingVerifications = verificationQueue.filter((item) => item.status === 'pending');
  const verifiedCount = verificationQueue.filter((item) => item.status === 'verified').length;

  const recentActivity = discoverableAthletes.slice(0, 3).map((athlete) => ({
    name: athlete.name,
    sport: athlete.sport,
    metric: athlete.latestAssessment ? `${athlete.latestAssessment.completed_reps} reps` : athlete.matchRecords[0] ? athlete.matchRecords[0].result : 'Profile active',
    date: athlete.latestAssessment ? new Date(athlete.latestAssessment.saved_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Profile',
    status: athlete.verificationStatus === 'verified' ? 'Verified' : athlete.latestAssessment ? 'New result' : 'Updated profile',
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Coach overview</p>
          <h1 className="text-2xl font-black text-[var(--color-text)] mt-0.5">Coach Portal</h1>
          <div className="flex items-center gap-2 mt-1">
            {username && <p className="text-sm text-[var(--color-text-secondary)]">Welcome, {username}</p>}
            <Badge variant="success" dot>Coach access</Badge>
          </div>
        </div>
        <Button onClick={() => navigate('/coach/discover')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}>
          Discover Athletes
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Athletes discovered" value={String(discoverableAthletes.length)} sub={discoverableAthletes.length ? 'With saved assessment data' : 'No athletes yet'} />
        <StatCard label="Pending verification" value={String(pendingVerifications.length)} sub={pendingVerifications.length ? 'Awaiting your review' : 'No items waiting'} accent />
        <StatCard label="Verified" value={String(verifiedCount)} sub={verifiedCount ? 'Coach-attested' : 'No verified evidence'} />
        <StatCard label="Saved athletes" value={String(savedAthletes.length)} sub={savedAthletes.length ? 'In your list' : 'No saved athletes'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--color-text)]">Pending Verifications</h2>
                <Badge variant="warning">{pendingVerifications.length}</Badge>
              </div>
              <button onClick={() => navigate('/coach/verification')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">Review all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {pendingVerifications.length ? (
                pendingVerifications.slice(0, 3).map((item) => (
                  <div key={item.athleteUsername} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] group">
                    <Avatar name={item.athleteName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)]">{item.athleteName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.itemType} · {item.metric}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--color-text-muted)]">{item.savedAt ? new Date(item.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'New'}</span>
                      <Badge variant="warning" dot>Pending</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-5 text-sm text-[var(--color-text-muted)]">No athlete evidence is waiting for coach review yet.</div>
              )}
            </div>
          </Card>

          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Athlete Activity</h2>
              <button onClick={() => navigate('/coach/discover')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">Discover more</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentActivity.length ? (
                recentActivity.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] cursor-pointer">
                    <Avatar name={item.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)]">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.sport} · {item.metric}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="ai" className="text-[10px]">{item.status}</Badge>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-5 text-sm text-[var(--color-text-muted)]">No athlete update data is available yet.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/discover')}>
                Search Athletes
              </Button>
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/verification')}>
                Review Verifications ({pendingVerifications.length})
              </Button>
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/saved')}>
                View Saved ({savedAthletes.length})
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Verification activity</h3>
            <div className="space-y-2">
              {[
                { label: 'Pending', count: pendingVerifications.length },
                { label: 'Verified', count: verifiedCount },
                { label: 'Saved', count: savedAthletes.length },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{item.label}</span>
                  <span className="font-mono font-semibold text-[var(--color-text)]">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

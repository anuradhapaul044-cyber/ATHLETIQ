import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const recentAthletes = [
  { name: 'Arjun Sharma', sport: 'Athletics', metric: '42 reps', date: '2h ago', status: 'New result' },
  { name: 'Divya Rao', sport: 'Swimming', metric: '200m: 2:18', date: '1 day ago', status: 'Updated profile' },
  { name: 'Karan Patel', sport: 'Football', metric: 'Sprint: 10.2s', date: '2 days ago', status: 'New assessment' },
];

const pendingVerifications = [
  { athlete: 'Arjun Sharma', metric: 'Push-up: 42 reps', type: 'AI Result', date: 'Sep 12' },
  { athlete: 'Divya Rao', metric: '200m Freestyle', type: 'Match Record', date: 'Sep 8' },
  { athlete: 'Karan Patel', metric: '100m Sprint: 10.2s', type: 'AI Result', date: 'Sep 5' },
];

export default function CoachDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Wednesday, 17 September 2025</p>
          <h1 className="text-2xl font-black text-[var(--color-text)] mt-0.5">Coach Portal</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-[var(--color-text-secondary)]">Welcome, Priya Mehta</p>
            <Badge variant="success" dot>Verified Coach</Badge>
          </div>
        </div>
        <Button onClick={() => navigate('/coach/discover')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}>
          Discover Athletes
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Athletes Discovered" value="48" sub="Total saved profiles" />
        <StatCard label="Pending Verification" value="3" sub="Awaiting your review" accent />
        <StatCard label="Verifications Done" value="27" sub="This month: 8" />
        <StatCard label="Saved Athletes" value="12" sub="In your list" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Pending verifications */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--color-text)]">Pending Verifications</h2>
                <Badge variant="warning">3</Badge>
              </div>
              <button onClick={() => navigate('/coach/verification')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">Review all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {pendingVerifications.map((v, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] group">
                  <Avatar name={v.athlete} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)]">{v.athlete}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{v.type} · {v.metric}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">{v.date}</span>
                    <Badge variant="warning" dot>Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent athlete activity */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Athlete Activity</h2>
              <button onClick={() => navigate('/coach/discover')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">Discover more</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentAthletes.map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] cursor-pointer">
                  <Avatar name={a.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)]">{a.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{a.sport} · {a.metric}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="ai" className="text-[10px]">{a.status}</Badge>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/discover')}>
                Search Athletes
              </Button>
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/verification')}>
                Review Verifications (3)
              </Button>
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/coach/saved')}>
                View Saved (12)
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Your Verification Activity</h3>
            <div className="space-y-2">
              {[
                { month: 'September', count: 8 },
                { month: 'August', count: 14 },
                { month: 'July', count: 5 },
              ].map(m => (
                <div key={m.month} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{m.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-[var(--color-border)] rounded-full h-1.5">
                      <div className="bg-[var(--color-brand)] h-1.5 rounded-full" style={{ width: `${(m.count / 14) * 100}%` }} />
                    </div>
                    <span className="font-mono font-semibold text-[var(--color-text)] w-4 text-right">{m.count}</span>
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

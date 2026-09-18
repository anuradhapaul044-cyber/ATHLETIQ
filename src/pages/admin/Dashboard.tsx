import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const recentActivity = [
  { action: 'Coach account approved', user: 'Priya Mehta', role: 'Coach', time: '10 min ago', type: 'success' },
  { action: 'Athlete profile flagged for review', user: 'Ajay Kumar', role: 'Student', time: '1 hr ago', type: 'warning' },
  { action: 'New opportunity published', user: 'Admin User', role: 'Admin', time: '2 hrs ago', type: 'info' },
  { action: 'Coach application submitted', user: 'Rajesh Verma', role: 'Coach', time: '3 hrs ago', type: 'info' },
  { action: 'Content reported', user: 'User #4921', role: 'Student', time: '5 hrs ago', type: 'danger' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Wednesday, 17 September 2025</p>
          <h1 className="text-2xl font-black text-[var(--color-text)] mt-0.5">Platform Overview</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Administration Dashboard — ATHLETIQ</p>
        </div>
        <Badge variant="warning" dot>5 items need attention</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value="12,840" sub="+142 this week" trend={{ value: '+1.1%', up: true }} />
        <StatCard label="Students" value="11,956" sub="93.1% of users" />
        <StatCard label="Coaches" value="884" sub="840 verified" />
        <StatCard label="Pending Verifications" value="5" sub="Requires action" accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Needs attention */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Requires Attention</h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {[
                { label: 'Pending coach verifications', count: 5, path: '/admin/verification', urgency: 'warning' as const },
                { label: 'Reported content awaiting review', count: 2, path: '/admin/reports', urgency: 'danger' as const },
                { label: 'Opportunities expiring this week', count: 3, path: '/admin/opportunities', urgency: 'warning' as const },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] cursor-pointer" onClick={() => navigate(item.path)}>
                  <Badge variant={item.urgency} dot>{item.count}</Badge>
                  <span className="flex-1 text-sm text-[var(--color-text)]">{item.label}</span>
                  <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform analytics */}
          <Card>
            <h2 className="text-sm font-bold text-[var(--color-text)] mb-4">User Growth (This Year)</h2>
            <div className="flex items-end gap-2 h-28 mb-3">
              {[650, 720, 890, 1100, 980, 1250, 1420, 1180, 1360, 1540, 1820, 2100].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm ${i === 11 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-brand)]/30'}`}
                    style={{ height: `${(v / 2200) * 100}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
            </div>
          </Card>

          {/* Recent activity */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Activity</h2>
              <button onClick={() => navigate('/admin/activity')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">View all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={a.user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text)]">{a.action}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{a.user} · {a.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={a.type as any} className="text-[10px]">{a.type}</Badge>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Quick Navigation</h3>
            <div className="space-y-1.5">
              {[
                { label: 'User Management', path: '/admin/users', count: '12,840' },
                { label: 'Coach Verification', path: '/admin/verification', count: '5 pending', urgent: true },
                { label: 'Opportunities', path: '/admin/opportunities', count: '2,100+' },
                { label: 'Reports', path: '/admin/reports', count: '2 new', urgent: true },
                { label: 'Activity Log', path: '/admin/activity', count: '' },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-muted)] text-sm transition-colors"
                >
                  <span className={item.urgent ? 'text-[var(--color-warning)] font-medium' : 'text-[var(--color-text-secondary)]'}>{item.label}</span>
                  <span className={`text-xs ${item.urgent ? 'text-[var(--color-warning)] font-semibold' : 'text-[var(--color-text-muted)]'}`}>{item.count}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Content Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Active opportunities', value: 2104, color: 'var(--color-success)' },
                { label: 'Pending review', value: 12, color: 'var(--color-warning)' },
                { label: 'Archived', value: 431, color: 'var(--color-text-muted)' },
                { label: 'Reported', value: 2, color: 'var(--color-danger)' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{s.label}</span>
                  <span className="font-mono font-semibold" style={{ color: s.color }}>{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

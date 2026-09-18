import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { getAdminDashboardStats, getRecentActivity } from '../../lib/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const summary = getAdminDashboardStats();
  const recentActivity = getRecentActivity().slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Platform overview</p>
          <h1 className="text-2xl font-black text-[var(--color-text)] mt-0.5">Administration Dashboard</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">ATHLETIQ platform health</p>
        </div>
        <Badge variant={summary.pendingCoachVerifications > 0 ? 'warning' : 'success'} dot>
          {summary.pendingCoachVerifications > 0 ? `${summary.pendingCoachVerifications} items need attention` : 'All clear'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Students" value={String(summary.totalStudents)} sub={summary.totalStudents ? 'Registered users' : 'No student data yet'} />
        <StatCard label="Coaches" value={String(summary.totalCoaches)} sub={summary.totalCoaches ? 'Coach accounts' : 'No coach data yet'} />
        <StatCard label="Pending verification" value={String(summary.pendingCoachVerifications)} sub={summary.pendingCoachVerifications ? 'Needs action' : 'None pending'} accent />
        <StatCard label="Assessments" value={String(summary.totalAssessments)} sub={summary.totalAssessments ? 'Saved result files' : 'No assessments yet'} />
        <StatCard label="Opportunities" value={String(summary.totalOpportunities)} sub={summary.totalOpportunities ? 'Shared catalogue' : 'No opportunities yet'} />
        <StatCard label="Activity" value={String(recentActivity.length)} sub={recentActivity.length ? 'Recent platform actions' : 'No activity yet'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">System status</h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {[
                { label: 'Pending coach verifications', count: summary.pendingCoachVerifications, path: '/admin/verification', urgency: 'warning' as const },
                { label: 'Saved opportunities', count: summary.totalOpportunities, path: '/admin/opportunities', urgency: 'success' as const },
                { label: 'Recent activity entries', count: recentActivity.length, path: '/admin/activity', urgency: 'default' as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-elevated)] cursor-pointer" onClick={() => navigate(item.path)}>
                  <Badge variant={item.urgency === 'warning' ? 'warning' : item.urgency === 'success' ? 'success' : 'default'} dot>{item.count}</Badge>
                  <span className="flex-1 text-sm text-[var(--color-text)]">{item.label}</span>
                  <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Activity</h2>
              <button onClick={() => navigate('/admin/activity')} className="text-xs text-[var(--color-brand)] font-medium hover:underline">View all</button>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentActivity.length ? (
                recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar name={entry.actor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text)]">{entry.action}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{entry.actor} · {entry.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge variant={entry.type === 'danger' ? 'danger' : entry.type === 'warning' ? 'warning' : entry.type === 'success' ? 'success' : 'default'} className="text-[10px]">{entry.type}</Badge>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{new Date(entry.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-5 text-sm text-[var(--color-text-muted)]">No recent activity is available yet.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Quick navigation</h3>
            <div className="space-y-1.5">
              {[
                { label: 'User Management', path: '/admin/users', count: String(summary.totalStudents + summary.totalCoaches) },
                { label: 'Coach Verification', path: '/admin/verification', count: String(summary.pendingCoachVerifications), urgent: true },
                { label: 'Opportunity Catalog', path: '/admin/opportunities', count: String(summary.totalOpportunities) },
                { label: 'Reports', path: '/admin/reports', count: '0' },
                { label: 'Activity Log', path: '/admin/activity', count: String(recentActivity.length) },
              ].map((item) => (
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
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Current platform snapshot</h3>
            <div className="space-y-2">
              {[
                { label: 'Students', value: summary.totalStudents },
                { label: 'Coaches', value: summary.totalCoaches },
                { label: 'Pending verification', value: summary.pendingCoachVerifications },
                { label: 'Saved opportunities', value: summary.totalOpportunities },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{item.label}</span>
                  <span className="font-mono font-semibold text-[var(--color-text)]">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

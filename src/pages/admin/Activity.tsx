import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { getRecentActivity } from '../../lib/admin';

export default function AdminActivity() {
  const activities = getRecentActivity();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Activity Log</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Recent platform and administrative actions from the current app state.</p>
      </div>

      {activities.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No activity entries are available yet.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-[var(--color-border)]">
            {activities.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--color-elevated)]">
                <Avatar name={entry.actor} size="sm" className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{entry.action}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{entry.actor} · {entry.role} · {entry.details}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={entry.type === 'danger' ? 'danger' : entry.type === 'warning' ? 'warning' : entry.type === 'success' ? 'success' : 'default'} className="text-[10px]">{entry.type}</Badge>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{new Date(entry.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

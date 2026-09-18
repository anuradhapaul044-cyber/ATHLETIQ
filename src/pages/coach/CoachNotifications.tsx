import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getCoachNotifications } from '../../lib/coach';
import { EmptyState } from '../../components/ui/EmptyState';

export default function CoachNotifications() {
  const notifications = getCoachNotifications();

  if (!notifications.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[var(--color-text)]">Notifications</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Coach activity and verification updates.</p>
        </div>
        <EmptyState
          title="No notifications yet"
          description="Saved athletes and verification activity will appear here once you start reviewing evidence."
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Notifications</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Recent coach activity and athlete updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} hoverable>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={notification.type === 'verification' ? 'warning' : notification.type === 'saved' ? 'success' : 'ai'} className="text-[10px] uppercase">
                    {notification.type}
                  </Badge>
                  <p className="text-sm font-bold text-[var(--color-text)]">{notification.title}</p>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{notification.message}</p>
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                {new Date(notification.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const activities = [
  { action: 'Coach account approved', user: 'Priya Mehta', role: 'Coach', adminAction: 'Admin User', time: '10 min ago', type: 'success' as const },
  { action: 'Athlete profile flagged for review', user: 'Ajay Kumar', role: 'Student', adminAction: 'Auto-flagged', time: '1 hr ago', type: 'warning' as const },
  { action: 'New opportunity published', user: 'SAI Trials 2025', role: 'Opportunity', adminAction: 'Admin User', time: '2 hrs ago', type: 'ai' as const },
  { action: 'Coach application submitted', user: 'Rajesh Verma', role: 'Coach', adminAction: 'System', time: '3 hrs ago', type: 'default' as const },
  { action: 'Content reported', user: 'User #4921', role: 'Student', adminAction: 'Auto-flagged', time: '5 hrs ago', type: 'danger' as const },
  { action: 'Opportunity archived', user: 'U-17 Trial 2024', role: 'Opportunity', adminAction: 'Admin User', time: 'Yesterday', type: 'default' as const },
  { action: 'New student registered', user: 'Ananya Das', role: 'Student', adminAction: 'System', time: 'Yesterday', type: 'success' as const },
];

export default function AdminActivity() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Activity Log</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Recent platform and administrative actions</p>
      </div>

      <Card padding="none">
        <div className="divide-y divide-[var(--color-border)]">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--color-elevated)]">
              <Avatar name={a.user} size="sm" className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)]">{a.action}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{a.user} · {a.role} · via {a.adminAction}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge variant={a.type} className="text-[10px]">{a.type}</Badge>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { getAppUsers, setAppUserStatus, type PlatformUserStatus } from '../../lib/admin';

export default function CoachVerification() {
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PlatformUserStatus>('pending');
  const coaches = useMemo(() => getAppUsers().filter((user) => user.role === 'coach'), []);

  const filtered = coaches.filter((coach) => filter === 'all' || coach.status === filter);

  const selected = filtered.find((coach) => coach.username === selectedUsername) ?? filtered[0] ?? null;

  const updateStatus = (username: string, status: PlatformUserStatus) => {
    setAppUserStatus(username, status);
    setSelectedUsername(username);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Coach Verification</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review coach applications and evidence status in the current app state.</p>
      </div>

      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((option) => {
          const count = option === 'all' ? coaches.length : coaches.filter((coach) => coach.status === option).length;
          return (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors flex items-center gap-1.5 ${filter === option ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {option} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === option ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {coaches.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No coach verification records are available yet.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((coach) => (
              <Card key={coach.username} hoverable onClick={() => setSelectedUsername(coach.username)} className={selected?.username === coach.username ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}>
                <div className="flex items-start gap-3">
                  <Avatar name={coach.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--color-text)]">{coach.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{coach.sport} · {coach.location}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">@{coach.username}</p>
                  </div>
                  <Badge variant={coach.status === 'pending' ? 'warning' : coach.status === 'verified' ? 'success' : 'danger'} dot className="text-[10px] capitalize">
                    {coach.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <Card>
                <div className="flex items-center gap-3 mb-5">
                  <Avatar name={selected.name} size="lg" />
                  <div>
                    <h2 className="text-lg font-bold text-[var(--color-text)]">{selected.name}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{selected.email}</p>
                  </div>
                  <Badge variant={selected.status === 'pending' ? 'warning' : selected.status === 'verified' ? 'success' : 'danger'} dot className="ml-auto capitalize">{selected.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Sport', value: selected.sport },
                    { label: 'Location', value: selected.location },
                    { label: 'Applied', value: new Date(selected.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) },
                    { label: 'Status', value: selected.status },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-sm)]">
                      <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-[var(--color-text)]">{item.value}</p>
                    </div>
                  ))}
                </div>

                {selected.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button variant="danger" onClick={() => updateStatus(selected.username, 'rejected')}>Reject</Button>
                    <Button fullWidth onClick={() => updateStatus(selected.username, 'verified')}>
                      Approve coach
                    </Button>
                  </div>
                )}

                {selected.status === 'verified' && (
                  <div className="p-3 bg-[var(--color-success-light)] rounded flex items-center gap-2">
                    <span className="text-[var(--color-success)]">✓</span>
                    <p className="text-sm text-[var(--color-success)] font-medium">Coach profile verified.</p>
                  </div>
                )}

                {selected.status === 'rejected' && (
                  <div className="p-3 bg-[var(--color-danger-light)] rounded flex items-center gap-2">
                    <span className="text-[var(--color-danger)]">!</span>
                    <p className="text-sm text-[var(--color-danger)] font-medium">Coach application rejected.</p>
                  </div>
                )}
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] text-center px-6">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Select a coach application to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

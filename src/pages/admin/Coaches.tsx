import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { getAppUsers, setAppUserStatus, type PlatformUserStatus } from '../../lib/admin';

export default function AdminCoaches() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlatformUserStatus>('all');
  const coaches = useMemo(() => getAppUsers().filter((user) => user.role === 'coach'), []);

  const filtered = coaches.filter((coach) => {
    const matchesSearch = !search || coach.name.toLowerCase().includes(search.toLowerCase()) || coach.email.toLowerCase().includes(search.toLowerCase()) || coach.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coach.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (username: string, status: PlatformUserStatus) => {
    setAppUserStatus(username, status);
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Coach Management</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review coach accounts and status.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search coach name or username..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          />
        </div>
        <div className="flex bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-1">
          {(['all', 'pending', 'verified', 'rejected', 'active'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium capitalize rounded transition-all ${statusFilter === filter ? 'bg-white shadow text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No coach accounts are available yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((coach) => (
            <Card key={coach.username} hoverable>
              <div className="flex items-start gap-3">
                <Avatar name={coach.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[var(--color-text)]">{coach.name}</h3>
                    <Badge variant={coach.status === 'verified' || coach.status === 'active' ? 'success' : coach.status === 'pending' ? 'warning' : 'danger'} dot className="text-[10px] capitalize">
                      {coach.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">@{coach.username} · {coach.email}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{coach.sport} · {coach.location} · Joined {new Date(coach.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {coach.status !== 'verified' && coach.status !== 'active' && (
                    <Button variant="outline" size="sm" onClick={() => updateStatus(coach.username, 'verified')}>Approve</Button>
                  )}
                  {coach.status !== 'rejected' && (
                    <Button variant="ghost" size="sm" onClick={() => updateStatus(coach.username, 'rejected')}>Reject</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

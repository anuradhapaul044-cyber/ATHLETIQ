import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';

type Status = 'pending' | 'approved' | 'rejected';

const initialCoaches = [
  { id: 1, name: 'Rajesh Verma', email: 'rajesh@example.com', sport: 'Football', org: 'Mumbai FC Academy', submitted: 'Sep 14, 2025', status: 'pending' as Status, docs: 'NIS Certificate, AIFF License' },
  { id: 2, name: 'Sunita Joshi', email: 'sunita@example.com', sport: 'Athletics', org: 'SAI Training Center', submitted: 'Sep 10, 2025', status: 'pending' as Status, docs: 'NIS Certificate, SAI Affiliation Letter' },
  { id: 3, name: 'Mohan Das', email: 'mohan@example.com', sport: 'Swimming', org: 'Aqua Sports Academy', submitted: 'Sep 8, 2025', status: 'approved' as Status, docs: 'SWIM India License' },
  { id: 4, name: 'Anita Rao', email: 'anita@example.com', sport: 'Badminton', org: 'BWF Affiliated Club', submitted: 'Sep 5, 2025', status: 'pending' as Status, docs: 'BWF Level 2 Certificate' },
];

export default function CoachVerification() {
  const [coaches, setCoaches] = useState(initialCoaches);
  const [selected, setSelected] = useState<typeof initialCoaches[0] | null>(null);
  const [filter, setFilter] = useState<'all' | Status>('pending');

  const updateStatus = (id: number, status: Status) => {
    setCoaches(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(null);
  };

  const filtered = coaches.filter(c => filter === 'all' || c.status === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Coach Verification</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review and approve coach registration applications</p>
      </div>

      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => {
          const count = f === 'all' ? coaches.length : coaches.filter(c => c.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors flex items-center gap-1.5 ${filter === f ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
              {f} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(c => (
            <Card key={c.id} hoverable onClick={() => setSelected(c)} className={selected?.id === c.id ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}>
              <div className="flex items-start gap-3">
                <Avatar name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--color-text)]">{c.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{c.sport} · {c.org}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Applied: {c.submitted}</p>
                </div>
                <Badge variant={c.status === 'pending' ? 'warning' : c.status === 'approved' ? 'success' : 'danger'} dot className="text-[10px] capitalize">
                  {c.status}
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
                <Badge variant={selected.status === 'pending' ? 'warning' : selected.status === 'approved' ? 'success' : 'danger'} dot className="ml-auto capitalize">{selected.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Sport', value: selected.sport },
                  { label: 'Organisation', value: selected.org },
                  { label: 'Applied', value: selected.submitted },
                  { label: 'Documentation', value: selected.docs },
                ].map(f => (
                  <div key={f.label} className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-sm)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-[var(--radius-sm)] mb-5">
                <p className="text-xs text-[var(--color-warning)]">
                  <strong>Admin note:</strong> Verify submitted documentation before approving. Approved coaches can access athlete profiles, add evidence, and verify results on the platform.
                </p>
              </div>

              {selected.status === 'pending' && (
                <div className="flex gap-3">
                  <Button variant="danger" onClick={() => updateStatus(selected.id, 'rejected')}>Reject Application</Button>
                  <Button variant="secondary" onClick={() => {}}>Request More Info</Button>
                  <Button fullWidth onClick={() => updateStatus(selected.id, 'approved')}
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    Approve Coach
                  </Button>
                </div>
              )}
              {selected.status === 'approved' && (
                <div className="p-3 bg-[var(--color-success-light)] rounded flex items-center gap-2">
                  <span className="text-[var(--color-success)]">✓</span>
                  <p className="text-sm text-[var(--color-success)] font-medium">Coach verified and approved.</p>
                </div>
              )}
              {selected.status === 'rejected' && (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-[var(--color-danger)]">Application rejected.</p>
                  <Button variant="outline" size="sm" onClick={() => updateStatus(selected.id, 'pending')}>Reconsider</Button>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] text-center px-6">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Select an application to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

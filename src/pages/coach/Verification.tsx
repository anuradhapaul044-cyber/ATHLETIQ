import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  getCoachVerificationQueue,
  setCoachVerificationStatus,
  type CoachVerificationRecord,
  type CoachVerificationStatus,
} from '../../lib/coach';

type FilterStatus = 'all' | CoachVerificationStatus;

export default function Verification() {
  const [items, setItems] = useState<CoachVerificationRecord[]>(() => getCoachVerificationQueue());
  const [selected, setSelected] = useState<CoachVerificationRecord | null>(null);
  const [observation, setObservation] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    if (!items.length) {
      setSelected(null);
      return;
    }
    if (!selected || !items.some((item) => item.athleteUsername === selected.athleteUsername)) {
      setSelected(items[0]);
    }
  }, [items, selected]);

  const refreshQueue = () => setItems(getCoachVerificationQueue());

  const updateStatus = (athleteUsername: string, status: CoachVerificationStatus) => {
    setCoachVerificationStatus(athleteUsername, status, observation);
    setObservation('');
    refreshQueue();
  };

  const filtered = items.filter((item) => filter === 'all' || item.status === filter);

  if (!items.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[var(--color-text)]">Evidence Verification</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review athlete results and evidence submitted for verification.</p>
        </div>
        <EmptyState title="No verification items yet" description="Athlete assessment evidence will appear here when it is available for coach review." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Evidence Verification</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review athlete results and evidence submitted for coach attestation.</p>
      </div>

      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((filterOption) => {
          const count = filterOption === 'all' ? items.length : items.filter((item) => item.status === filterOption).length;
          return (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors flex items-center gap-1.5 ${
                filter === filterOption ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {filterOption} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === filterOption ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.athleteUsername}
              hoverable
              onClick={() => setSelected(item)}
              className={selected?.athleteUsername === item.athleteUsername ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}
            >
              <div className="flex items-start gap-3">
                <Avatar name={item.athleteName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--color-text)]">{item.athleteName}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">{item.athleteSport} · {item.itemType}</p>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">{item.metric}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[var(--color-text-muted)]">{new Date(item.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <Badge variant={item.status === 'pending' ? 'warning' : item.status === 'verified' ? 'success' : 'danger'} dot>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={selected.athleteName} size="md" />
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text)]">{selected.athleteName}</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{selected.athleteSport} · {new Date(selected.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <Badge variant={selected.status === 'pending' ? 'warning' : selected.status === 'verified' ? 'success' : 'danger'} dot className="ml-auto">
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </Badge>
              </div>

              <div className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-md)] mb-4">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{selected.itemType}</p>
                <p className="text-sm font-bold text-[var(--color-text)]">{selected.metric}</p>
              </div>

              <div className="p-3 bg-[var(--color-ai-light)] border border-[var(--color-ai)]/20 rounded-[var(--radius-md)] mb-4">
                <p className="text-xs font-semibold text-[var(--color-ai)] uppercase tracking-wider mb-1">AI-assisted assessment</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{selected.details}</p>
              </div>

              {selected.reviewedBy && selected.reviewedAt && (
                <div className="mb-4 text-xs text-[var(--color-text-muted)]">
                  Reviewed by {selected.reviewedBy} on {new Date(selected.reviewedAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
              )}

              {selected.status === 'pending' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Your observation (optional)</label>
                    <textarea
                      className="w-full h-24 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40 focus:border-[var(--color-ai)] resize-none"
                      placeholder="Add an observation to note what you reviewed..."
                      value={observation}
                      onChange={(event) => setObservation(event.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-[var(--radius-sm)] mb-4">
                    <p className="text-xs text-[var(--color-warning)]">
                      <strong>Note:</strong> Coach attestation confirms the evidence was reviewed. It does not replace the AI-generated result; it adds a human verification layer.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="danger" size="sm" onClick={() => updateStatus(selected.athleteUsername, 'rejected')}>
                      Needs review
                    </Button>
                    <Button fullWidth onClick={() => updateStatus(selected.athleteUsername, 'verified')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                      Attest & verify evidence
                    </Button>
                  </div>
                </>
              )}

              {selected.status === 'verified' && (
                <div className="p-3 bg-[var(--color-success-light)] rounded-[var(--radius-md)] flex items-center gap-2">
                  <span className="text-[var(--color-success)]">✓</span>
                  <p className="text-sm text-[var(--color-success)] font-medium">Coach attestation recorded for this athlete.</p>
                </div>
              )}

              {selected.status === 'rejected' && (
                <div className="p-3 bg-[var(--color-danger-light)] rounded-[var(--radius-md)]">
                  <p className="text-sm text-[var(--color-danger)] font-medium">Marked as needing review.</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => updateStatus(selected.athleteUsername, 'pending')}>
                    Reset to pending
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] text-center px-6">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Select an item to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

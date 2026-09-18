import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';

type VerStatus = 'pending' | 'verified' | 'rejected';

const initialItems = [
  {
    id: 1,
    athlete: 'Arjun Sharma',
    sport: 'Athletics',
    type: 'AI Assessment Result',
    metric: 'Push-ups: 42 reps · Form Score: 8.4/10',
    date: 'Sep 12, 2025',
    status: 'pending' as VerStatus,
    details: 'AI analysis completed on uploaded video. 42 valid repetitions detected with average form score of 8.4/10. Depth consistency: 88%, body alignment: 92%, tempo control: 74%.',
  },
  {
    id: 2,
    athlete: 'Divya Rao',
    sport: 'Swimming',
    type: 'Match Record',
    metric: '200m Freestyle: 2:18.4',
    date: 'Sep 8, 2025',
    status: 'pending' as VerStatus,
    details: 'Self-reported match record from State Swimming Championship. Athlete requests coach attestation.',
  },
  {
    id: 3,
    athlete: 'Karan Patel',
    sport: 'Athletics',
    type: 'AI Assessment Result',
    metric: '100m Sprint: 10.2s',
    date: 'Sep 5, 2025',
    status: 'pending' as VerStatus,
    details: 'AI-analysed sprint timing from video upload. Single timing result; no form evaluation for sprint assessments.',
  },
];

export default function Verification() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<typeof initialItems[0] | null>(null);
  const [observation, setObservation] = useState('');
  const [filter, setFilter] = useState<'all' | VerStatus>('all');

  const updateStatus = (id: number, status: VerStatus) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setSelected(null);
    setObservation('');
  };

  const filtered = items.filter(i => filter === 'all' || i.status === filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Evidence Verification</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Review athlete results and evidence submitted for verification</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-[var(--color-border)] mb-5">
        {(['all', 'pending', 'verified', 'rejected'] as const).map(f => {
          const count = f === 'all' ? items.length : items.filter(i => i.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors flex items-center gap-1.5 ${
                filter === f ? 'border-[var(--color-brand)] text-[var(--color-brand)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {f} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-muted)] text-[var(--color-text-muted)]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(item => (
            <Card
              key={item.id}
              hoverable
              onClick={() => setSelected(item)}
              className={selected?.id === item.id ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}
            >
              <div className="flex items-start gap-3">
                <Avatar name={item.athlete} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--color-text)]">{item.athlete}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">{item.sport} · {item.type}</p>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">{item.metric}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[var(--color-text-muted)]">{item.date}</span>
                <Badge variant={item.status === 'pending' ? 'warning' : item.status === 'verified' ? 'success' : 'danger'} dot>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={selected.athlete} size="md" />
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text)]">{selected.athlete}</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{selected.sport} · {selected.date}</p>
                </div>
                <Badge variant={selected.status === 'pending' ? 'warning' : selected.status === 'verified' ? 'success' : 'danger'} dot className="ml-auto">
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </Badge>
              </div>

              <div className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-md)] mb-4">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{selected.type}</p>
                <p className="text-sm font-bold text-[var(--color-text)]">{selected.metric}</p>
              </div>

              <div className="p-3 bg-[var(--color-ai-light)] border border-[var(--color-ai)]/20 rounded-[var(--radius-md)] mb-4">
                <p className="text-xs font-semibold text-[var(--color-ai)] uppercase tracking-wider mb-1">Assessment Details</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{selected.details}</p>
              </div>

              {selected.status === 'pending' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Your observation (optional)</label>
                    <textarea
                      className="w-full h-24 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40 focus:border-[var(--color-ai)] resize-none"
                      placeholder="Add your observation to accompany this verification..."
                      value={observation}
                      onChange={e => setObservation(e.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-[var(--radius-sm)] mb-4">
                    <p className="text-xs text-[var(--color-warning)]">
                      <strong>Note:</strong> Attesting this result confirms you have reviewed the evidence. You are not modifying the AI-generated result — you are adding coach attestation to it.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="danger" size="sm" onClick={() => updateStatus(selected.id, 'rejected')}>
                      Needs Review
                    </Button>
                    <Button fullWidth onClick={() => updateStatus(selected.id, 'verified')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                      Attest & Verify Evidence
                    </Button>
                  </div>
                </>
              )}

              {selected.status === 'verified' && (
                <div className="p-3 bg-[var(--color-success-light)] rounded-[var(--radius-md)] flex items-center gap-2">
                  <span className="text-[var(--color-success)]">✓</span>
                  <p className="text-sm text-[var(--color-success)] font-medium">Evidence verified and added to athlete profile.</p>
                </div>
              )}

              {selected.status === 'rejected' && (
                <div className="p-3 bg-[var(--color-danger-light)] rounded-[var(--radius-md)]">
                  <p className="text-sm text-[var(--color-danger)] font-medium">Marked as needs review.</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => updateStatus(selected.id, 'pending')}>
                    Reset to Pending
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

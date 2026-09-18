import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const records = [
  { event: 'State Athletics Championship', date: 'Aug 2025', sport: 'Athletics', competition: '100m Sprint', result: '3rd Place', time: '10.8s', verified: 'official' as const },
  { event: 'District Sports Meet', date: 'Nov 2024', sport: 'Athletics', competition: '100m Sprint', result: '1st Place', time: '10.9s', verified: 'official' as const },
  { event: 'School Inter-House Athletics', date: 'Jan 2025', sport: 'Athletics', competition: '200m Sprint', result: '1st Place', time: '22.1s', verified: 'self' as const },
];

export default function MatchRecords() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Match Records</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your competition history and achievements</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add Record
        </Button>
      </div>

      <div className="space-y-3">
        {records.map((r, i) => (
          <Card key={i} hoverable>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[var(--color-text)]">{r.event}</h3>
                  <Badge variant={r.verified === 'official' ? 'official' : 'self'} className="text-[10px]">
                    {r.verified === 'official' ? 'Officially Verified' : 'Self-Reported'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">{r.sport} · {r.competition} · {r.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-[var(--color-brand)]">{r.result}</p>
                {r.time && <p className="text-xs font-mono text-[var(--color-text-muted)]">{r.time}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Match Record"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddOpen(false)}>Save Record</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[var(--color-warning-light)] rounded-[var(--radius-sm)]">
            <p className="text-xs text-[var(--color-warning)]">Self-reported records are labelled accordingly on your profile. To have records officially verified, contact a verified coach.</p>
          </div>
          <Input label="Event / Competition name" placeholder="e.g. State Athletics Championship" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" />
            <Input label="Sport" placeholder="e.g. Athletics" />
          </div>
          <Input label="Event / Discipline" placeholder="e.g. 100m Sprint" />
          <Input label="Result / Achievement" placeholder="e.g. 1st Place, 10.8s" />
        </div>
      </Modal>
    </div>
  );
}

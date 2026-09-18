import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const reports = [
  { id: 1, type: 'Fake evidence claim', target: 'Profile — Ajay Kumar', reported: 'Anonymous User', date: 'Sep 16, 2025', status: 'new' },
  { id: 2, type: 'Inaccurate opportunity', target: 'Opportunity — State Football Trial', reported: 'Meera Singh', date: 'Sep 14, 2025', status: 'new' },
  { id: 3, type: 'Spam / inappropriate profile', target: 'Profile — User #5821', reported: 'Karan Patel', date: 'Sep 12, 2025', status: 'resolved' },
];

export default function Reports() {
  const [items, setItems] = useState(reports);

  const resolve = (id: number) => setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Reports</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Flagged content and user-submitted reports</p>
      </div>

      <div className="space-y-3">
        {items.map(r => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={r.status === 'new' ? 'danger' : 'success'} dot className="text-[10px]">{r.status}</Badge>
                  <span className="text-xs text-[var(--color-text-muted)]">{r.date}</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text)]">{r.type}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{r.target}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Reported by: {r.reported}</p>
              </div>
              {r.status === 'new' && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button variant="ghost" size="sm" onClick={() => resolve(r.id)}>Dismiss</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

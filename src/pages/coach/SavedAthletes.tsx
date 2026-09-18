import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';

const saved = [
  { id: 1, name: 'Arjun Sharma', sport: 'Athletics', age: 17, location: 'Mumbai', metric: '42 reps', verified: true, note: 'Promising sprinter, follow up after trials' },
  { id: 2, name: 'Divya Rao', sport: 'Swimming', age: 16, location: 'Chennai', metric: '2:18.4', verified: true, note: '' },
];

export default function SavedAthletes() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Saved Athletes</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{saved.length} athletes in your list</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/coach/discover')}>+ Discover More</Button>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved athletes yet"
          description="Use the Discover Athletes feature to find and save athletes to your list."
          action={{ label: 'Discover Athletes', onClick: () => navigate('/coach/discover') }}
        />
      ) : (
        <div className="space-y-3">
          {saved.map(a => (
            <Card key={a.id} hoverable>
              <div className="flex items-start gap-3">
                <Avatar name={a.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-[var(--color-text)]">{a.name}</h3>
                    {a.verified && <Badge variant="success" className="text-[10px]">Verified</Badge>}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">{a.sport} · Age {a.age} · {a.location}</p>
                  <p className="text-sm font-mono font-semibold text-[var(--color-brand)]">{a.metric}</p>
                  {a.note && <p className="text-xs italic text-[var(--color-text-muted)] mt-1">Note: {a.note}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => navigate('/student/profile')}>View</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

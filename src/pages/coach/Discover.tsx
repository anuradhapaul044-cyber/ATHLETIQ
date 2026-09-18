import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';

const athletes = [
  { id: 1, name: 'Arjun Sharma', sport: 'Athletics', age: 17, location: 'Mumbai', metric: '42 reps', metricLabel: 'Push-ups', score: 8.4, verified: true, saved: false },
  { id: 2, name: 'Divya Rao', sport: 'Swimming', age: 16, location: 'Chennai', metric: '2:18.4', metricLabel: '200m Freestyle', score: 7.9, verified: true, saved: true },
  { id: 3, name: 'Karan Patel', sport: 'Athletics', age: 18, location: 'Ahmedabad', metric: '10.2s', metricLabel: '100m Sprint', score: 8.1, verified: false, saved: false },
  { id: 4, name: 'Meera Singh', sport: 'Badminton', age: 16, location: 'Delhi', metric: '38 reps', metricLabel: 'Push-ups', score: 7.5, verified: true, saved: false },
  { id: 5, name: 'Rohit Kumar', sport: 'Football', age: 17, location: 'Kolkata', metric: '9.8s', metricLabel: '60m Sprint', score: 8.7, verified: true, saved: false },
  { id: 6, name: 'Ananya Das', sport: 'Athletics', age: 15, location: 'Pune', metric: '45 reps', metricLabel: 'Push-ups', score: 9.0, verified: true, saved: false },
];

const sports = ['All Sports', 'Athletics', 'Swimming', 'Football', 'Badminton', 'Basketball', 'Cricket'];

export default function Discover() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('All Sports');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [savedList, setSavedList] = useState<number[]>([2]);

  const filtered = athletes.filter(a =>
    (sport === 'All Sports' || a.sport === sport) &&
    (!verifiedOnly || a.verified) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.sport.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSave = (id: number) => {
    setSavedList(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Discover Athletes</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Search verified athlete profiles by sport, location, and performance</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search by name, sport, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Sport</label>
            <select
              value={sport}
              onChange={e => setSport(e.target.value)}
              className="h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40"
            >
              {sports.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={e => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-brand)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">Verified results only</span>
          </label>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mb-4">{filtered.length} athletes found</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <Card key={a.id} hoverable className="flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <Avatar name={a.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="text-sm font-bold text-[var(--color-text)] truncate">{a.name}</h3>
                  {a.verified && <span className="text-[var(--color-success)] text-xs">✓</span>}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{a.sport} · {a.location}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Age {a.age}</p>
              </div>
            </div>

            <div className="flex-1 bg-[var(--color-elevated)] rounded-[var(--radius-sm)] p-3 mb-3">
              <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{a.metricLabel}</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-black text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.metric}</p>
                <Badge variant={a.verified ? 'ai' : 'self'} className="text-[10px] mb-0.5">
                  {a.verified ? 'AI-Verified' : 'Self-reported'}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">Form: </span>
                <span className="text-[10px] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>{a.score}/10</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/student/profile`)}>
                View Profile
              </Button>
              <button
                onClick={() => toggleSave(a.id)}
                className={`px-3 h-8 rounded-[var(--radius-sm)] border text-sm transition-colors ${
                  savedList.includes(a.id)
                    ? 'bg-[var(--color-brand)]/8 border-[var(--color-brand)]/30 text-[var(--color-brand)]'
                    : 'border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-brand)]/50 hover:text-[var(--color-brand)]'
                }`}
                aria-label={savedList.includes(a.id) ? 'Unsave' : 'Save athlete'}
              >
                {savedList.includes(a.id) ? '★' : '☆'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center mb-3 text-[var(--color-text-muted)]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">No athletes found</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

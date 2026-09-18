import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getOpportunities, opportunityCategories, type Opportunity } from '../../lib/opportunities';

const categories = ['All', ...opportunityCategories] as const;

export default function Opportunities() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<(typeof categories)[number]>('All');
  const opportunities = getOpportunities();
  const [selected, setSelected] = useState<Opportunity | null>(opportunities[0] ?? null);

  const filtered = useMemo(() =>
    opportunities.filter((opportunity) => {
      const matchesCategory = cat === 'All' || opportunity.category === cat;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || opportunity.title.toLowerCase().includes(query) || opportunity.sport.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }),
    [cat, search, opportunities]
  );

  useEffect(() => {
    if (!filtered.some((opportunity) => opportunity.id === selected?.id)) {
      setSelected(filtered[0] ?? null);
    }
  }, [filtered, selected]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Opportunities</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Trials, scholarships, and programmes matched to your profile</p>
        </div>
        <Badge variant="ai" dot>{filtered.length} matching your profile</Badge>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or sport..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCat(category)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              cat === category ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]' : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand)]/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((opportunity) => (
            <Card
              key={opportunity.id}
              hoverable
              onClick={() => setSelected(opportunity)}
              className={selected?.id === opportunity.id ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-text-secondary)]">{opportunity.category}</span>
                    <Badge variant={opportunity.source === 'demo' ? 'warning' : 'success'} className="text-[10px]">{opportunity.source === 'demo' ? 'Demo Listing' : 'Official Source'}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text)] mb-1">{opportunity.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{opportunity.sport} · {opportunity.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-black text-[var(--color-success)]" style={{ fontFamily: 'var(--font-mono)' }}>{opportunity.match}%</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">profile match</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-[var(--color-warning)] font-medium">Deadline: {opportunity.deadline}</span>
                <span className="text-xs text-[var(--color-brand)] font-medium">View details →</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={selected.source === 'demo' ? 'warning' : 'success'}>
                  {selected.source === 'demo' ? 'Demo Content' : 'Official Source'}
                </Badge>
                <span className="text-xs bg-[var(--color-muted)] px-2 py-0.5 rounded text-[var(--color-text-secondary)]">{selected.category}</span>
              </div>
              <h2 className="text-base font-black text-[var(--color-text)] mb-1">{selected.title}</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">{selected.organization} · {selected.location}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">{selected.description}</p>
              <div className="space-y-2 mb-5 p-3 bg-[var(--color-elevated)] rounded-[var(--radius-md)]">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">Profile match</span>
                  <span className="font-bold text-[var(--color-success)]">{selected.match}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">Deadline</span>
                  <span className="font-medium text-[var(--color-warning)]">{selected.deadline}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">Status</span>
                  <span className="font-medium text-[var(--color-text)]">{selected.status ?? 'Open'}</span>
                </div>
              </div>
              <div className="mb-4 p-2.5 bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-[var(--radius-sm)]">
                <p className="text-xs text-[var(--color-warning)]">{selected.eligibility}</p>
              </div>
              <Button fullWidth>{selected.actionLabel}</Button>
            </Card>
          ) : (
            <div className="sticky top-6 flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] text-center px-6">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Select an opportunity to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

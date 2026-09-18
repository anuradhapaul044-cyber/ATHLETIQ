import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import {
  getCoachSavedAthletes,
  getDiscoverableAthletes,
  removeCoachAthlete,
  saveCoachAthlete,
  type AthleteDiscoveryEntry,
} from '../../lib/coach';

export default function Discover() {
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('All Sports');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [savedUsernames, setSavedUsernames] = useState<string[]>(() => getCoachSavedAthletes().map((item) => item.athleteUsername));
  const athletes = getDiscoverableAthletes();

  const sports = useMemo(
    () => ['All Sports', ...new Set(athletes.map((athlete) => athlete.sport).filter(Boolean))],
    [athletes],
  );

  const filtered = useMemo(
    () => athletes.filter((athlete) => {
      const matchesSport = sport === 'All Sports' || athlete.sport === sport;
      const matchesVerified = !verifiedOnly || athlete.verificationStatus === 'verified';
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || athlete.name.toLowerCase().includes(query) || athlete.username.toLowerCase().includes(query) || (athlete.location ?? '').toLowerCase().includes(query) || athlete.sport.toLowerCase().includes(query);
      return matchesSport && matchesVerified && matchesSearch;
    }),
    [athletes, search, sport, verifiedOnly],
  );

  const [selected, setSelected] = useState<AthleteDiscoveryEntry | null>(filtered[0] ?? null);

  useEffect(() => {
    if (!filtered.some((athlete) => athlete.username === selected?.username)) {
      setSelected(filtered[0] ?? null);
    }
  }, [filtered, selected]);

  const refreshSaved = () => setSavedUsernames(getCoachSavedAthletes().map((entry) => entry.athleteUsername));

  const toggleSave = (username: string) => {
    if (savedUsernames.includes(username)) {
      removeCoachAthlete(username);
    } else {
      saveCoachAthlete(username);
    }
    refreshSaved();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Discover Athletes</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Search athletes by name, sport, location, and assessment result.</p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search by name, username, sport, or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Sport</label>
            <select
              value={sport}
              onChange={(event) => setSport(event.target.value)}
              className="h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40"
            >
              {sports.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="w-4 h-4 accent-[var(--color-brand)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">Verified only</span>
          </label>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mb-4">{filtered.length} athletes found</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center mb-3 text-[var(--color-text-muted)]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">No athletes found</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 space-y-3">
            {filtered.map((athlete) => (
              <Card
                key={athlete.username}
                hoverable
                onClick={() => setSelected(athlete)}
                className={selected?.username === athlete.username ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20' : ''}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={athlete.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[var(--color-text)] truncate">{athlete.name}</h3>
                      {athlete.verificationStatus === 'verified' && <span className="text-[var(--color-success)] text-xs">✓</span>}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{athlete.sport}{athlete.location ? ` · ${athlete.location}` : ''}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">@{athlete.username}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-black text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {athlete.latestAssessment ? `${athlete.latestAssessment.completed_reps}r` : athlete.matchRecords[0] ? 'Record' : '—'}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">result</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={athlete.verificationStatus === 'verified' ? 'success' : athlete.verificationStatus === 'pending' ? 'warning' : 'ai'} className="text-[10px]">
                      {athlete.verificationStatus === 'verified' ? 'Coach-attested' : athlete.verificationStatus === 'pending' ? 'Pending review' : 'AI-assisted assessment'}
                    </Badge>
                    {athlete.latestAssessment && <Badge variant="ai" className="text-[10px]">{athlete.latestAssessment.pose_detection_percentage.toFixed(1)}% pose</Badge>}
                  </div>
                  <button
                    onClick={() => toggleSave(athlete.username)}
                    className={`px-3 h-8 rounded-[var(--radius-sm)] border text-sm transition-colors ${
                      savedUsernames.includes(athlete.username)
                        ? 'bg-[var(--color-brand)]/8 border-[var(--color-brand)]/30 text-[var(--color-brand)]'
                        : 'border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-brand)]/50 hover:text-[var(--color-brand)]'
                    }`}
                    aria-label={savedUsernames.includes(athlete.username) ? 'Unsave athlete' : 'Save athlete'}
                  >
                    {savedUsernames.includes(athlete.username) ? '★ Saved' : '☆ Save'}
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <Card className="sticky top-6">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar name={selected.name} size="md" />
                  <div>
                    <h2 className="text-base font-black text-[var(--color-text)]">{selected.name}</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">@{selected.username}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {selected.location && <p className="text-xs text-[var(--color-text-muted)]">Location: {selected.location}</p>}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={selected.verificationStatus === 'verified' ? 'success' : 'ai'} className="text-[10px]">
                      {selected.verificationStatus === 'verified' ? 'Coach-attested' : 'AI-assisted assessment'}
                    </Badge>
                    <Badge variant="ai" className="text-[10px]">{selected.sport}</Badge>
                  </div>
                </div>

                {selected.latestAssessment ? (
                  <div className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-md)] mb-4">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Latest assessment</p>
                    <p className="text-lg font-black text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-mono)' }}>{selected.latestAssessment.completed_reps} valid reps</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Pose detection: {selected.latestAssessment.pose_detection_percentage.toFixed(1)}%</p>
                  </div>
                ) : (
                  <div className="p-3 bg-[var(--color-muted)] rounded-[var(--radius-md)] mb-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">No push-up assessment is available for this athlete yet.</p>
                  </div>
                )}

                {selected.matchRecords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Recent records</p>
                    <div className="space-y-2">
                      {selected.matchRecords.slice(0, 2).map((record) => (
                        <div key={record.id} className="rounded border border-[var(--color-border)] p-2.5">
                          <p className="text-xs font-medium text-[var(--color-text)]">{record.event}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{record.result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button fullWidth onClick={() => toggleSave(selected.username)}>
                  {savedUsernames.includes(selected.username) ? 'Unsave athlete' : 'Save athlete'}
                </Button>
              </Card>
            ) : (
              <div className="sticky top-6 flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] text-center px-6">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Select an athlete to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

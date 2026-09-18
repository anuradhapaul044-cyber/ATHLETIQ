import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { getAthleteMatchRecords, getCoachSavedAthletes, getLatestAthleteAssessment, removeCoachAthlete } from '../../lib/coach';

export default function SavedAthletes() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => getCoachSavedAthletes());

  const refreshSaved = () => setSaved(getCoachSavedAthletes());

  const handleUnsave = (athleteUsername: string) => {
    removeCoachAthlete(athleteUsername);
    refreshSaved();
  };

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
          {saved.map((athlete) => {
            const latestAssessment = getLatestAthleteAssessment(athlete.athleteUsername);
            const matchRecords = getAthleteMatchRecords(athlete.athleteUsername);
            const metric = latestAssessment ? `${latestAssessment.completed_reps} valid reps` : matchRecords[0] ? matchRecords[0].result : 'No evidence saved';

            return (
              <Card key={athlete.athleteUsername} hoverable>
                <div className="flex items-start gap-3">
                  <Avatar name={athlete.athleteName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-[var(--color-text)]">{athlete.athleteName}</h3>
                      {latestAssessment && <Badge variant="ai" className="text-[10px]">AI evidence</Badge>}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">@{athlete.athleteUsername}</p>
                    <p className="text-sm font-mono font-semibold text-[var(--color-brand)]">{metric}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => navigate('/coach/discover')}>View</Button>
                    <Button variant="danger" size="sm" onClick={() => handleUnsave(athlete.athleteUsername)}>Unsave</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

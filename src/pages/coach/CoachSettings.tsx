import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { clearAuthSession, getAuthSession } from '../../lib/auth';
import { getCoachSavedAthletes, getCoachVerificationQueue } from '../../lib/coach';

export default function CoachSettings() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const savedAthletes = getCoachSavedAthletes();
  const verificationQueue = getCoachVerificationQueue();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Coach Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Account details and coach session state.</p>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          {session && <Avatar name={session.user.username} size="lg" />}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-black text-[var(--color-text)]">{session?.user.username ?? 'Coach'}</h2>
              <Badge variant="success" dot>Coach</Badge>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Role: {session?.user.role ?? 'coach'}</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Account Summary</h3>
          <div className="space-y-2 text-sm"> 
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Saved athletes</span>
              <span className="font-semibold text-[var(--color-text)]">{savedAthletes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Pending review</span>
              <span className="font-semibold text-[var(--color-text)]">{verificationQueue.filter((item) => item.status === 'pending').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Signed in as</span>
              <span className="font-semibold text-[var(--color-text)]">{session?.user.username ?? 'Unavailable'}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Session</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Your coach role is protected and remains scoped to the authenticated account.</p>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              clearAuthSession();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}

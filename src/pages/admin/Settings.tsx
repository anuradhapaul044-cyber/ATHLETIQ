import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { clearAuthSession, getAuthSession } from '../../lib/auth';
import { useNavigate } from 'react-router';

export default function AdminSettings() {
  const navigate = useNavigate();
  const session = getAuthSession();

  const handleSignOut = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Admin Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Platform account and session controls.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Signed in user</p>
              <h2 className="text-lg font-black text-[var(--color-text)] mt-1">{session?.user.username ?? 'Not available'}</h2>
            </div>
            <Badge variant="success" dot>Admin</Badge>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Session controls</h3>
          <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <p>Role: {session?.user.role ?? 'Not available'}</p>
            <p>Session state: {session ? 'Active' : 'Expired'}</p>
          </div>
          <Button variant="outline" fullWidth className="mt-4" onClick={handleSignOut}>Sign out</Button>
        </Card>
      </div>
    </div>
  );
}

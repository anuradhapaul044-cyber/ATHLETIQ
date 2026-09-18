import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Wordmark } from '../../components/layout/Wordmark';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { API_BASE_URL } from '../../lib/api';
import { saveAuthSession, type UserRole } from '../../lib/auth';

type Role = UserRole;

const roleConfig: Record<Role, { label: string; dest: string; color: string }> = {
  student: { label: 'Student / Athlete', dest: '/student', color: 'var(--color-brand)' },
  coach: { label: 'Coach', dest: '/coach', color: '#7C3AED' },
  admin: { label: 'Administrator', dest: '/admin', color: '#0F2057' },
};

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = (params.get('role') as Role) || 'student';
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgot, setForgot] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const formData = new URLSearchParams({ username: email, password });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Unable to sign in.');
      }

      if (
        typeof payload.access_token !== 'string'
        || typeof payload.user?.username !== 'string'
        || !Object.hasOwn(roleConfig, payload.user?.role)
      ) {
        throw new Error('The sign-in response was invalid. Please try again.');
      }

      const authenticatedUser = { username: payload.user.username, role: payload.user.role as Role };
      saveAuthSession(payload.access_token, authenticatedUser);
      navigate(roleConfig[authenticatedUser.role].dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setForgot(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-elevated)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-[var(--color-brand)] p-10 flex-shrink-0">
        <Wordmark light size="md" />
        <div>
          <blockquote className="text-3xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            "Talent is everywhere. Opportunity is not."
          </blockquote>
          <p className="text-white/60 text-sm">ATHLETIQ bridges the gap between grassroots sports talent and the opportunities they deserve.</p>
        </div>
        <p className="text-xs text-white/30">SIH 2025 Demo Prototype</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Wordmark size="md" />
          </div>

          {!forgot ? (
            <>
              <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">Welcome back</h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">Sign in to your ATHLETIQ account</p>

              {/* Role selector */}
              <div className="flex bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-1 mb-6">
                {(Object.keys(roleConfig) as Role[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded transition-all ${
                      role === r ? 'bg-white shadow-[var(--shadow-card)] text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {roleConfig[r].label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    {error}
                  </div>
                )}
                <div className="flex justify-end">
                  <button type="button" onClick={() => setForgot(true)} className="text-xs text-[var(--color-brand)] hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" fullWidth loading={loading} size="lg">
                  Sign in as {roleConfig[role].label}
                </Button>
              </form>

              {role === 'student' && (
                <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
                  New to ATHLETIQ?{' '}
                  <button onClick={() => navigate('/signup')} className="text-[var(--color-brand)] font-semibold hover:underline">
                    Create an account
                  </button>
                </p>
              )}

              {/* Demo shortcuts */}
              <div className="mt-6 p-3 bg-[var(--color-ai-light)] border border-[var(--color-ai)]/20 rounded-[var(--radius-md)]">
                <p className="text-xs font-semibold text-[var(--color-ai)] mb-2">Demo — Quick Access</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(roleConfig) as Role[]).map(r => (
                    <button key={r} onClick={() => navigate(roleConfig[r].dest)} className="text-xs px-2.5 py-1 bg-white border border-[var(--color-border)] rounded hover:border-[var(--color-ai)] hover:text-[var(--color-ai)] text-[var(--color-text-secondary)] font-medium transition-colors">
                      → {roleConfig[r].label} Portal
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setForgot(false)} className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] mb-6 hover:text-[var(--color-text)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                Back to login
              </button>
              <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">Reset password</h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <Button type="submit" fullWidth loading={loading}>Send reset link</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

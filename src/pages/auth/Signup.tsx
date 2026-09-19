import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wordmark } from '../../components/layout/Wordmark';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { API_BASE_URL } from '../../lib/api';
import { getRoleHomePath, saveAuthSession, type UserRole } from '../../lib/auth';

const sports = ['Athletics', 'Football', 'Basketball', 'Cricket', 'Badminton', 'Swimming', 'Boxing', 'Wrestling', 'Kabaddi', 'Volleyball', 'Hockey', 'Tennis', 'Other'];
const signupRoles: Array<{ value: UserRole; label: string; description: string }> = [
  { value: 'student', label: 'Student / Athlete', description: 'Build your verified athlete profile.' },
  { value: 'coach', label: 'Coach', description: 'Discover athletes and attest performance.' },
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', sport: '', dob: '', location: '', role: 'student' as UserRole });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Username is required';
    if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const username = form.email.trim();
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: form.password, role: form.role }),
      });
      const registerPayload = await registerResponse.json().catch(() => ({}));
      if (!registerResponse.ok) {
        throw new Error(registerPayload.detail || 'Account registration failed.');
      }

      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password: form.password }),
      });
      const loginPayload = await loginResponse.json().catch(() => ({}));
      if (!loginResponse.ok) {
        throw new Error(loginPayload.detail || 'Unable to sign in after registration.');
      }

      if (
        typeof loginPayload.access_token !== 'string'
        || typeof loginPayload.user?.username !== 'string'
        || (loginPayload.user.role !== 'student' && loginPayload.user.role !== 'coach' && loginPayload.user.role !== 'admin')
      ) {
        throw new Error('The sign-in response was invalid.');
      }

      saveAuthSession(loginPayload.access_token, {
        username: loginPayload.user.username,
        role: loginPayload.user.role,
      });
      navigate(getRoleHomePath(loginPayload.user.role));
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not create account.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-elevated)] flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-[var(--color-brand)] p-10 flex-shrink-0">
        <Wordmark light size="md" />
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Build your verified athlete identity.</h2>
          <p className="text-white/60 text-sm">Take your first assessment, build your profile, and let your performance speak for itself.</p>
          <div className="space-y-2">
            {['Free to join', 'No equipment required', 'AI-powered assessments', 'Discoverable by coaches'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ai)]" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/30">SIH 2025 Demo Prototype</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Wordmark size="md" /></div>

          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s < step ? 'bg-[var(--color-success)] text-white' :
                  s === step ? 'bg-[var(--color-brand)] text-white' :
                  'bg-[var(--color-muted)] text-[var(--color-text-muted)]'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 2 && <div className={`flex-1 h-px ${s < step ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">Create your account</h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">Step 1 of 2 — Account details</p>
              <div className="space-y-4">
                <Input label="Full name" placeholder="Arjun Sharma" value={form.name} onChange={set('name')} error={errors.name} />
                <Input label="Username" type="text" placeholder="arjun.sharma" value={form.email} onChange={set('email')} error={errors.email} />
                <Input label="Password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} error={errors.password} />
                <Input label="Confirm password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
                <div>
                  <p className="block text-sm font-medium text-[var(--color-text)] mb-2">Account type</p>
                  <div className="grid grid-cols-2 gap-3">
                    {signupRoles.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm(current => ({ ...current, role: option.value }))}
                        className={`text-left rounded-[var(--radius-sm)] border p-3 transition-colors ${
                          form.role === option.value
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5'
                            : 'border-[var(--color-border)] hover:border-[var(--color-brand)]/50'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[var(--color-text)]">{option.label}</span>
                        <span className="block text-xs text-[var(--color-text-muted)] mt-1">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button fullWidth size="lg" onClick={handleNext}>Continue →</Button>
              </div>
              <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-[var(--color-brand)] font-semibold hover:underline">Sign in</button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">Your profile</h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">Step 2 of 2 — Basic information</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Primary sport</label>
                  <select
                    value={form.sport}
                    onChange={set('sport')}
                    className="w-full h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40 focus:border-[var(--color-ai)]"
                  >
                    <option value="">Select sport...</option>
                    {sports.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Input label="Date of birth" type="date" value={form.dob} onChange={set('dob')} />
                <Input label="City / Location" placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={set('location')} />
                {errors.form && (
                  <div className="flex items-center gap-2 p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-sm">
                    {errors.form}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} type="button">← Back</Button>
                  <Button type="submit" fullWidth loading={loading} size="lg">Create account</Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

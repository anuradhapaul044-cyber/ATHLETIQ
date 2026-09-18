import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wordmark } from '../components/layout/Wordmark';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: '◎',
    title: 'AI-Assisted Assessment',
    desc: 'Upload a video of your push-up form. Our AI counts valid reps and evaluates movement consistency — no lab required.',
    tag: 'AI',
  },
  {
    icon: '⊘',
    title: 'Digital Athlete Profile',
    desc: 'Build a verified sports identity that travels with you — assessments, match records, achievements, and coach-attested evidence.',
    tag: 'PROFILE',
  },
  {
    icon: '⊕',
    title: 'Coach Discovery',
    desc: 'Qualified coaches and scouts can find athletes by sport, location, age, and verified performance data.',
    tag: 'DISCOVERY',
  },
  {
    icon: '◈',
    title: 'Verified Evidence',
    desc: 'Each result is clearly labelled: AI-generated, coach-attested, self-reported, or officially verified. No confusion.',
    tag: 'TRUST',
  },
  {
    icon: '◇',
    title: 'Opportunities',
    desc: 'Trials, scholarships, government schemes, and talent identification programmes — surfaced to athletes who qualify.',
    tag: 'OPPORTUNITY',
  },
  {
    icon: '◉',
    title: 'Wellness & Progress',
    desc: 'Track fitness trends, BMI, diet, and personalized plans. Progress should be visible and owned by the athlete.',
    tag: 'WELLNESS',
  },
];

const flow = [
  { step: '01', label: 'Test anywhere', sub: 'Record a push-up assessment on any device' },
  { step: '02', label: 'AI analysis', sub: 'Automated rep counting and form evaluation' },
  { step: '03', label: 'Build profile', sub: 'Results saved to your athlete profile instantly' },
  { step: '04', label: 'Get discovered', sub: 'Coaches find you through verified performance data' },
  { step: '05', label: 'Unlock opportunities', sub: 'Trials, scholarships, and programmes that match your profile' },
];

const stats = [
  { value: '12,400+', label: 'Athletes registered' },
  { value: '840', label: 'Verified coaches' },
  { value: '2,100+', label: 'Opportunities listed' },
  { value: '94%', label: 'Assessment completion rate' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Wordmark size="md" />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
            <a href="#how" className="hover:text-[var(--color-text)] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[var(--color-text)] transition-colors">Features</a>
            <a href="#opportunities" className="hover:text-[var(--color-text)] transition-colors">Opportunities</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
            <Button size="sm" onClick={() => navigate('/signup')}>Get started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[var(--color-ai-light)] border border-[var(--color-ai)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ai)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--color-ai)] tracking-wide uppercase">Smart Talent Discovery Platform</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight text-[var(--color-text)] tracking-tight">
              Talent is<br />everywhere.<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-brand)' }}>Opportunity</span><br />
              is not.
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
              ATHLETIQ connects grassroots athletes with coaches, scouts, and opportunities — using AI-assisted performance assessment to bridge the gap between talent and recognition.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/signup')}>Start as Student / Athlete</Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login?role=coach')}>I'm a Coach</Button>
            </div>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">Free to join · No equipment required · AI-assisted · Verified results</p>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative bg-[var(--color-elevated)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-[var(--shadow-elevated)]">
              {/* Mock athlete card */}
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">AS</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-text)]">Arjun Sharma</span>
                      <span className="text-xs bg-[var(--color-success-light)] text-[var(--color-success)] px-1.5 py-0.5 rounded font-medium">Verified ✓</span>
                    </div>
                    <span className="text-sm text-[var(--color-text-muted)]">Athletics · 100m Sprint · Mumbai</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['42', 'Push-ups', 'AI-verified'], ['100m', '10.8s', 'Self-reported'], ['8.4/10', 'Form Score', 'AI-verified']].map(([val, label, tag]) => (
                    <div key={label} className="bg-[var(--color-elevated)] rounded-[var(--radius-sm)] p-3 text-center">
                      <p className="text-lg font-bold text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-mono)' }}>{val}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{tag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating AI processing card */}
              <div className="absolute -top-4 -right-4 bg-[var(--color-brand)] text-white rounded-[var(--radius-md)] px-4 py-3 shadow-[var(--shadow-elevated)] min-w-48">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-ai)] animate-pulse" />
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">AI Analysis</span>
                </div>
                <p className="text-sm font-semibold">42 valid reps detected</p>
                <p className="text-xs text-white/60">Form consistency: 8.4 / 10</p>
              </div>

              {/* Floating opportunity */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 shadow-[var(--shadow-elevated)] min-w-52">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-warning)] mb-1">New Opportunity</p>
                <p className="text-sm font-semibold text-[var(--color-text)]">SAI National Trials 2025</p>
                <p className="text-xs text-[var(--color-text-muted)]">Athletics · Deadline: Mar 15</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[var(--color-brand)] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</p>
                <p className="text-sm text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-[var(--color-elevated)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ai)] mb-2">The Flow</p>
            <h2 className="text-3xl font-black text-[var(--color-text)]">From assessment to opportunity</h2>
          </div>
          <div className="grid lg:grid-cols-5 gap-0 relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-[var(--color-border)]" />
            {flow.map((f, i) => (
              <div key={f.step} className="relative flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-[var(--color-brand)] flex items-center justify-center mb-4 z-10 shadow-[var(--shadow-card)]">
                  <span className="text-sm font-black text-[var(--color-brand)]">{f.step}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">{f.label}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ai)] mb-2">Platform</p>
            <h2 className="text-3xl font-black text-[var(--color-text)]">Everything the athlete needs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="group border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-brand)]/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl text-[var(--color-brand)]">{f.icon}</span>
                  <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] bg-[var(--color-muted)] px-2 py-1 rounded">{f.tag}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--color-text)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence clarity section */}
      <section className="py-24 bg-[var(--color-elevated)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ai)] mb-2">Transparency</p>
              <h2 className="text-3xl font-black text-[var(--color-text)] mb-4">Evidence you can trust</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
                Every data point on ATHLETIQ is clearly labelled by its source. You always know what's been verified and how.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'AI-Verified', color: 'var(--color-ai)', bg: 'var(--color-ai-light)', desc: 'Automatically analyzed from uploaded video footage' },
                  { label: 'Coach-Attested', color: '#7C3AED', bg: '#EDE9FE', desc: 'Reviewed and confirmed by a verified coach' },
                  { label: 'Officially Verified', color: 'var(--color-brand)', bg: '#E0E7FF', desc: 'Confirmed by an institution or governing body' },
                  { label: 'Self-Reported', color: 'var(--color-text-muted)', bg: 'var(--color-muted)', desc: 'Entered by the athlete, not independently verified' },
                ].map(e => (
                  <div key={e.label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-xs font-bold px-2 py-1 rounded flex-shrink-0" style={{ background: e.bg, color: e.color }}>{e.label}</span>
                    <p className="text-sm text-[var(--color-text-secondary)]">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Sample — Athlete Performance Card</h3>
              <div className="space-y-3">
                {[
                  { metric: 'Push-ups', value: '42 reps', source: 'AI-Verified', color: 'var(--color-ai)', bg: 'var(--color-ai-light)' },
                  { metric: 'Form Score', value: '8.4 / 10', source: 'AI-Verified', color: 'var(--color-ai)', bg: 'var(--color-ai-light)' },
                  { metric: '100m Sprint', value: '10.8s', source: 'Coach-Attested', color: '#7C3AED', bg: '#EDE9FE' },
                  { metric: 'State Rank', value: '#12', source: 'Self-Reported', color: 'var(--color-text-muted)', bg: 'var(--color-muted)' },
                  { metric: 'District Champion', value: '2024', source: 'Officially Verified', color: 'var(--color-brand)', bg: '#E0E7FF' },
                ].map(r => (
                  <div key={r.metric} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{r.metric}</p>
                      <p className="text-base font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{r.value}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: r.bg, color: r.color }}>{r.source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities preview */}
      <section id="opportunities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ai)] mb-2">For Athletes</p>
              <h2 className="text-3xl font-black text-[var(--color-text)]">Opportunities that match your profile</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>Browse all →</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'SAI National Athletics Trials', cat: 'Government Trial', sport: 'Athletics', loc: 'New Delhi', deadline: '15 Mar 2025', official: true },
              { name: 'Reliance Foundation Youth Sports Scholarship', cat: 'Scholarship', sport: 'Multiple', loc: 'Pan India', deadline: '30 Apr 2025', official: true },
              { name: 'State Level Football Talent Hunt', cat: 'Talent Programme', sport: 'Football', loc: 'Maharashtra', deadline: '20 Feb 2025', official: false },
            ].map(o => (
              <div key={o.name} className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 hover:border-[var(--color-brand)]/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--color-muted)] text-[var(--color-text-secondary)]">{o.cat}</span>
                  {o.official && <span className="text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success-light)] px-1.5 py-0.5 rounded">Official Source</span>}
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-brand)] transition-colors">{o.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-3">{o.sport} · {o.loc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-warning)] font-medium">Deadline: {o.deadline}</span>
                  <span className="text-xs text-[var(--color-brand)] font-medium">View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--color-brand)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Your talent deserves to be seen.</h2>
          <p className="text-lg text-white/70 mb-8">Join thousands of athletes already building their verified sports profile on ATHLETIQ.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-white text-[var(--color-brand)] hover:bg-white/90" onClick={() => navigate('/signup')}>Create your profile</Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/login?role=coach')}>Sign in as Coach</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1840] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Wordmark light size="sm" />
          <p className="text-xs text-white/30">© 2025 ATHLETIQ. SIH Demo Prototype. Not for commercial use.</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/70">Privacy</a>
            <a href="#" className="hover:text-white/70">Terms</a>
            <a href="#" className="hover:text-white/70">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

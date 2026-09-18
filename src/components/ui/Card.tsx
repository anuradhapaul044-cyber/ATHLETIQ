import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ children, className = '', padding = 'md', hoverable, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]
        shadow-[var(--shadow-card)]
        ${hoverable ? 'cursor-pointer hover:border-[var(--color-brand)]/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-200' : ''}
        ${paddings[padding]} ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: boolean;
}

export function StatCard({ label, value, sub, icon, trend, accent }: StatCardProps) {
  return (
    <Card className={accent ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white' : ''}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium uppercase tracking-wider ${accent ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
            {label}
          </p>
          <p className={`mt-1 text-2xl font-bold font-[var(--font-mono)] tabular-nums ${accent ? 'text-white' : 'text-[var(--color-text)]'}`}>
            {value}
          </p>
          {sub && (
            <p className={`mt-0.5 text-xs ${accent ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>{sub}</p>
          )}
          {trend && (
            <p className={`mt-1 text-xs font-medium flex items-center gap-0.5 ${
              trend.up ? (accent ? 'text-green-300' : 'text-[var(--color-success)]') : (accent ? 'text-red-300' : 'text-[var(--color-danger)]')
            }`}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-[var(--radius-sm)] ${accent ? 'bg-white/10' : 'bg-[var(--color-muted)]'}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

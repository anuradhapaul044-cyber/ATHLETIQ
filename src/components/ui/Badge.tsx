import React from 'react';

type BadgeVariant = 'default' | 'ai' | 'success' | 'warning' | 'danger' | 'coach' | 'official' | 'self';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-muted)] text-[var(--color-text-secondary)]',
  ai: 'bg-[var(--color-ai-light)] text-[var(--color-ai)] border border-[var(--color-ai)]/20',
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
  coach: 'bg-purple-50 text-purple-700 border border-purple-200',
  official: 'bg-[var(--color-brand)] text-white',
  self: 'bg-slate-100 text-slate-600',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'default', children, className = '', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-[var(--color-success)]' :
          variant === 'warning' ? 'bg-[var(--color-warning)]' :
          variant === 'danger' ? 'bg-[var(--color-danger)]' :
          variant === 'ai' ? 'bg-[var(--color-ai)]' : 'bg-current'
        }`} />
      )}
      {children}
    </span>
  );
}

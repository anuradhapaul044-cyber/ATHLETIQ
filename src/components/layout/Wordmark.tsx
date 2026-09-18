import React from 'react';

interface WordmarkProps {
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

export function Wordmark({ light, size = 'md' }: WordmarkProps) {
  return (
    <span className={`font-black tracking-tight ${sizes[size]} ${light ? 'text-white' : 'text-[var(--color-brand)]'}`}
      style={{ fontFamily: 'var(--font-sans)' }}>
      ATHLE<span className={`${light ? 'text-[var(--color-ai)]' : 'text-[var(--color-ai)]'}`}>TIQ</span>
    </span>
  );
}

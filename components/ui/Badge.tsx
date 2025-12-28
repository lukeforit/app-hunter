
import React from 'react';
import { cn } from '../../lib/utils';
import { JobStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: JobStatus | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    [JobStatus.SENT]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [JobStatus.INTERVIEWING]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    [JobStatus.REJECTED]: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0",
      variants[variant as keyof typeof variants] || variants.default,
      className
    )}>
      {children}
    </span>
  );
};

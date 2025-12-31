
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blue';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm shadow-white/5 active:bg-zinc-200',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-600',
    outline: 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:bg-zinc-900',
    ghost: 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 active:bg-zinc-800',
    danger: 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20',
    blue: 'text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 active:bg-blue-400/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

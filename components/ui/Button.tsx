
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
    outline: 'border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
    danger: 'text-zinc-500 hover:text-red-400 hover:bg-red-400/10',
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
        'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

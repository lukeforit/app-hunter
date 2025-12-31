import React from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface FilterOption<T> {
  value: T;
  label: string;
}

interface FilterGroupProps<T> {
  options: FilterOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  className?: string;
}

export function FilterGroup<T extends string>({ 
  options, 
  value, 
  onChange, 
  className 
}: FilterGroupProps<T>) {
  const handleToggle = (optionValue: T) => {
    onChange(value === optionValue ? null : optionValue);
  };

  return (
    <div className={cn(
      "flex items-center gap-1 bg-zinc-900/40 border border-zinc-800 p-1 rounded-xl",
      className
    )}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleToggle(option.value)}
          className="px-3 h-8 text-[11px] uppercase tracking-wider whitespace-nowrap"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
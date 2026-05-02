'use client';

import { memo, type ReactNode } from 'react';

type Variant = 'num' | 'op' | 'action' | 'accent';

interface CalcButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  ariaLabel: string;
}

const VARIANTS: Record<Variant, string> = {
  num: 'bg-bold-num text-bold-textPrimary',
  op: 'bg-bold-op text-bold-accentText',
  action: 'bg-bold-action text-bold-textPrimary',
  accent: 'bg-bold-accent text-black',
};

function CalcButtonImpl({ children, onPress, variant = 'num', ariaLabel }: CalcButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onPress}
      className={[
        'flex items-center justify-center select-none touch-manipulation',
        'rounded-2xl font-black text-3xl sm:text-4xl md:text-5xl',
        'w-full h-full min-h-0',
        'transition-[transform,filter,background-color] duration-150 ease-bold',
        'active:scale-[0.93] active:brightness-125',
        'hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bold-bg',
        VARIANTS[variant],
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export const CalcButton = memo(CalcButtonImpl);

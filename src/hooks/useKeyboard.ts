'use client';

import { useEffect } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';

export function useKeyboard(): void {
  const {
    pressDigit,
    pressOperator,
    pressDot,
    pressParen,
    pressPercent,
    pressEquals,
    pressClear,
    pressDelete,
  } = useCalculatorStore();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const k = e.key;
      if (/^[0-9]$/.test(k)) {
        pressDigit(k);
        e.preventDefault();
        return;
      }
      switch (k) {
        case '.':
        case ',':
          pressDot();
          e.preventDefault();
          return;
        case '+':
        case '-':
        case '*':
        case '/':
          pressOperator(k);
          e.preventDefault();
          return;
        case '(':
        case ')':
          pressParen(k);
          e.preventDefault();
          return;
        case '%':
          pressPercent();
          e.preventDefault();
          return;
        case 'Enter':
        case '=':
          pressEquals();
          e.preventDefault();
          return;
        case 'Backspace':
          pressDelete();
          e.preventDefault();
          return;
        case 'Escape':
        case 'Delete':
          pressClear();
          e.preventDefault();
          return;
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pressDigit, pressOperator, pressDot, pressParen, pressPercent, pressEquals, pressClear, pressDelete]);
}

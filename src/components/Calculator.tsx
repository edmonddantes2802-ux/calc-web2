'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { HistoryDrawer } from './HistoryDrawer';
import { UserMenu } from './auth/UserMenu';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { useKeyboard } from '@/hooks/useKeyboard';

export function Calculator() {
  const { setDrawerOpen, history } = useCalculatorStore();
  const [hydrated, setHydrated] = useState(false);
  useKeyboard();

  useEffect(() => {
    void useCalculatorStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return (
    <main className="h-[100svh] w-full bg-bold-bg flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 shrink-0 gap-3">
        <button
          type="button"
          aria-label="Open history"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-full hover:bg-bold-num transition-colors text-bold-textPrimary relative shrink-0"
        >
          <Clock className="w-6 h-6" strokeWidth={2} />
          {hydrated && history.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-bold-accent" />
          )}
        </button>
        <UserMenu />
      </header>

      <Display />
      <Keypad />

      <HistoryDrawer />
    </main>
  );
}

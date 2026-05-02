'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { formatExpression, formatNumberString } from '@/core/formatter';
import { prettify } from '@/core/calculator';

export function HistoryDrawer() {
  const { drawerOpen, setDrawerOpen, history, clearHistory, applyHistoryResult } = useCalculatorStore();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-md bg-bold-drawer z-50 border-r border-bold-divider flex flex-col"
            role="dialog"
            aria-label="History"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-bold-divider">
              <h2 className="text-bold-textPrimary text-xl font-bold">History</h2>
              <button
                type="button"
                aria-label="Close history"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-bold-num text-bold-textSecondary"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <ul className="flex-1 overflow-y-auto px-2 py-2">
              {history.length === 0 ? (
                <li className="text-center text-bold-textSecondary py-12 text-sm">
                  No calculations yet.
                </li>
              ) : (
                history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => applyHistoryResult(entry.result)}
                      className="w-full text-right px-4 py-3 rounded-xl hover:bg-bold-num transition-colors"
                    >
                      <div className="text-bold-textSecondary text-sm font-normal truncate">
                        {formatExpression(prettify(entry.expression))}
                      </div>
                      <div className="text-bold-textPrimary text-xl font-bold truncate">
                        = {formatNumberString(entry.result)}
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {history.length > 0 && (
              <footer className="border-t border-bold-divider px-4 py-3">
                <button
                  type="button"
                  onClick={clearHistory}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-bold-num text-bold-error font-semibold hover:brightness-125 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear history
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

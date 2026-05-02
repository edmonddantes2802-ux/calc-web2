import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  appendDigit,
  appendDot,
  appendOperator,
  appendParen,
  applyPercent,
  autoCloseParens,
  deleteLast,
  evaluateExpression,
  toggleSign,
} from '@/core/calculator';
import { pushHistoryEntry, clearCloudHistory } from '@/lib/historySync';
import type { HistoryEntry } from '@/types';

interface AuthBridge {
  getUserId: () => string | null;
}

const authBridge: AuthBridge = { getUserId: () => null };

export function setAuthBridge(getUserId: () => string | null): void {
  authBridge.getUserId = getUserId;
}

const HISTORY_LIMIT = 100;

interface CalculatorState {
  expression: string;
  result: string | null;
  error: string | null;
  history: HistoryEntry[];
  drawerOpen: boolean;
  pressDigit: (digit: string) => void;
  pressOperator: (op: '+' | '-' | '*' | '/') => void;
  pressDot: () => void;
  pressParen: (paren: '(' | ')') => void;
  pressPercent: () => void;
  pressSign: () => void;
  pressEquals: () => void;
  pressClear: () => void;
  pressDelete: () => void;
  applyHistoryResult: (value: string) => void;
  clearHistory: () => void;
  setDrawerOpen: (open: boolean) => void;
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      expression: '',
      result: null,
      error: null,
      history: [],
      drawerOpen: false,

      pressDigit: (digit) => {
        const { expression, result, error } = get();
        if (error) {
          set({ expression: digit === '0' ? '0' : digit, result: null, error: null });
          return;
        }
        if (result !== null) {
          set({ expression: digit === '0' ? '0' : digit, result: null });
          return;
        }
        set({ expression: appendDigit(expression, digit) });
      },

      pressOperator: (op) => {
        const { expression, result, error } = get();
        if (error) {
          set({ expression: '', result: null, error: null });
          return;
        }
        if (result !== null) {
          set({ expression: appendOperator(result, op), result: null });
          return;
        }
        const next = appendOperator(expression, op);
        set({ expression: next });
      },

      pressDot: () => {
        const { expression, result, error } = get();
        if (error) {
          set({ expression: '0.', result: null, error: null });
          return;
        }
        if (result !== null) {
          set({ expression: '0.', result: null });
          return;
        }
        set({ expression: appendDot(expression) });
      },

      pressParen: (paren) => {
        const { expression, error } = get();
        if (error) {
          set({ expression: paren === '(' ? '(' : '', result: null, error: null });
          return;
        }
        set({ expression: appendParen(expression, paren), result: null });
      },

      pressPercent: () => {
        const { expression, error } = get();
        if (error) return;
        set({ expression: applyPercent(expression), result: null });
      },

      pressSign: () => {
        const { expression, result, error } = get();
        if (error) return;
        if (result !== null) {
          set({ expression: toggleSign(result), result: null });
          return;
        }
        set({ expression: toggleSign(expression) });
      },

      pressEquals: () => {
        const { expression } = get();
        if (!expression) return;
        const closed = autoCloseParens(expression);
        const evalRes = evaluateExpression(closed);
        if (!evalRes.ok) {
          set({ error: evalRes.error });
          return;
        }
        if (closed === evalRes.value) return;
        const entry: HistoryEntry = {
          id: makeId(),
          expression: closed,
          result: evalRes.value,
          createdAt: Date.now(),
        };
        const trimmed = [entry, ...get().history].slice(0, HISTORY_LIMIT);
        set({ expression: closed, result: evalRes.value, error: null, history: trimmed });

        const userId = authBridge.getUserId();
        if (userId) {
          void pushHistoryEntry(userId, entry);
        }
      },

      pressClear: () => {
        set({ expression: '', result: null, error: null });
      },

      pressDelete: () => {
        const { expression, result, error } = get();
        if (error) {
          set({ error: null, expression: '', result: null });
          return;
        }
        if (result !== null) {
          set({ expression: '', result: null });
          return;
        }
        set({ expression: deleteLast(expression) });
      },

      applyHistoryResult: (value) => {
        set({ expression: value, result: null, error: null, drawerOpen: false });
      },

      clearHistory: () => {
        set({ history: [] });
        const userId = authBridge.getUserId();
        if (userId) {
          void clearCloudHistory(userId);
        }
      },

      setDrawerOpen: (open) => set({ drawerOpen: open }),
    }),
    {
      name: 'bold-calculator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
      version: 1,
      skipHydration: true,
    },
  ),
);

import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { getSession, onAuthStateChange } from '@/lib/auth';
import { loadCloudHistory, migrateLocalToCloud } from '@/lib/historySync';
import { useCalculatorStore } from './useCalculatorStore';

export type AuthStatus = 'loading' | 'authed' | 'anonymous';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  initialize: () => Promise<void>;
}

let initialized = false;

async function syncHistoryForUser(userId: string): Promise<void> {
  const cloud = await loadCloudHistory(userId);
  const local = useCalculatorStore.getState().history.filter((e) => !e.id.startsWith('cloud_'));
  if (cloud.length === 0 && local.length > 0) {
    await migrateLocalToCloud(userId, local);
    const refreshed = await loadCloudHistory(userId);
    useCalculatorStore.setState({ history: refreshed });
  } else {
    useCalculatorStore.setState({ history: cloud });
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'loading',
  user: null,
  session: null,

  initialize: async () => {
    if (initialized) return;
    initialized = true;

    const session = await getSession();
    if (session?.user) {
      set({ status: 'authed', user: session.user, session });
      void syncHistoryForUser(session.user.id);
    } else {
      set({ status: 'anonymous', user: null, session: null });
    }

    onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_IN' && nextSession?.user) {
        set({ status: 'authed', user: nextSession.user, session: nextSession });
        void syncHistoryForUser(nextSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        set({ status: 'anonymous', user: null, session: null });
        useCalculatorStore.setState({ history: [], expression: '', result: null, error: null });
      } else if (event === 'TOKEN_REFRESHED' && nextSession) {
        set({ session: nextSession });
      } else if (event === 'USER_UPDATED' && nextSession?.user) {
        set({ user: nextSession.user, session: nextSession });
      }
    });
  },
}));

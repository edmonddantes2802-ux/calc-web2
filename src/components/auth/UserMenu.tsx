'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-bold-textSecondary text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-[200px]"
        title={user.email ?? ''}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={busy}
        aria-label="Выйти"
        className="p-2 rounded-full hover:bg-bold-num text-bold-textPrimary transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
      </button>
    </div>
  );
}

'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthBridge } from '@/store/useCalculatorStore';

const PUBLIC_ROUTES = new Set(['/login', '/signup']);

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, initialize } = useAuthStore();

  useEffect(() => {
    setAuthBridge(() => useAuthStore.getState().user?.id ?? null);
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (status === 'loading') return;
    const isPublic = PUBLIC_ROUTES.has(pathname);
    if (status === 'anonymous' && !isPublic) {
      router.replace('/login');
    } else if (status === 'authed' && isPublic) {
      router.replace('/');
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="h-[100svh] w-full flex items-center justify-center bg-bold-bg">
        <Loader2 className="w-8 h-8 animate-spin text-bold-accent" />
      </div>
    );
  }

  const isPublic = PUBLIC_ROUTES.has(pathname);
  if (status === 'anonymous' && !isPublic) return null;
  if (status === 'authed' && isPublic) return null;

  return <>{children}</>;
}

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}

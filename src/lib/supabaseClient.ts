import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Theme } from '@/types';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    );
  }
  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cachedClient;
}

export async function fetchThemes(): Promise<Theme[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('themes')
    .select('id, name, colors')
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data as Theme[];
}

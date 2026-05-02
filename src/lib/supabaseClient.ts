import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Theme } from '@/types';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}

export async function fetchThemes(): Promise<Theme[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client
    .from('themes')
    .select('id, name, colors')
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data as Theme[];
}

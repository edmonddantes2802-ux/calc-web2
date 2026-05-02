import { getSupabaseClient } from './supabaseClient';
import type { HistoryEntry } from '@/types';

const TABLE = 'user_history';

interface CloudRow {
  id: number;
  expression: string;
  result: string;
  created_at: string;
}

function toEntry(row: CloudRow): HistoryEntry {
  return {
    id: `cloud_${row.id}`,
    expression: row.expression,
    result: row.result,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function loadCloudHistory(userId: string, limit = 100): Promise<HistoryEntry[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, expression, result, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as CloudRow[]).map(toEntry);
}

export async function pushHistoryEntry(userId: string, entry: HistoryEntry): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).insert({
    user_id: userId,
    expression: entry.expression,
    result: entry.result,
    created_at: new Date(entry.createdAt).toISOString(),
  });
  if (error) console.warn('[historySync] push failed:', error.message);
}

export async function clearCloudHistory(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('user_id', userId);
  if (error) console.warn('[historySync] clear failed:', error.message);
}

export async function migrateLocalToCloud(userId: string, entries: HistoryEntry[]): Promise<void> {
  if (entries.length === 0) return;
  const supabase = getSupabaseClient();
  const rows = entries.map((e) => ({
    user_id: userId,
    expression: e.expression,
    result: e.result,
    created_at: new Date(e.createdAt).toISOString(),
  }));
  const { error } = await supabase.from(TABLE).insert(rows);
  if (error) console.warn('[historySync] migrate failed:', error.message);
}

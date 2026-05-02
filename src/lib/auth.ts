import type { AuthError, Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabaseClient';

export interface AuthResult {
  ok: boolean;
  user?: User;
  session?: Session;
  needsEmailConfirmation?: boolean;
  error?: string;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: formatAuthError(error) };
  const result: AuthResult = {
    ok: true,
    needsEmailConfirmation: data.session === null,
  };
  if (data.user) result.user = data.user;
  if (data.session) result.session = data.session;
  return result;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: formatAuthError(error) };
  const result: AuthResult = { ok: true };
  if (data.user) result.user = data.user;
  if (data.session) result.session = data.session;
  return result;
}

export async function signOut(): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: formatAuthError(error) };
  return { ok: true };
}

export async function getSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): Subscription {
  const supabase = getSupabaseClient();
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

export function formatAuthError(error: AuthError | { message: string }): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
    return 'Неверный email или пароль';
  }
  if (msg.includes('user already registered') || msg.includes('already exists') || msg.includes('already been registered')) {
    return 'Пользователь с таким email уже зарегистрирован';
  }
  if (msg.includes('email not confirmed')) {
    return 'Подтвердите email перед входом';
  }
  if (msg.includes('password should be at least')) {
    return 'Пароль должен быть не короче 6 символов';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return 'Неверный формат email';
  }
  if (msg.includes('rate limit')) {
    return 'Слишком много попыток. Попробуйте позже';
  }
  if (msg.includes('network') || msg.includes('failed to fetch')) {
    return 'Проблема с сетью — попробуйте ещё раз';
  }
  return error.message || 'Неизвестная ошибка';
}

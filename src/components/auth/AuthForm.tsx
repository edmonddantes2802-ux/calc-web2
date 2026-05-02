'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth';

type Mode = 'login' | 'signup';

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  function validate(): string | null {
    if (!email.trim()) return 'Введите email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Неверный формат email';
    if (password.length < 6) return 'Пароль должен быть не короче 6 символов';
    if (isSignup && password !== confirm) return 'Пароли не совпадают';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const res = await signUp(email.trim(), password);
        if (!res.ok) {
          setError(res.error ?? 'Ошибка регистрации');
          return;
        }
        if (res.needsEmailConfirmation) {
          setInfo('Письмо для подтверждения отправлено на ваш email. После подтверждения войдите в аккаунт.');
          return;
        }
        router.replace('/');
      } else {
        const res = await signIn(email.trim(), password);
        if (!res.ok) {
          setError(res.error ?? 'Ошибка входа');
          return;
        }
        router.replace('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
      <h1 className="text-3xl font-black text-bold-textPrimary text-center mb-2">
        {isSignup ? 'Регистрация' : 'Вход'}
      </h1>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={inputClass}
        />
      </Field>

      <Field label="Пароль" htmlFor="password">
        <input
          id="password"
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className={inputClass}
        />
      </Field>

      {isSignup && (
        <Field label="Повторите пароль" htmlFor="confirm">
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </Field>
      )}

      {error && (
        <div role="alert" className="text-bold-error text-sm font-medium">
          {error}
        </div>
      )}
      {info && (
        <div role="status" className="text-bold-success text-sm font-medium">
          {info}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-12 rounded-2xl bg-bold-accent text-black font-black text-lg flex items-center justify-center gap-2 active:scale-[0.97] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isSignup ? 'Зарегистрироваться' : 'Войти'}
      </button>

      <div className="text-center text-bold-textSecondary text-sm mt-2">
        {isSignup ? (
          <>
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-bold-accentText font-semibold hover:underline">
              Войти
            </Link>
          </>
        ) : (
          <>
            Нет аккаунта?{' '}
            <Link href="/signup" className="text-bold-accentText font-semibold hover:underline">
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </form>
  );
}

const inputClass =
  'w-full h-12 px-4 rounded-2xl bg-bold-num text-bold-textPrimary text-base outline-none border border-transparent focus:border-bold-accent transition-colors disabled:opacity-60';

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-bold-textSecondary text-xs uppercase tracking-wide font-semibold">{label}</span>
      {children}
    </label>
  );
}

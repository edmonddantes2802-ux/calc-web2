import { AuthForm } from '@/components/auth/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-[100svh] w-full bg-bold-bg flex items-center justify-center px-6 py-12">
      <AuthForm mode="signup" />
    </main>
  );
}

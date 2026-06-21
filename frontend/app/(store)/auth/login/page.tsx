'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-md rounded-panel border border-line bg-surface p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
        <p className="mt-1 font-body text-sm text-ink-soft">
          New to Varcha?{' '}
          <Link href="/auth/signup" className="text-wine hover:underline">
            Create an account
          </Link>
        </p>

        {error && (
          <p className="mt-4 rounded-badge bg-rose-bg px-3 py-2 font-body text-sm text-rose-ink">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-body text-xs font-medium text-ink-soft">
              Email address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-wine"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-xs font-medium text-ink-soft">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-wine"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-btn bg-wine py-3 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

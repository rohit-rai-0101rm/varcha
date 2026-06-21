'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiLogin, saveAdminToken } from '@/lib/admin-api';

const INPUT = 'w-full rounded-btn border border-line bg-surface px-3 py-2 font-body text-sm text-ink focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine';

export default function AdminLoginPage() {
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
      const { token } = await adminApiLogin(email, password);
      saveAdminToken(token);
      router.replace('/admin/products');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface p-8 shadow-sm">
        <h1 className="mb-1 font-display text-2xl font-bold text-wine">Varcha</h1>
        <p className="mb-6 font-body text-sm text-ink-soft">Admin panel</p>

        {error && (
          <p className="mb-4 rounded-btn bg-rose-bg px-3 py-2 font-body text-sm text-rose-ink">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-body text-xs font-medium text-ink-soft">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={INPUT}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-xs font-medium text-ink-soft">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={INPUT}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-btn bg-wine px-4 py-2 font-body text-sm font-medium text-surface disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

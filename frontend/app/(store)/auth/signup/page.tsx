'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    marketingConsent: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
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
        <h1 className="font-display text-2xl font-bold text-ink">Create account</h1>
        <p className="mt-1 font-body text-sm text-ink-soft">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-wine hover:underline">
            Sign in
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
              Full name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Priya Sharma"
              className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-wine"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-xs font-medium text-ink-soft">
              Email address
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="priya@example.com"
              className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-wine"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-xs font-medium text-ink-soft">
              Phone number <span className="text-wine">*</span>
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+91 98765 43210"
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
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-wine"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={form.marketingConsent}
              onChange={(e) => set('marketingConsent', e.target.checked)}
              className="mt-0.5 accent-wine"
            />
            <span className="font-body text-xs text-ink-soft leading-relaxed">
              I agree to receive updates, offers, and personalised recommendations from Varcha
              via WhatsApp, SMS, or email. You can unsubscribe at any time.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-btn bg-wine py-3 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

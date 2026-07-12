'use client';

import { useState } from 'react';
import { apiCreateLead } from '@/lib/client-api';
import { useCart } from '@/context/CartContext';

interface Props {
  discountText?: string;
  className?: string;
}

export default function LeadCaptureForm({ discountText, className = '' }: Props) {
  const { items } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your name and phone number.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      await apiCreateLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        cartItems: items.length > 0
          ? items.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price }))
          : undefined,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please try again.');
    }
  }

  const inputCls =
    'w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft focus:border-wine focus:outline-none';

  if (status === 'success') {
    return (
      <p className={`rounded-card border border-line bg-bg px-5 py-4 font-body text-sm text-ink ${className}`}>
        Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}! We&apos;ll message you the moment
        checkout goes live.
      </p>
    );
  }

  return (
    <div className={className}>
      {discountText && (
        <p className="mb-3 font-annotation text-xs uppercase tracking-widest text-wine">{discountText}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className={inputCls}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="Phone number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {status === 'error' && <p className="font-body text-xs text-red-600">{errorMsg}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-wine px-7 py-3 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Notify Me at Launch'}
        </button>
      </form>
    </div>
  );
}

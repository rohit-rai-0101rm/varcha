'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiCreateLead } from '@/lib/client-api';

interface Props {
  imageUrl?: string;
  discountText?: string;
}

export default function ComingSoonHero({ imageUrl, discountText }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
      await apiCreateLead({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong — please try again.');
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 10 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Text */}
        <div className="text-center lg:text-left">
          <span className="font-annotation text-[10px] tracking-[0.42em] text-gold uppercase">
            Coming Soon
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-[1.1] text-ink lg:text-5xl">
            Secure online checkout
            <br className="hidden lg:block" /> is almost here.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-ink-soft lg:mx-0">
            We&apos;re putting the final touches on a safe, seamless way to bring our
            pieces home. Leave your number and we&apos;ll let you know the moment
            checkout opens.
          </p>

          {discountText && (
            <p className="mt-3 font-annotation text-xs uppercase tracking-widest text-wine">
              {discountText}
            </p>
          )}

          {status === 'success' ? (
            <p className="mx-auto mt-7 max-w-md rounded-card border border-line bg-bg px-5 py-4 font-body text-sm text-ink lg:mx-0">
              Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}! We&apos;ll message you the
              moment checkout goes live.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-md space-y-3 lg:mx-0">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft focus:border-wine focus:outline-none"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft focus:border-wine focus:outline-none"
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <input
                className="w-full rounded-btn border border-line bg-bg px-3 py-2.5 font-body text-sm text-ink placeholder-ink-soft focus:border-wine focus:outline-none"
                placeholder="Email (optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {status === 'error' && <p className="font-body text-xs text-red-600">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 rounded-btn bg-wine px-7 py-3.5 font-body text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting…' : 'Notify Me at Launch'}
              </button>
            </form>
          )}

          <Link
            href="/search"
            className="mt-5 inline-block font-body text-sm font-medium text-ink-soft underline decoration-line underline-offset-4 hover:text-wine"
          >
            Or explore the collection →
          </Link>
        </div>

        {/* 3D tilt image */}
        {imageUrl && (
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative mx-auto w-full max-w-sm [perspective:1200px]"
          >
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-line shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out will-change-transform"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)` }}
            >
              <Image src={imageUrl} alt="Varcha jewellery — coming soon" fill className="object-cover" />
              <div
                className="pointer-events-none absolute inset-0 animate-shimmer"
                style={{
                  background:
                    'linear-gradient(115deg, transparent 35%, rgba(212,175,78,0.28) 50%, transparent 65%)',
                  backgroundSize: '250% 250%',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

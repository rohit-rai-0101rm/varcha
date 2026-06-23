'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ApiProduct } from '@/lib/api';

function OverlayCard({ product: p }: { product: ApiProduct }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img =
    p.images.find((i) => i.type === 'model-shot')?.url ??
    p.images.find((i) => i.type === 'product-shot')?.url;
  const useImg = !!img && !imgFailed;

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-card"
    >
      {useImg ? (
        <Image
          src={img!}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 40vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: 'linear-gradient(160deg, var(--wine) 0%, #1e1812 100%)' }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />

      {/* Exclusive badge */}
      {p.channel === 'website-exclusive' && (
        <span className="absolute left-3 top-3 rounded-[5px] bg-rose-bg px-2 py-0.5 font-annotation text-[8px] tracking-wider text-rose-ink">
          Exclusive Edit
        </span>
      )}

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="font-display text-base font-bold leading-snug text-white sm:text-lg">
          {p.name}
        </h3>
        <p className="mt-1 font-body text-sm font-semibold text-gold">
          ₹{p.price.toLocaleString('en-IN')}
        </p>
        <span className="mt-2 block translate-y-1.5 font-body text-xs text-white/55 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View piece →
        </span>
      </div>
    </Link>
  );
}

interface Props {
  products: ApiProduct[];
}

export default function FeaturedStrip({ products }: Props) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = products.length;

  function scrollBy(dir: 1 | -1) {
    const el = stripRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' });
  }

  function onScroll() {
    const el = stripRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const idx = Math.round(el.scrollLeft / (card.offsetWidth + 20));
    setActive(Math.min(Math.max(0, idx), total - 1));
  }

  return (
    <section className="bg-ink py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────── */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-annotation text-[9px] tracking-[0.45em] text-gold uppercase">
              New In
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-surface lg:text-5xl">
              Featured Pieces
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Counter */}
            <span className="font-annotation text-[11px] tabular-nums text-white/40">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            {/* Prev */}
            <button
              onClick={() => scrollBy(-1)}
              disabled={active === 0}
              aria-label="Previous piece"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 font-body text-base text-white/60 transition-all hover:border-white/55 hover:text-white disabled:opacity-25"
            >
              ←
            </button>

            {/* Next */}
            <button
              onClick={() => scrollBy(1)}
              disabled={active >= total - 1}
              aria-label="Next piece"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 font-body text-base text-white/60 transition-all hover:border-white/55 hover:text-white disabled:opacity-25"
            >
              →
            </button>

            {/* View all — underline link in gold on dark bg */}
            <Link
              href="/search"
              className="hidden items-center gap-1 border-b border-gold pb-px font-body text-sm font-medium text-gold transition-[gap] duration-200 hover:gap-2 sm:inline-flex"
            >
              View all →
            </Link>
          </div>
        </div>

        {/* ── Strip ─────────────────────────────── */}
        <div
          ref={stripRef}
          onScroll={onScroll}
          className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              className="w-[72vw] shrink-0 sm:w-[40vw] lg:w-[calc(25%-15px)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <OverlayCard product={p} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/search"
            className="flex w-full items-center justify-center rounded-full border border-white/25 py-3 font-body text-sm font-medium text-white/60 transition-all hover:border-white/50 hover:text-white"
          >
            View all pieces →
          </Link>
        </div>

      </div>
    </section>
  );
}

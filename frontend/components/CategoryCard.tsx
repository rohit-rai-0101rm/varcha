'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ApiCategory } from '@/lib/api';

export default function CategoryCard({ cat }: { cat: ApiCategory }) {
  const [imgFailed, setImgFailed] = useState(false);
  const useImage = !!cat.image && !imgFailed;

  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group relative aspect-[3/4] overflow-hidden rounded-card"
    >
      {useImage ? (
        <Image
          src={cat.image!}
          alt={cat.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 320px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: 'linear-gradient(160deg, var(--wine) 0%, #2a1018 100%)' }}
        />
      )}

      {/* Always-present dark gradient so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent transition-all duration-500 group-hover:from-ink/95 group-hover:via-ink/35" />

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="font-annotation text-[8px] tracking-[0.3em] text-white/50 uppercase">
          Collection
        </span>
        <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
          {cat.name}
        </h3>
        <span className="mt-2 block translate-y-2 font-body text-xs font-medium text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Explore →
        </span>
      </div>
    </Link>
  );
}

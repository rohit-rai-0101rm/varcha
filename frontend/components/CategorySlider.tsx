'use client';

import { useRef } from 'react';
import type { ApiCategory } from '@/lib/api';
import CategoryCard from './CategoryCard';

interface Props {
  categories: ApiCategory[];
}

export default function CategorySlider({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 280;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((cat) => (
          <div key={cat._id} className="w-[45%] shrink-0 snap-start sm:w-[30%] lg:w-[22%]">
            <CategoryCard cat={cat} />
          </div>
        ))}
      </div>

      {categories.length > 3 && (
        <>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 hidden -translate-x-3 -translate-y-1/2 rounded-full border border-line bg-surface p-2 text-ink-soft shadow-md transition-colors hover:text-wine sm:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-3 rounded-full border border-line bg-surface p-2 text-ink-soft shadow-md transition-colors hover:text-wine sm:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

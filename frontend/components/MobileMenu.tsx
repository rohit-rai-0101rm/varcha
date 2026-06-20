'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ApiCategory } from '@/lib/api';

interface Props {
  categories: ApiCategory[];
}

export default function MobileMenu({ categories }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
        className="rounded-btn p-2 text-ink-soft transition-colors hover:text-wine"
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-panel border border-line bg-surface shadow-lg">
          <nav className="flex flex-col p-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-btn px-4 py-2.5 font-body text-sm font-medium text-ink-soft transition-colors hover:bg-bg hover:text-wine"
              >
                {cat.name}
              </Link>
            ))}
            <div className="my-1 border-t border-line" />
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-btn px-4 py-2.5 font-body text-sm text-ink-soft transition-colors hover:bg-bg hover:text-wine"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

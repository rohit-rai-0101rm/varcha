'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search jewelry…"
        className="flex-1 rounded-btn border border-line bg-surface px-4 py-2 font-body text-sm text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-btn bg-wine px-4 py-2 font-body text-sm font-medium text-surface"
      >
        Search
      </button>
    </form>
  );
}

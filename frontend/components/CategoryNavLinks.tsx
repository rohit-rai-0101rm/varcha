'use client';

import Link from 'next/link';
import { apiLogEvent } from '@/lib/client-api';
import type { ApiCategory } from '@/lib/api';

interface Props {
  categories: ApiCategory[];
}

export default function CategoryNavLinks({ categories }: Props) {
  return (
    <>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`/category/${cat.slug}`}
          onClick={() => apiLogEvent({ type: 'click', categoryId: cat._id })}
          className="group relative font-body text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          {cat.name}
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-wine transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </>
  );
}

'use client';

import Link from 'next/link';
import { apiLogEvent } from '@/lib/client-api';
import type { ApiCategory } from '@/lib/api';

export interface CategoryNode {
  category: ApiCategory;
  children: ApiCategory[];
}

interface Props {
  tree: CategoryNode[];
}

export default function CategoryNavLinks({ tree }: Props) {
  return (
    <>
      {tree.map(({ category, children }) => (
        <div key={category._id} className="group relative">
          <Link
            href={`/category/${category.slug}`}
            onClick={() => apiLogEvent({ type: 'click', categoryId: category._id })}
            className="relative font-body text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            {category.name}
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-wine transition-all duration-300 group-hover:w-full" />
          </Link>

          {children.length > 0 && (
            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 rounded-panel border border-line bg-surface p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {children.map((child) => (
                <Link
                  key={child._id}
                  href={`/category/${child.slug}`}
                  onClick={() => apiLogEvent({ type: 'click', categoryId: child._id })}
                  className="block rounded-btn px-3 py-2 font-body text-sm text-ink-soft transition-colors hover:bg-bg hover:text-wine"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

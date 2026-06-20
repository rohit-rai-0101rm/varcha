'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { ApiStyle } from '@/lib/api';

const OCCASIONS = ['daily', 'party', 'festive', 'bridal', 'anniversary', 'formal', 'gen-z'];
const GENDERS = ['women', 'men', 'kids'];

interface Props {
  styles: ApiStyle[];
}

export default function FilterPanel({ styles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMulti(key: string, value: string) {
    const current = (searchParams.get(key) ?? '').split(',').filter(Boolean);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, next.join(','));
  }

  function clearAll() {
    router.push(pathname);
  }

  const activeStyles = (searchParams.get('style') ?? '').split(',').filter(Boolean);
  const activeOccasions = (searchParams.get('occasion') ?? '').split(',').filter(Boolean);
  const activeGender = searchParams.get('gender') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  const hasFilters =
    activeStyles.length > 0 ||
    activeOccasions.length > 0 ||
    activeGender ||
    minPrice ||
    maxPrice;

  return (
    <aside className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="font-body text-xs text-gold underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Style */}
      {styles.length > 0 && (
        <div>
          <p className="mb-2 font-body text-sm font-medium text-ink">Style</p>
          <div className="flex flex-col gap-1.5">
            {styles.map((s) => (
              <label key={s._id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeStyles.includes(s.slug)}
                  onChange={() => toggleMulti('style', s.slug)}
                  className="accent-wine"
                />
                <span className="font-body text-sm text-ink-soft">{s.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="mb-2 font-body text-sm font-medium text-ink">Price (₹)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => update('minPrice', e.target.value)}
            className="w-full rounded-btn border border-line bg-surface px-2 py-1.5 font-body text-sm text-ink focus:border-gold focus:outline-none"
          />
          <span className="text-ink-soft">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => update('maxPrice', e.target.value)}
            className="w-full rounded-btn border border-line bg-surface px-2 py-1.5 font-body text-sm text-ink focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Occasion */}
      <div>
        <p className="mb-2 font-body text-sm font-medium text-ink">Occasion</p>
        <div className="flex flex-col gap-1.5">
          {OCCASIONS.map((occ) => (
            <label key={occ} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={activeOccasions.includes(occ)}
                onChange={() => toggleMulti('occasion', occ)}
                className="accent-wine"
              />
              <span className="font-body text-sm capitalize text-ink-soft">{occ}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="mb-2 font-body text-sm font-medium text-ink">For</p>
        <div className="flex flex-col gap-1.5">
          {GENDERS.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={activeGender === g}
                onChange={() => update('gender', activeGender === g ? '' : g)}
                className="accent-wine"
              />
              <span className="font-body text-sm capitalize text-ink-soft">{g}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

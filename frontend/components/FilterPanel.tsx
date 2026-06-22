'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { ApiStyle } from '@/lib/api';

const OCCASIONS = ['daily', 'party', 'festive', 'bridal', 'anniversary', 'formal', 'gen-z'];
const GENDERS = ['women', 'men', 'kids'];

interface Props {
  styles: ApiStyle[];
  initialStyle?: string;
  initialOccasion?: string;
  initialGender?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

export default function FilterPanel({
  styles,
  initialStyle = '',
  initialOccasion = '',
  initialGender = '',
  initialMinPrice = '',
  initialMaxPrice = '',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeStyles, setActiveStyles] = useState<string[]>(
    initialStyle ? initialStyle.split(',').filter(Boolean) : [],
  );
  const [activeOccasions, setActiveOccasions] = useState<string[]>(
    initialOccasion ? initialOccasion.split(',').filter(Boolean) : [],
  );
  const [activeGender, setActiveGender] = useState(initialGender);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  function buildParams(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      style: activeStyles.join(','),
      occasion: activeOccasions.join(','),
      gender: activeGender,
      minPrice,
      maxPrice,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return params.toString();
  }

  function toggleStyle(slug: string) {
    const next = activeStyles.includes(slug)
      ? activeStyles.filter((v) => v !== slug)
      : [...activeStyles, slug];
    setActiveStyles(next);
    router.push(`${pathname}?${buildParams({ style: next.join(',') })}`);
  }

  function toggleOccasion(occ: string) {
    const next = activeOccasions.includes(occ)
      ? activeOccasions.filter((v) => v !== occ)
      : [...activeOccasions, occ];
    setActiveOccasions(next);
    router.push(`${pathname}?${buildParams({ occasion: next.join(',') })}`);
  }

  function setGender(g: string) {
    const next = activeGender === g ? '' : g;
    setActiveGender(next);
    router.push(`${pathname}?${buildParams({ gender: next })}`);
  }

  function applyPrice(min: string, max: string) {
    router.push(`${pathname}?${buildParams({ minPrice: min, maxPrice: max })}`);
  }

  function clearAll() {
    setActiveStyles([]);
    setActiveOccasions([]);
    setActiveGender('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  }

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
                  onChange={() => toggleStyle(s.slug)}
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
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => applyPrice(minPrice, maxPrice)}
            className="w-full rounded-btn border border-line bg-surface px-2 py-1.5 font-body text-sm text-ink focus:border-gold focus:outline-none"
          />
          <span className="text-ink-soft">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => applyPrice(minPrice, maxPrice)}
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
                onChange={() => toggleOccasion(occ)}
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
                onChange={() => setGender(g)}
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

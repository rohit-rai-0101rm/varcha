import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories, fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import StyleMotif from '@/components/StyleMotif';
import HeroCarousel from '@/components/HeroCarousel';
import PageTracker from '@/components/PageTracker';

export default async function Home() {
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);

  const heroSlides = products
    .filter((p) => p.channel === 'website-exclusive' && p.images.length > 0)
    .slice(0, 3);

  const featuredProducts = products
    .filter((p) => p.channel === 'website-exclusive')
    .slice(0, 4);

  return (
    <>
      <PageTracker />
      {/* ── HERO CAROUSEL ─────────────────────────── */}
      <HeroCarousel slides={heroSlides} firstCategory={categories[0]} />

      {/* ── CATEGORIES ────────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="font-annotation text-[10px] tracking-[0.3em] text-sketch uppercase">
                  Explore
                </span>
                <h2 className="mt-1.5 font-display text-3xl font-bold text-ink">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/search"
                className="font-body text-sm font-medium text-gold transition-colors hover:text-wine"
              >
                View all →
              </Link>
            </div>

            {/* Asymmetric grid — desktop only */}
            <div className="hidden h-[560px] grid-cols-2 grid-rows-2 gap-3 md:grid lg:h-[640px]">
              {/* Primary large card — spans both rows */}
              {categories[0] && (
                <Link
                  href={`/category/${categories[0].slug}`}
                  className="group relative row-span-2 overflow-hidden rounded-card"
                >
                  {categories[0].image ? (
                    <>
                      <Image
                        src={categories[0].image}
                        alt={categories[0].name}
                        fill
                        sizes="(max-width: 1280px) 40vw, 560px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                    </>
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, var(--rose-bg) 0%, var(--surface) 80%)',
                      }}
                    />
                  )}
                  <div className="absolute bottom-7 left-7">
                    <p className="font-annotation text-[10px] tracking-[0.25em] text-surface/70 uppercase">
                      Collection
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-surface">
                      {categories[0].name}
                    </h3>
                    <span className="mt-3 inline-block rounded-btn border border-surface/40 px-4 py-1.5 font-body text-xs font-medium text-surface transition-all group-hover:bg-surface group-hover:text-ink">
                      Explore →
                    </span>
                  </div>
                </Link>
              )}

              {/* Secondary stacked cards */}
              {categories.slice(1, 3).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-card"
                >
                  {cat.image ? (
                    <>
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 1280px) 30vw, 420px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
                    </>
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, var(--rose-bg) 0%, var(--surface) 80%)',
                      }}
                    />
                  )}
                  <div className="absolute bottom-5 left-5">
                    <h3 className="font-display text-xl font-bold text-surface">{cat.name}</h3>
                    <span className="mt-1 block font-body text-xs text-surface/70 group-hover:text-surface">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile: simple uniform grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-card"
                >
                  {cat.image ? (
                    <>
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    </>
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, var(--rose-bg) 0%, var(--surface) 80%)',
                      }}
                    />
                  )}
                  <h3 className="absolute bottom-3 left-3 font-display text-base font-bold text-surface">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PIECES ───────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-bg py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="font-annotation text-[10px] tracking-[0.3em] text-sketch uppercase">
                  New In
                </span>
                <h2 className="mt-1.5 font-display text-3xl font-bold text-ink">
                  Featured Pieces
                </h2>
              </div>
              <Link
                href="/search"
                className="font-body text-sm font-medium text-gold transition-colors hover:text-wine"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND PROMISE ─────────────────────────── */}
      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3">
            {(
              [
                {
                  family: 'indian-craft',
                  title: 'Artisan Crafted',
                  desc: 'Each piece made by skilled artisans using techniques passed down through generations.',
                },
                {
                  family: 'global-tradition',
                  title: 'Global Heritage',
                  desc: 'From Indian craft traditions to worldwide heritage — jewellery with a story worth wearing.',
                },
                {
                  family: 'aesthetic',
                  title: 'Exclusive Edits',
                  desc: 'Premium bridal and occasion pieces available only here — never on any marketplace.',
                },
              ] as const
            ).map(({ family, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-4">
                <div className="flex h-10 w-20 items-center justify-center">
                  <StyleMotif family={family} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

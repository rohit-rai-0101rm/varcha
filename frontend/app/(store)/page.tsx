import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories, fetchProducts, fetchBanners, fetchSettings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Varcha — Curated Artificial Jewellery',
  description:
    'Handcrafted artificial jewellery rooted in Indian craft traditions. Premium bridal and everyday pieces — shop the exclusive line or browse our Amazon and Flipkart collections.',
};
import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import FeaturedStrip from '@/components/FeaturedStrip';
import PageTracker from '@/components/PageTracker';

export default async function Home() {
  const [categories, products, featuredProducts, settings, heroBanners] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchProducts({ featured: 'true' }),
    fetchSettings(),
    fetchBanners('home-hero'),
  ]);

  const activeBanners = settings?.homeBannerEnabled ? heroBanners : [];

  const fallbackSlides = products
    .filter((p) => p.channel === 'website-exclusive' && p.images.length > 0)
    .slice(0, 4);

  return (
    <>
      <PageTracker />
      {/* ── HERO CAROUSEL ─────────────────────────── */}
      <HeroCarousel
        banners={activeBanners}
        fallbackSlides={fallbackSlides}
        firstCategory={categories[0]}
      />

      {/* ── CATEGORIES ────────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-bg py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Decorative rule */}
            <div className="mb-10 flex items-center gap-5">
              <div className="h-px flex-1 bg-line" />
              <span className="font-annotation text-[9px] tracking-[0.45em] text-wine uppercase">Collections</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            {/* Heading row */}
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-4xl font-bold text-ink lg:text-5xl">
                Shop by Category
              </h2>
              <Link
                href="/search"
                className="group hidden items-center gap-1.5 rounded-full border border-line px-5 py-2 font-body text-sm font-medium text-ink-soft transition-all hover:border-wine hover:text-wine sm:flex"
              >
                View all
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            {/* Equal-height portrait grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} cat={cat} />
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-6 sm:hidden">
              <Link
                href="/search"
                className="flex w-full items-center justify-center rounded-full border border-line py-3 font-body text-sm font-medium text-ink-soft transition-all hover:border-wine hover:text-wine"
              >
                View all pieces →
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ── FEATURED PIECES ───────────────────────── */}
      {featuredProducts.length > 0 && (
        <FeaturedStrip products={featuredProducts} />
      )}

      {/* ── BRAND PROMISE ─────────────────────────── */}
      <section className="border-t border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mb-12 text-center">
            <span className="font-annotation text-[9px] tracking-[0.45em] text-wine uppercase">
              Our Promise
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink lg:text-4xl">
              Crafted with intention.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {(
              [
                {
                  num: '01',
                  title: 'Artisan Crafted',
                  desc: 'Each piece made by skilled artisans using techniques passed down through generations.',
                },
                {
                  num: '02',
                  title: 'Global Heritage',
                  desc: 'From Indian craft traditions to worldwide heritage — jewellery with a story worth wearing.',
                },
                {
                  num: '03',
                  title: 'Exclusive Edits',
                  desc: 'Premium bridal and occasion pieces available only here — never on any marketplace.',
                },
              ] as const
            ).map(({ num, title, desc }) => (
              <div key={num} className="border-t-2 border-wine pt-5">
                <span className="font-annotation text-[9px] tracking-[0.4em] text-ink-soft">
                  {num}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

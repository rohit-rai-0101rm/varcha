import Image from 'next/image';
import Link from 'next/link';
import type { ApiCategory } from '@/lib/api';
import RotatingMedallion from './RotatingMedallion';
import CustomOrderTrigger from './CustomOrderTrigger';

interface Props {
  stone: ApiCategory;
  jewellery: ApiCategory;
}

function Panel({ cat, tagline }: { cat: ApiCategory; tagline: string }) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-card border border-line bg-surface sm:aspect-[16/11] lg:aspect-[16/10]"
    >
      {cat.image ? (
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 bg-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-gold uppercase">
          {tagline}
        </span>
        <h3 className="mt-2 font-display text-3xl font-bold text-surface lg:text-4xl">{cat.name}</h3>
        <span className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-medium text-surface/90">
          Explore
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function StoneJewellerySection({ stone, jewellery }: Props) {
  return (
    <section className="relative bg-bg py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <span className="font-annotation text-[9px] tracking-[0.45em] text-wine uppercase">
            Two Worlds, One Craft
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink lg:text-4xl">
            Stone &amp; Jewellery
          </h2>
          <p className="mx-auto mt-2 max-w-lg font-body text-sm leading-relaxed text-ink-soft">
            Natural gemstone bracelets tied to your rashi, alongside our full line of
            handcrafted fashion jewellery.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-4">
          <Panel cat={stone} tagline="Rashi Bracelets · Natural Stone" />
          <Panel cat={jewellery} tagline="Handcrafted · Everyday to Bridal" />

          {/* Medallion — solid gold ring, overlaps the seam on desktop */}
          <div className="relative -my-6 flex justify-center lg:absolute lg:inset-0 lg:my-0 lg:items-center">
            <RotatingMedallion size={150} className="lg:hidden" />
            <RotatingMedallion size={190} className="hidden lg:block" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-sm text-ink-soft">
            Don&apos;t see quite what you have in mind?
          </p>
          <CustomOrderTrigger className="mt-3" />
        </div>
      </div>
    </section>
  );
}

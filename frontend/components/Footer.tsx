import Link from 'next/link';

const links = {
  Collections: [
    { label: 'Necklaces', href: '/category/necklaces' },
    { label: 'Bangles', href: '/category/bangles' },
    { label: 'Earrings', href: '/category/earrings' },
  ],
  Discover: [
    { label: 'About Varcha', href: '/about' },
    { label: 'Jewellery Care Guide', href: '/care-guide' },
    { label: 'Ring Size Guide', href: '/ring-size-guide' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold text-wine">Varcha</span>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
              Curated artificial jewelry — where craft heritage meets everyday elegance.
            </p>
            <p className="mt-4 font-annotation text-xs tracking-wider text-sketch">
              CRAFTED WITH CARE IN INDIA
            </p>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {items.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-body text-sm text-ink-soft transition-colors hover:text-wine"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="font-body text-xs text-ink-soft">
            © {new Date().getFullYear()} Varcha. All rights reserved.
          </p>
          <Link
            href="/contact"
            className="font-body text-xs text-ink-soft transition-colors hover:text-wine"
          >
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}

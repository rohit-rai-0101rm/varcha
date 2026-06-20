import Link from 'next/link';
import { fetchCategories } from '@/lib/api';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import AuthNav from './AuthNav';
import CartIcon from './CartIcon';

export default async function Navbar() {
  const categories = await fetchCategories();

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement strip */}
      <div className="bg-wine px-4 py-2.5 text-center">
        <p className="font-body text-xs font-medium tracking-widest text-surface/90 uppercase">
          Free shipping on prepaid orders &nbsp;·&nbsp; Handcrafted in India
        </p>
      </div>

      {/* Main nav */}
      <div className="border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 font-display text-2xl font-bold tracking-tight text-wine"
          >
            Varcha
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group relative font-body text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {cat.name}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-wine transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden items-center gap-2 rounded-btn border border-line px-3 py-1.5 font-body text-xs text-ink-soft transition-colors hover:border-gold hover:text-gold sm:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
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
            <CartIcon />
            <AuthNav />
            <ThemeToggle />
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  );
}

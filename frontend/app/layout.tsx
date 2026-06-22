import type { Metadata } from 'next';
import { Fraunces, Inter, Special_Elite } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-special-elite',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://varcha.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Varcha — Curated Artificial Jewellery',
    template: '%s — Varcha',
  },
  description:
    'Handcrafted artificial jewellery rooted in Indian craft traditions. Premium bridal and everyday pieces.',
  openGraph: {
    siteName: 'Varcha',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fraunces.variable} ${inter.variable} ${specialElite.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

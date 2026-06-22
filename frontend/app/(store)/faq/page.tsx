import type { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ — Varcha',
  description:
    'Answers to common questions about Varcha jewellery — products, shipping, returns, payments, and more.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Help
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">
          Frequently asked questions
        </h1>
        <FAQAccordion />
      </div>
    </div>
  );
}

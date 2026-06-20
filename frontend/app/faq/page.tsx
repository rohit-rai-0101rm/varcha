'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What is the difference between the everyday line and the premium line?',
    a: 'The everyday line (typically under ₹1,000) is sold through Amazon and Flipkart. The premium and bridal line (₹1,000 and above) is available exclusively on this site — never on any marketplace. The two lines differ in craftsmanship, materials, and finish, not just price.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Premium line orders on this site are prepaid only — cards, UPI, and netbanking are accepted via our payment gateway. COD is not available. Everyday line orders on Amazon/Flipkart follow those platforms\' own payment options.',
  },
  {
    q: 'How long does shipping take?',
    a: 'We ship within 1–2 business days of order confirmation. Standard delivery is 4–7 business days across India. Expedited options may be available at checkout for select pincodes.',
  },
  {
    q: 'Can I return or exchange a piece?',
    a: 'Yes. We accept returns within 7 days of delivery for unused, unworn pieces in original packaging. Custom or bridal pieces are non-returnable. See our Refund Policy for full details.',
  },
  {
    q: 'Are the pieces real gold or silver?',
    a: 'Our pieces use gold plating over brass or white metal bases — not solid gold or silver. This is what makes the craft accessible. The plating thickness, base metal quality, and finish vary by piece and are described on each product page.',
  },
  {
    q: 'How do I find my ring size?',
    a: 'See our Ring Size Guide for a step-by-step method using a strip of paper. If you\'re between sizes, we recommend sizing up for comfort.',
  },
  {
    q: 'Can I place a bulk or custom order?',
    a: 'Yes — we take custom and bulk orders for weddings and events. Lead time is typically 4–6 weeks depending on the craft. Write to us at hello@varcha.in or WhatsApp us with the details.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive a tracking link via SMS and/or email. You can also view order history in your account under My Orders.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Help
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">
          Frequently asked questions
        </h1>

        <div className="mt-10 divide-y divide-line">
          {faqs.map(({ q, a }, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <span className="font-body text-sm font-medium text-ink">{q}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink-soft)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`mt-0.5 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {open === i && (
                <p className="pb-5 font-body text-sm leading-relaxed text-ink-soft">{a}</p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-sm text-ink-soft">
          Still have questions?{' '}
          <a href="/contact" className="text-wine hover:underline">
            Contact us
          </a>{' '}
          and we&apos;ll get back to you.
        </p>
      </div>
    </div>
  );
}

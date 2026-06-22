import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy — Varcha',
  description: 'How returns, refunds, and cancellations work for Varcha orders.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Legal
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">
          Refund & Cancellation Policy
        </h1>
        <p className="mt-3 font-body text-sm text-ink-soft">Last updated: June 2026</p>

        <div className="mt-10 space-y-10 font-body text-sm leading-relaxed text-ink-soft">

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Scope</h2>
            <p>
              This policy applies to orders placed on varcha.in (the premium line). For everyday
              line products purchased on Amazon or Flipkart, returns and refunds are handled
              entirely by those platforms under their own policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Returns</h2>
            <p>We accept returns within <strong className="text-ink">7 days of delivery</strong> provided the piece is:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Unused and unworn</li>
              <li>In its original packaging with all tags intact</li>
              <li>Not a custom, made-to-order, or bridal piece (see below)</li>
            </ul>
            <p className="mt-4">
              To initiate a return, email us at{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>{' '}
              with your order number and a brief description of the reason. We will share a return
              address and instructions within 1–2 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Non-returnable items</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Custom and made-to-order pieces</li>
              <li>Bridal sets and pieces purchased for a specific occasion after the occasion date</li>
              <li>Items that show signs of wear, damage, or missing original packaging</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Refunds</h2>
            <p>
              Once we receive and inspect the returned piece, we will notify you by email. If the
              return is approved, your refund will be processed to the original payment method
              within <strong className="text-ink">5–7 business days</strong>. Processing time
              depends on your bank or card provider and may take an additional 2–5 business days
              to appear in your account.
            </p>
            <p className="mt-3">
              Return shipping costs are borne by the customer unless the return is due to a defect
              or an error on our part (wrong item sent, damaged in transit). In those cases, we
              will arrange a pickup at no charge.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Cancellations</h2>
            <p>
              Orders can be cancelled <strong className="text-ink">before they are shipped</strong>.
              To cancel, contact us immediately at{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>{' '}
              or via WhatsApp with your order number. If the order has already been dispatched,
              please use the return process above once it is delivered.
            </p>
            <p className="mt-3">
              Cancellations of confirmed orders before dispatch will be refunded in full to the
              original payment method within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Damaged or defective items</h2>
            <p>
              If your order arrives damaged or defective, please email us within{' '}
              <strong className="text-ink">48 hours of delivery</strong> with photographs of the
              item and packaging. We will arrange a replacement or full refund at no additional
              cost.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Contact</h2>
            <p>
              For any return or refund query:{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>{' '}
              or use the{' '}
              <Link href="/contact" className="text-wine hover:underline">
                contact form
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

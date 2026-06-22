import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — Varcha',
  description: 'Terms and conditions for purchasing from Varcha.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Legal
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Terms & Conditions</h1>
        <p className="mt-3 font-body text-sm text-ink-soft">Last updated: June 2026</p>

        <div className="mt-10 space-y-10 font-body text-sm leading-relaxed text-ink-soft">

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">1. About Varcha</h2>
            <p>
              Varcha sells artificial (fashion) jewellery under a hybrid model. The everyday line
              (typically under ₹1,000) is listed on Amazon and Flipkart — when you click through
              from this site, you are redirected to those platforms to complete your purchase under
              their terms. The premium and bridal line is sold exclusively on this website with
              our own checkout. These terms apply to purchases made on varcha.in only.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">2. Eligibility</h2>
            <p>
              By placing an order you confirm that you are at least 18 years old, or are placing
              the order with the knowledge and consent of a parent or guardian. You confirm that
              the information you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">3. Products and pricing</h2>
            <p>
              All prices are in Indian Rupees (INR) and are inclusive of applicable taxes unless
              stated otherwise. We reserve the right to change prices without prior notice.
              Product images are of the actual piece; colours may vary slightly due to screen
              calibration. Our pieces use gold or silver plating over brass or white metal bases
              — they are not solid gold or silver. This is described on each product page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">4. Payment</h2>
            <p>
              Premium-line purchases on this site are prepaid only — we accept cards, UPI, and
              netbanking via Razorpay. Cash on Delivery is not available. Your order is confirmed
              only after payment is successfully verified. We do not store or have access to your
              card or banking credentials at any point.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">5. Order confirmation</h2>
            <p>
              After a successful payment, you will receive an order confirmation by email and/or
              SMS. If you do not receive one within 30 minutes, check your spam folder and contact
              us at{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>
              . Receipt of an order confirmation does not guarantee fulfilment if stock becomes
              unavailable due to a system error — in that case we will notify you and issue a full
              refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">6. Shipping</h2>
            <p>
              We ship within 1–2 business days of order confirmation. Expected delivery is 4–7
              business days across India. We ship from Jaipur via courier aggregator. Shipping
              timelines are estimates and not guaranteed; delays due to weather, strikes, or
              courier issues are outside our control. See our{' '}
              <Link href="/shipping-policy" className="text-wine hover:underline">
                Shipping Policy
              </Link>{' '}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">7. Returns and refunds</h2>
            <p>
              We accept returns within 7 days of delivery for unused, unworn pieces in original
              packaging. Custom and bridal pieces are non-returnable. See our{' '}
              <Link href="/refund-policy" className="text-wine hover:underline">
                Refund & Cancellation Policy
              </Link>{' '}
              for the full process.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">8. Intellectual property</h2>
            <p>
              All product photography, copy, brand assets, and site content are the property of
              Varcha. You may not reproduce, redistribute, or use them for any commercial purpose
              without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">9. Limitation of liability</h2>
            <p>
              Our liability for any claim arising from a purchase is limited to the amount paid
              for the item in question. We are not liable for indirect, consequential, or
              incidental damages. We are not responsible for delays or failures caused by events
              outside our reasonable control (force majeure).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">10. Governing law</h2>
            <p>
              These terms are governed by Indian law. Any disputes shall be subject to the
              exclusive jurisdiction of courts in Jaipur, Rajasthan.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">11. Contact</h2>
            <p>
              Questions:{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

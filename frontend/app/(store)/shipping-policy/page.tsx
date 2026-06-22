import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy — Varcha',
  description: 'Shipping timelines, costs, and delivery details for Varcha orders.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Legal
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Shipping Policy</h1>
        <p className="mt-3 font-body text-sm text-ink-soft">Last updated: June 2026</p>

        <div className="mt-10 space-y-10 font-body text-sm leading-relaxed text-ink-soft">

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Scope</h2>
            <p>
              This policy applies to orders placed on varcha.in (the premium line only). For
              everyday line products, fulfilment and shipping are handled by Amazon or Flipkart
              under their own policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Processing time</h2>
            <p>
              Orders are processed within <strong className="text-ink">1–2 business days</strong>{' '}
              of confirmed payment. Orders placed on Sundays or public holidays are processed the
              next business day. You will receive an email and/or SMS confirmation once your order
              is dispatched.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Delivery timelines</h2>
            <div className="mt-3 overflow-x-auto rounded-card border border-line">
              <table className="w-full font-body text-sm">
                <thead className="bg-surface text-left">
                  <tr>
                    <th className="border-b border-line px-4 py-3 font-medium text-ink">Zone</th>
                    <th className="border-b border-line px-4 py-3 font-medium text-ink">Estimated delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)', '2–4 business days'],
                    ['Tier-2 cities and state capitals', '4–6 business days'],
                    ['Tier-3 and remote areas', '5–8 business days'],
                  ].map(([zone, time]) => (
                    <tr key={zone} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-ink-soft">{zone}</td>
                      <td className="px-4 py-3 text-ink">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              These are estimates from dispatch date, not from order date. Delivery times may
              extend during sale periods, public holidays, or due to events outside our control
              (weather, strikes, courier disruptions).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Shipping charges</h2>
            <p>
              Shipping charges, if any, are displayed at checkout before payment. We periodically
              offer free shipping above a certain order value — any such threshold will be clearly
              shown on the site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Cash on Delivery</h2>
            <p>
              COD is not available for premium-line orders on this site. All orders are prepaid
              via cards, UPI, or netbanking.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Tracking</h2>
            <p>
              Once your order is dispatched, you will receive a tracking number via email and/or
              SMS. You can also view your order status in your account under{' '}
              <Link href="/account/orders" className="text-wine hover:underline">
                My Orders
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Shipping address</h2>
            <p>
              We ship to addresses across India. Please ensure your shipping address and pincode
              are accurate at checkout. We ship from our studio in Jaipur, Rajasthan. We do not
              currently ship internationally.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Lost or undelivered orders</h2>
            <p>
              If your order shows as delivered but you have not received it, please contact us
              within 48 hours with your order number. If an order is marked undeliverable and
              returned to us, we will reach out to arrange re-delivery or issue a refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Contact</h2>
            <p>
              Shipping queries:{' '}
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

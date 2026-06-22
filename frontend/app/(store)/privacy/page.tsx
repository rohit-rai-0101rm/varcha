export const metadata = {
  title: 'Privacy Policy — Varcha',
  description: 'How Varcha collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-annotation text-[10px] tracking-[0.35em] text-sketch uppercase">
          Legal
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-3 font-body text-sm text-ink-soft">Last updated: June 2026</p>

        <div className="mt-10 space-y-10 font-body text-sm leading-relaxed text-ink-soft">

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">1. Who we are</h2>
            <p>
              Varcha is an artificial jewellery brand selling through two channels: an everyday
              line listed on Amazon and Flipkart, and a premium line sold exclusively on this
              website (varcha.in). This policy applies to data collected on varcha.in only.
              Purchases made on Amazon or Flipkart are governed by those platforms&apos; own privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">2. What we collect and why</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-ink">Account and order data</p>
                <p className="mt-1">
                  When you create an account or place an order, we collect your name, email
                  address, phone number, and shipping address. Phone number is required — it is
                  used for delivery coordination and order status updates. Email is used for order
                  confirmation and shipping notifications.
                </p>
              </div>
              <div>
                <p className="font-medium text-ink">Payment data</p>
                <p className="mt-1">
                  We do not see, handle, or store your card number, CVV, or any payment
                  credentials. All payment processing is handled entirely by Razorpay, a
                  PCI-DSS-compliant payment gateway. We store only the transaction reference
                  number Razorpay returns after a successful payment.
                </p>
              </div>
              <div>
                <p className="font-medium text-ink">Session and engagement data</p>
                <p className="mt-1">
                  On your first visit, we set a session cookie (<code className="text-sketch">varcha_session</code>) — a
                  random UUID that identifies your browser session. We use this to record which
                  pages you viewed, how long you spent on product pages, and which items you
                  clicked. This data is used internally for analytics (understanding which
                  products attract interest) and is never sold or shared with advertisers.
                </p>
              </div>
              <div>
                <p className="font-medium text-ink">Marketing consent</p>
                <p className="mt-1">
                  At signup and checkout, there is an opt-in checkbox for marketing
                  communications. It is unchecked by default. We collect your phone number
                  regardless (needed for delivery), but we only use it for outbound sales or
                  promotional calls if you explicitly check that box.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">3. How we use your data</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Fulfilling and shipping your order</li>
              <li>Sending order confirmation and shipment tracking via email and/or SMS</li>
              <li>Maintaining your account and order history</li>
              <li>Internal analytics to improve the site and product range</li>
              <li>Outbound sales follow-up — only if you gave marketing consent</li>
            </ul>
            <p className="mt-4">
              We do not sell your data. We do not use it for third-party advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">4. Who we share data with</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium text-ink">Razorpay</span> — payment processing.
                Your payment details go directly to them; we receive only a transaction reference.
              </p>
              <p>
                <span className="font-medium text-ink">Courier / logistics partner</span> — your
                name, phone, and shipping address are shared with our courier aggregator solely to
                arrange delivery.
              </p>
              <p>
                <span className="font-medium text-ink">Email / SMS provider</span> — your email
                and phone are passed to our notification provider to send transactional messages.
              </p>
              <p>No other third parties receive your personal data.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">5. Cookies</h2>
            <p>
              We set one first-party cookie: <code className="text-sketch">varcha_session</code> — a
              random UUID, readable by JavaScript, used to link your browsing session to analytics
              events. We do not set any advertising, tracking, or third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">6. Data retention</h2>
            <p>
              Order records are retained for seven years for accounting and GST compliance. Account
              data is retained while your account is active. Session and engagement data is retained
              for up to two years for analytics purposes. You may request deletion of your account
              at any time by writing to us at{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">7. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by
              emailing{' '}
              <a href="mailto:hello@varcha.in" className="text-wine hover:underline">
                hello@varcha.in
              </a>
              . We will respond within 30 days. Note that some data (e.g., order records) may
              be retained for the period required by law even after account deletion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">8. Contact</h2>
            <p>
              Questions about this policy:{' '}
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

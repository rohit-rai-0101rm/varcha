import Link from 'next/link';
import CheckoutCompleteTracker from '@/components/CheckoutCompleteTracker';

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const shortId = orderId.slice(-8).toUpperCase();

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <CheckoutCompleteTracker />
      <div className="mb-6 flex justify-center">
        <svg
          className="h-16 w-16 text-[var(--wine)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Order Confirmed!</h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Thank you for your order. We&apos;ve received your payment and will confirm shipment shortly.
      </p>
      <p className="mt-4 text-sm font-medium text-[var(--ink-soft)]">
        Order ID: <span className="font-mono text-[var(--ink)]">#{shortId}</span>
      </p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">A confirmation email has been sent to you.</p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/account/orders"
          className="rounded-lg border border-[var(--gold)] px-6 py-2.5 font-medium text-[var(--gold)] transition-opacity hover:opacity-80"
        >
          View My Orders
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-[var(--wine)] px-6 py-2.5 font-medium text-[var(--surface)] transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiCreateRazorpayOrder, apiVerifyPayment, type ShippingAddress, type CheckoutContact } from '@/lib/client-api';

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState<ShippingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [contact, setContact] = useState<CheckoutContact>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    marketingConsent: false,
  });

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Your cart is empty</h1>
        <Link href="/" className="mt-8 inline-block rounded-lg bg-[var(--wine)] px-6 py-3 font-medium text-[var(--surface)]">
          Continue Shopping
        </Link>
      </main>
    );
  }

  function validateForm() {
    if (!contact.name.trim()) return 'Name is required';
    if (!contact.phone.trim()) return 'Phone number is required';
    if (!contact.email.trim()) return 'Email is required';
    if (!address.line1.trim()) return 'Address line 1 is required';
    if (!address.city.trim()) return 'City is required';
    if (!address.state) return 'State is required';
    if (!/^\d{6}$/.test(address.pincode)) return 'Valid 6-digit pincode is required';
    return null;
  }

  async function handlePay() {
    setError('');
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { setError('Failed to load payment SDK. Check your connection.'); return; }

      const orderData = await apiCreateRazorpayOrder(
        items.map((i) => ({ productId: i.productId, qty: i.qty })),
      );

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.razorpayOrderId,
          name: 'Varcha',
          description: `Order of ${items.length} item(s)`,
          prefill: {
            name: contact.name,
            email: contact.email,
            contact: contact.phone,
          },
          theme: { color: '#6E2A39' },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const { orderId } = await apiVerifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
                shippingAddress: address,
                contact,
              });
              clearCart();
              router.push(`/order-confirmation/${orderId}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('DISMISSED')),
          },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DISMISSED') {
        // user closed the modal — not an error
      } else {
        setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] placeholder-[var(--ink-soft)] focus:border-[var(--wine)] focus:outline-none';

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: form */}
        <div className="space-y-6">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">Contact Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Full Name *</label>
                <input
                  className={inputCls}
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Priya Sharma"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Phone *</label>
                <input
                  className={inputCls}
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="9876543210"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Email *</label>
                <input
                  className={inputCls}
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="priya@example.com"
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Address Line 1 *</label>
                <input
                  className={inputCls}
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="Flat 3B, Orchid Heights"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Address Line 2</label>
                <input
                  className={inputCls}
                  value={address.line2 ?? ''}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  placeholder="MG Road (optional)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">City *</label>
                <input
                  className={inputCls}
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Pune"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">Pincode *</label>
                <input
                  className={inputCls}
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="411001"
                  maxLength={6}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-[var(--ink-soft)]">State *</label>
                <select
                  className={inputCls}
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                >
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={contact.marketingConsent ?? false}
              onChange={(e) => setContact({ ...contact, marketingConsent: e.target.checked })}
              className="mt-0.5"
            />
            <span className="text-sm text-[var(--ink-soft)]">
              I agree to receive updates about new collections and offers from Varcha.
            </span>
          </label>
        </div>

        {/* Right: order summary */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">Order Summary</h2>
            <ul className="divide-y divide-[var(--line)]">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between py-3 text-sm">
                  <span className="text-[var(--ink)]">
                    {item.name} <span className="text-[var(--ink-soft)]">× {item.qty}</span>
                  </span>
                  <span className="text-[var(--ink)]">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-semibold text-[var(--ink)]">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full rounded-lg bg-[var(--wine)] py-3 font-semibold text-[var(--surface)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? 'Processing…' : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>

          <p className="text-center text-xs text-[var(--ink-soft)]">
            Secured by Razorpay. Card details are never stored on our servers.
          </p>
        </aside>
      </div>
    </main>
  );
}

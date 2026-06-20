import crypto from 'crypto';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Order, { IOrder } from '../models/Order';
import Payment from '../models/Payment';
import User from '../models/User';
import { sendOrderConfirmation } from './emailService';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
});

interface CartItem {
  productId: string;
  qty: number;
}

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutContact {
  name: string;
  phone: string;
  email: string;
  marketingConsent?: boolean;
}

// Step 1 — validate cart items and create a Razorpay order
export async function createRazorpayOrder(items: CartItem[]) {
  if (!items?.length) throw new Error('Cart is empty');

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== items.length) throw new Error('One or more products are unavailable');

  let totalPaise = 0;
  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) throw new Error('Product not found');
    if (product.channel !== 'website-exclusive') {
      throw new Error(`"${product.name}" is not available for website checkout`);
    }
    if (product.stockQty !== undefined && product.stockQty < item.qty) {
      throw new Error(`"${product.name}" only has ${product.stockQty} in stock`);
    }
    totalPaise += product.price * item.qty * 100; // Razorpay uses paise
  }

  const rzpOrder = await razorpay.orders.create({
    amount: totalPaise,
    currency: 'INR',
    receipt: `varcha_${Date.now()}`,
  });

  return { razorpayOrderId: rzpOrder.id, amount: totalPaise, currency: 'INR' };
}

// Step 2 — verify Razorpay signature, then atomically save order + decrement stock
export async function verifyAndFulfill(opts: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  contact: CheckoutContact;
  userId: string | null;
}) {
  // 1. Verify signature — proves the payment came from Razorpay, not forged
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
    .update(`${opts.razorpayOrderId}|${opts.razorpayPaymentId}`)
    .digest('hex');

  if (expected !== opts.razorpaySignature) throw new Error('Payment verification failed');

  // 2. Idempotency check — if this payment was already processed, return the existing order
  const existingPayment = await Payment.findOne({ gatewayTransactionId: opts.razorpayPaymentId });
  if (existingPayment) {
    const existingOrder = await Order.findById(existingPayment.orderId);
    return existingOrder!;
  }

  // 3. Fetch products for price snapshot
  const productIds = opts.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  let totalAmount = 0;
  const orderItems = opts.items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId)!;
    totalAmount += product.price * item.qty;
    return { productId: product._id, qty: item.qty, price: product.price };
  });

  // 4. Mongo transaction — stock decrement + order creation are atomic
  const session = await mongoose.startSession();
  let order: IOrder;

  try {
    await session.withTransaction(async () => {
      // Decrement stock for each item; abort if any product is out of stock
      for (const item of opts.items) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stockQty: { $gte: item.qty } },
          { $inc: { stockQty: -item.qty } },
          { session, new: true },
        );
        if (!updated) throw new Error('One or more items went out of stock during checkout');
      }

      const [created] = await Order.create(
        [
          {
            userId: opts.userId ? new mongoose.Types.ObjectId(opts.userId) : null,
            guestContact: opts.userId ? null : { name: opts.contact.name, phone: opts.contact.phone, email: opts.contact.email },
            marketingConsent: opts.contact.marketingConsent ?? false,
            items: orderItems,
            shippingAddress: opts.shippingAddress,
            paymentMethod: 'gateway',
            paymentStatus: 'paid',
            orderStatus: 'placed',
            totalAmount,
            razorpayOrderId: opts.razorpayOrderId,
          },
        ],
        { session },
      );
      order = created;

      await Payment.create(
        [
          {
            orderId: order._id,
            gatewayTransactionId: opts.razorpayPaymentId,
            razorpayOrderId: opts.razorpayOrderId,
            amount: totalAmount,
            status: 'success',
            method: 'razorpay',
          },
        ],
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  // 5. Send confirmation email (non-blocking — failure never breaks the order)
  const toEmail = opts.userId
    ? (await User.findById(opts.userId))?.email ?? opts.contact.email
    : opts.contact.email;

  const emailItems = opts.items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId)!;
    return { name: product.name, qty: item.qty, price: product.price };
  });

  sendOrderConfirmation({
    to: toEmail,
    name: opts.contact.name,
    orderId: order!._id.toString(),
    items: emailItems,
    totalAmount,
    shippingAddress: opts.shippingAddress,
  }).catch(() => {});

  return order!;
}

// Webhook handler — idempotent, secondary path
export async function handleWebhook(rawBody: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return; // not configured yet in dev

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expected !== signature) throw new Error('Invalid webhook signature');

  const event = JSON.parse(rawBody);
  if (event.event !== 'payment.captured') return;

  const paymentId = event.payload?.payment?.entity?.id;
  if (!paymentId) return;

  // Idempotency — if verify-payment already ran, Payment doc exists; skip
  const exists = await Payment.findOne({ gatewayTransactionId: paymentId });
  if (exists) return;

  // If verify-payment hasn't run yet (rare), update order payment status
  const razorpayOrderId = event.payload?.payment?.entity?.order_id;
  if (razorpayOrderId) {
    await Order.updateOne({ razorpayOrderId }, { paymentStatus: 'paid' });
  }
}

import { Request, Response } from 'express';
import { createRazorpayOrder, verifyAndFulfill, handleWebhook } from '../services/checkoutService';

export async function createOrder(req: Request, res: Response) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items is required' });
    }
    const result = await createRazorpayOrder(items);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    res.status(400).json({ message });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, items, shippingAddress, contact } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !items || !shippingAddress || !contact) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userId = (req as Request & { userId?: string }).userId ?? null;

    const order = await verifyAndFulfill({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      shippingAddress,
      contact,
      userId,
    });

    res.json({ orderId: order._id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment verification failed';
    res.status(400).json({ message });
  }
}

export async function webhook(req: Request, res: Response) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as Request & { rawBody?: string }).rawBody ?? req.body.toString();
    await handleWebhook(rawBody, signature);
    res.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    res.status(400).json({ message });
  }
}

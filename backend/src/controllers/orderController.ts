import { Request, Response } from 'express';
import Order from '../models/Order';

interface AuthRequest extends Request {
  userId?: string;
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images slug');
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId }).populate(
      'items.productId',
      'name images slug',
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

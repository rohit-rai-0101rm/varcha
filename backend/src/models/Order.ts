import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId | null;
  guestContact: { name: string; phone: string; email: string } | null;
  marketingConsent: boolean;
  items: { productId: mongoose.Types.ObjectId; qty: number; price: number }[];
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
  paymentMethod: 'gateway' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  totalAmount: number;
  razorpayOrderId: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    guestContact: {
      type: new Schema({ name: String, phone: String, email: String }, { _id: false }),
      default: null,
    },
    marketingConsent: { type: Boolean, default: false },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        _id: false,
      },
    ],
    shippingAddress: {
      type: new Schema(
        { line1: String, line2: String, city: String, state: String, pincode: String },
        { _id: false },
      ),
      required: true,
    },
    paymentMethod: { type: String, enum: ['gateway', 'cod'], default: 'gateway' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<IOrder>('Order', OrderSchema);

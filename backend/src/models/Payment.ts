import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  gatewayTransactionId: string;
  razorpayOrderId: string;
  amount: number;
  status: 'initiated' | 'success' | 'failed' | 'refunded';
  method: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    gatewayTransactionId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['initiated', 'success', 'failed', 'refunded'],
      default: 'success',
    },
    method: { type: String, default: 'razorpay' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);

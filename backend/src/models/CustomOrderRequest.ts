import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomOrderRequest extends Document {
  name: string;
  phone: string;
  email?: string;
  occasion?: string;
  budgetRange?: string;
  preferredStone?: string;
  referenceImageUrl?: string;
  message?: string;
  createdAt: Date;
}

const CustomOrderRequestSchema = new Schema<ICustomOrderRequest>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  occasion: String,
  budgetRange: String,
  preferredStone: String,
  referenceImageUrl: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomOrderRequest>('CustomOrderRequest', CustomOrderRequestSchema);

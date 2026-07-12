import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadCartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  qty: number;
  price: number;
}

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  cartItems?: ILeadCartItem[];
  createdAt: Date;
}

const LeadCartItemSchema = new Schema<ILeadCartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  cartItems: { type: [LeadCartItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILead>('Lead', LeadSchema);

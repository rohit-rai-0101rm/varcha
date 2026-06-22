import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  images: Array<{ url: string; type: 'product-shot' | 'model-shot' }>;
  description: string;
  styleIds: mongoose.Types.ObjectId[];
  occasion: string[];
  gender: 'women' | 'men' | 'kids';
  channel: 'marketplace' | 'website-exclusive';
  marketplaceLinks?: Array<{ platform: 'amazon' | 'flipkart'; url: string }>;
  stockQty?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['product-shot', 'model-shot'], required: true },
      },
    ],
    description: { type: String, default: '' },
    styleIds: [{ type: Schema.Types.ObjectId, ref: 'Style' }],
    occasion: [{ type: String }],
    gender: { type: String, enum: ['women', 'men', 'kids'], required: true },
    channel: { type: String, enum: ['marketplace', 'website-exclusive'], required: true },
    marketplaceLinks: [
      {
        platform: { type: String, enum: ['amazon', 'flipkart'] },
        url: String,
      },
    ],
    stockQty: Number,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);

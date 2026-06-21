import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  linkUrl: string;
  position: 'home-hero' | 'category-top' | 'sidebar';
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const BannerSchema = new Schema<IBanner>({
  image: { type: String, required: true },
  linkUrl: { type: String, default: '/' },
  position: {
    type: String,
    enum: ['home-hero', 'category-top', 'sidebar'],
    required: true,
  },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<IBanner>('Banner', BannerSchema);

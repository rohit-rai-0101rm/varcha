import mongoose, { Schema, Document } from 'mongoose';

export interface IStyle extends Document {
  name: string;
  slug: string;
  family: 'indian-craft' | 'global-tradition' | 'aesthetic';
  image?: string;
  isActive: boolean;
}

const StyleSchema = new Schema<IStyle>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  family: {
    type: String,
    enum: ['indian-craft', 'global-tradition', 'aesthetic'],
    required: true,
  },
  image: String,
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<IStyle>('Style', StyleSchema);

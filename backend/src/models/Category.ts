import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentCategory?: mongoose.Types.ObjectId;
  image?: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  image: String,
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<ICategory>('Category', CategorySchema);

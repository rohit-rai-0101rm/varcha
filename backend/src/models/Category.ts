import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentCategory?: mongoose.Types.ObjectId;
  image?: string;
  isActive: boolean;
  showInNav: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  image: String,
  isActive: { type: Boolean, default: true },
  showInNav: { type: Boolean, default: true },
});

// $graphLookup (used to resolve a category's full descendant tree when
// listing products) walks parentCategory at every level of the tree —
// without this index it falls back to a collection scan per level.
CategorySchema.index({ parentCategory: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);
